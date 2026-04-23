'use client'

import { Dumbbell, Plus, Trash2, Minus } from 'lucide-react';
import { useState } from 'react';
import BentoCard from '@/components/shared/BentoCard';
import PageHeader from '@/components/shared/PageHeader';
import { useEntityList, useEntityMutations } from '@/lib/hooks/useEntities';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const CATEGORIAS = ['Saúde', 'Mente', 'Finanças', 'Relacionamento', 'Trabalho', 'Outros'];

const catColors = {
  'Saúde': 'text-success bg-success/12',
  'Mente': 'text-info bg-info/12',
  'Finanças': 'text-accent bg-accent/10',
  'Relacionamento': 'text-primary bg-primary/10',
  'Trabalho': 'text-chart-5 bg-chart-5/12',
  'Outros': 'text-muted-foreground bg-secondary',
};

export default function Habitos() {
  const { data: habitos } = useEntityList('Habito');
  const { create, update, remove } = useEntityMutations('Habito');
  const [form, setForm] = useState({ nome: '', emoji: '', frequencia: 'diario', categoria: 'Saúde', meta_dias: 30 });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    create.mutate({ ...form, dias_feitos: 0, ativo: true, meta_dias: Number(form.meta_dias) });
    setForm({ nome: '', emoji: '', frequencia: 'diario', categoria: 'Saúde', meta_dias: 30 });
    setShowForm(false);
  };

  const habitosAtivos = habitos.filter(h => h.ativo !== false);
  const habitosConcluidos = habitos.filter(h => (h.dias_feitos || 0) >= (h.meta_dias || 30));

  return (
    <div>
      <PageHeader title="Meus Hábitos" subtitle="Pequenos passos constroem grandes mudanças" italic />
      <div className="px-4 sm:px-8 pb-8 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border/60 bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{habitosAtivos.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Hábitos ativos</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-4 text-center">
            <p className="text-2xl font-bold text-success">{habitosConcluidos.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Metas atingidas</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">
              {habitosAtivos.length > 0 ? Math.round(habitosAtivos.reduce((s, h) => s + (h.dias_feitos || 0), 0) / habitosAtivos.length) : 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Dias médios</p>
          </div>
        </div>

        {/* Botão abrir form */}
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(!showForm)} size="sm" variant={showForm ? "outline" : "default"}>
            <Plus className="w-4 h-4 mr-1.5" />
            {showForm ? 'Cancelar' : 'Novo Hábito'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <BentoCard title="Adicionar Hábito" icon={Dumbbell}>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Nome do hábito</Label>
                  <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Meditar 10 min" required />
                </div>
                <div>
                  <Label className="text-xs">Emoji</Label>
                  <Input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} placeholder="🎯" maxLength={2} />
                </div>
                <div>
                  <Label className="text-xs">Meta (dias)</Label>
                  <Input type="number" min="1" value={form.meta_dias} onChange={e => setForm({ ...form, meta_dias: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Categoria</Label>
                  <Select value={form.categoria} onValueChange={v => setForm({ ...form, categoria: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Frequência</Label>
                  <Select value={form.frequencia} onValueChange={v => setForm({ ...form, frequencia: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Adicionar Hábito</Button>
            </form>
          </BentoCard>
        )}

        {/* Lista de hábitos */}
        {habitosAtivos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-base font-medium text-foreground mb-1">Nenhum hábito ainda</p>
            <p className="text-sm text-muted-foreground">Adicione seu primeiro hábito e comece a construir constância.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {habitosAtivos.map(h => {
              const pct = Math.min(((h.dias_feitos || 0) / (h.meta_dias || 30)) * 100, 100);
              const concluido = pct >= 100;
              return (
                <div key={h.id} className={cn("rounded-2xl border p-4 bg-card", concluido ? "border-success/30" : "border-border/60")}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{h.emoji || '🎯'}</span>
                      <div>
                        <p className="text-sm font-medium">{h.nome}</p>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", catColors[h.categoria] || catColors['Outros'])}>
                          {h.categoria}
                        </span>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove.mutate(h.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{h.dias_feitos || 0} de {h.meta_dias || 30} dias</span>
                      <span className={concluido ? 'text-success font-semibold' : 'font-semibold'}>{Math.round(pct)}%</span>
                    </div>
                    <Progress value={pct} className={cn("h-1.5", concluido ? "[&>div]:bg-success" : "")} />
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm" variant="outline" className="flex-1 h-8 text-xs"
                      disabled={(h.dias_feitos || 0) <= 0}
                      onClick={() => update.mutate({ id: h.id, data: { dias_feitos: (h.dias_feitos || 0) - 1 } })}
                    >
                      <Minus className="w-3 h-3 mr-1" /> Desfazer
                    </Button>
                    <Button
                      size="sm" className="flex-1 h-8 text-xs"
                      onClick={() => update.mutate({ id: h.id, data: { dias_feitos: (h.dias_feitos || 0) + 1 } })}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Feito hoje
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
