'use client'

import { useState } from 'react';
import { CheckCheck, AlertTriangle, Flame, Target, Plus, Trash2 } from 'lucide-react';
import BentoCard from '@/components/shared/BentoCard';
import PageHeader from '@/components/shared/PageHeader';
import { formatBRL } from '@/lib/formatCurrency';
import { useEntityList, useEntityMutations } from '@/lib/hooks/useEntities';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { isThisWeek } from 'date-fns';

export default function Analytics() {
  const { data: tarefas } = useEntityList('Tarefa');
  const { data: metas } = useEntityList('Meta');
  const metaMut = useEntityMutations('Meta');

  const [metaForm, setMetaForm] = useState({ titulo: '', valor_total: '', responsavel: 'Victor', prazo: '' });

  const tarefasSemana = tarefas.filter(t => t.status === 'concluida' && t.updated_date && isThisWeek(new Date(t.updated_date))).length;

  const areasCount = {};
  tarefas.filter(t => t.status === 'concluida').forEach(t => {
    areasCount[t.area || 'Geral'] = (areasCount[t.area || 'Geral'] || 0) + 1;
  });
  const areas = ['Geral', 'Casa', 'Finanças', 'Trabalho', 'Saúde'];
  const negligenciadas = areas.filter(a => !areasCount[a] || areasCount[a] === 0);

  const handleMetaSubmit = (e) => {
    e.preventDefault();
    metaMut.create.mutate({ ...metaForm, valor_total: Number(metaForm.valor_total), valor_atual: 0 });
    setMetaForm({ titulo: '', valor_total: '', responsavel: 'Victor', prazo: '' });
  };

  const handleAddValor = (meta) => {
    const val = prompt('Quanto adicionar ao progresso? (R$)');
    if (val && !isNaN(Number(val))) {
      metaMut.update.mutate({ id: meta.id, data: { valor_atual: (meta.valor_atual || 0) + Number(val) } });
    }
  };

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Métricas sobre produtividade e finanças" />
      <div className="px-4 sm:px-8 pb-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BentoCard title="Tarefas da Semana" icon={CheckCheck}>
            <p className="text-4xl font-bold text-primary text-center mt-2">{tarefasSemana}</p>
          </BentoCard>

          <BentoCard title="Áreas Negligenciadas" icon={AlertTriangle} danger>
            {negligenciadas.length === 0 ? (
              <p className="text-xs text-green-400 text-center mt-2">Todas as áreas cobertas ✅</p>
            ) : (
              <div className="space-y-1 mt-1">
                {negligenciadas.map(a => (
                  <div key={a} className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {a} — sem tarefas concluídas
                  </div>
                ))}
              </div>
            )}
          </BentoCard>

          <BentoCard title="Consistência" icon={Flame}>
            <div className="space-y-2 mt-1">
              {areas.map(a => (
                <div key={a} className="flex justify-between text-xs">
                  <span>{a}</span>
                  <span className="font-mono">{areasCount[a] || 0} concluída(s)</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        {/* Metas */}
        <BentoCard title="Cadastro de Metas" icon={Target}>
          <form onSubmit={handleMetaSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <Label className="text-xs">Título</Label>
              <Input value={metaForm.titulo} onChange={e => setMetaForm({ ...metaForm, titulo: e.target.value })} placeholder="Ex: Comprar Notebook" required />
            </div>
            <div>
              <Label className="text-xs">Valor Total (R$)</Label>
              <Input type="number" step="0.01" value={metaForm.valor_total} onChange={e => setMetaForm({ ...metaForm, valor_total: e.target.value })} required />
            </div>
            <div>
              <Label className="text-xs">Responsável</Label>
              <Select value={metaForm.responsavel} onValueChange={v => setMetaForm({ ...metaForm, responsavel: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Victor', 'Camila', 'Ambos'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">Adicionar Meta</Button>
            </div>
          </form>

          {metas.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma meta cadastrada</p>
          ) : (
            <div className="space-y-3">
              {metas.map(m => {
                const percent = Math.min(((m.valor_atual || 0) / (m.valor_total || 1)) * 100, 100);
                return (
                  <div key={m.id} className="space-y-2 rounded-lg border border-border bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.96),hsl(var(--surface-soft)/0.88))] p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">{m.titulo}</p>
                        <p className="text-xs text-muted-foreground">{m.responsavel} · {formatBRL(m.valor_atual || 0)} / {formatBRL(m.valor_total)}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleAddValor(m)}>
                          <Plus className="w-3 h-3 mr-1" /> Valor
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => metaMut.remove.mutate(m.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={percent} className="h-2 flex-1" />
                      <span className="text-xs font-mono">{Math.round(percent)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </BentoCard>

      </div>
    </div>
  );
}
