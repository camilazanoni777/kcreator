'use client'

import React, { useState } from 'react';
import PageHeader from '../components/shared/PageHeader';
import BentoCard from '../components/shared/BentoCard';
import { useEntityList, useEntityMutations } from '../lib/hooks/useEntities';
import { formatBRL } from '../lib/formatCurrency';
import { Video, DollarSign, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ETAPAS = [
  { key: 'ideia', label: '💡 Ideias / Brainstorm', bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted-foreground/20' },
  { key: 'roteiro', label: '📝 Roteirizando', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  { key: 'gravacao', label: '🎥 Para Gravar', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  { key: 'edicao', label: '✂️ Em Edição', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  { key: 'postado', label: '🚀 Finalizado/Postado', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
];

const nextEtapa = { ideia: 'roteiro', roteiro: 'gravacao', gravacao: 'edicao', edicao: 'postado' };

export default function Estudio() {
  const { data: conteudos } = useEntityList('Conteudo');
  const { create, update, remove } = useEntityMutations('Conteudo');

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('organico');
  const [receita, setReceita] = useState('');

  const receitaConfirmada = conteudos
    .filter(c => c.tipo === 'publi' && c.status_receita === 'confirmado')
    .reduce((s, c) => s + (c.receita || 0), 0);

  const receitaNegociacao = conteudos
    .filter(c => c.tipo === 'publi' && c.status_receita === 'negociacao')
    .reduce((s, c) => s + (c.receita || 0), 0);

  const handleAdd = () => {
    if (!titulo.trim()) return;
    create.mutate({
      titulo,
      tipo,
      receita: Number(receita) || 0,
      status_receita: 'negociacao',
      etapa: 'ideia',
    });
    setTitulo('');
    setReceita('');
    setTipo('organico');
  };

  return (
    <div>
      <PageHeader title="Estúdio Criador" subtitle="Sua esteira de produção de conteúdo em um só lugar" />
      <div className="px-4 sm:px-8 pb-8 space-y-6">

        {/* Resumo + Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BentoCard title="Publis & Jobs (Mês)" icon={DollarSign}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-muted-foreground block">Receita Confirmada</span>
                <p className="text-2xl font-bold text-green-400">{formatBRL(receitaConfirmada)}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Em Negociação</span>
                <p className="text-xl font-bold text-yellow-400">{formatBRL(receitaNegociacao)}</p>
              </div>
            </div>
          </BentoCard>

          <BentoCard title="Adicionar Conteúdo" icon={Video}>
            <div className="flex flex-wrap gap-2">
              <Input className="flex-[2] min-w-[160px]" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ideia de vídeo / Job" />
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="organico">Orgânico</SelectItem>
                  <SelectItem value="publi">Publi (Pago)</SelectItem>
                </SelectContent>
              </Select>
              <Input className="w-[100px]" type="number" value={receita} onChange={e => setReceita(e.target.value)} placeholder="R$ Valor" />
              <Button onClick={handleAdd}><Plus className="w-4 h-4" /></Button>
            </div>
          </BentoCard>
        </div>

        {/* Kanban de Conteúdo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ETAPAS.map(etapa => {
            const items = conteudos.filter(c => c.etapa === etapa.key);
            return (
              <div key={etapa.key} className={cn("rounded-xl border bg-card/50", etapa.border)}>
                <div className={cn("px-3 py-2 rounded-t-xl", etapa.bg)}>
                  <h3 className={cn("text-xs font-semibold", etapa.text)}>{etapa.label}</h3>
                </div>
                <div className="p-2 space-y-2 max-h-[50vh] overflow-y-auto">
                  {items.map(c => (
                    <div key={c.id} className="p-2.5 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-medium flex-1 truncate">{c.titulo}</p>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {nextEtapa[etapa.key] && (
                            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => update.mutate({ id: c.id, data: { etapa: nextEtapa[etapa.key] } })}>
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" className="h-5 w-5 text-destructive" onClick={() => remove.mutate(c.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-1 items-center">
                        <Badge variant="outline" className="text-[9px] py-0 h-4">{c.tipo === 'publi' ? 'Publi' : 'Orgânico'}</Badge>
                        {c.tipo === 'publi' && c.receita > 0 && (
                          <span className="text-[10px] text-green-400">{formatBRL(c.receita)}</span>
                        )}
                        {c.tipo === 'publi' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 px-1 text-[9px]"
                            onClick={() => update.mutate({
                              id: c.id,
                              data: { status_receita: c.status_receita === 'confirmado' ? 'negociacao' : 'confirmado' }
                            })}
                          >
                            {c.status_receita === 'confirmado' ? '✅' : '⏳'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-[10px] text-muted-foreground text-center py-3">Vazio</p>}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}