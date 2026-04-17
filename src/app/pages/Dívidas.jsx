'use client'

import React, { useState } from 'react';
import PageHeader from '../components/shared/PageHeader';
import BentoCard from '../components/shared/BentoCard';
import { useEntityList, useEntityMutations } from '../lib/hooks/useEntities';
import { formatBRL } from '../lib/formatCurrency';
import { CreditCard, Plus, Minus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

export default function Dividas() {
  const { data: dividas } = useEntityList('Divida');
  const { create, update, remove } = useEntityMutations('Divida');
  const [form, setForm] = useState({ nome: '', valor_total: '', responsavel: 'Victor', parcelas_total: '', parcelas_pagas: '0' });

  const handleSubmit = (e) => {
    e.preventDefault();
    create.mutate({
      nome: form.nome,
      valor_total: Number(form.valor_total),
      responsavel: form.responsavel,
      parcelas_total: Number(form.parcelas_total),
      parcelas_pagas: Number(form.parcelas_pagas),
    });
    setForm({ nome: '', valor_total: '', responsavel: 'Victor', parcelas_total: '', parcelas_pagas: '0' });
  };

  return (
    <div>
      <PageHeader title="Dívidas" subtitle="Calculadora e controle de parcelas" />
      <div className="px-4 sm:px-8 pb-8 space-y-6">

        <BentoCard title="Nova Dívida" icon={CreditCard}>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Nome</Label>
              <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Carro" required />
            </div>
            <div>
              <Label className="text-xs">Valor Total (R$)</Label>
              <Input type="number" step="0.01" value={form.valor_total} onChange={e => setForm({ ...form, valor_total: e.target.value })} required />
            </div>
            <div>
              <Label className="text-xs">Quem deve</Label>
              <Select value={form.responsavel} onValueChange={v => setForm({ ...form, responsavel: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Victor', 'Camila', 'Ambos'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Nº Parcelas</Label>
              <Input type="number" min="1" value={form.parcelas_total} onChange={e => setForm({ ...form, parcelas_total: e.target.value })} required />
            </div>
            <div>
              <Label className="text-xs">Parcelas Pagas</Label>
              <Input type="number" min="0" value={form.parcelas_pagas} onChange={e => setForm({ ...form, parcelas_pagas: e.target.value })} />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">Adicionar</Button>
            </div>
          </form>
        </BentoCard>

        <BentoCard title="Lista de Dívidas">
          {dividas.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">Nenhuma dívida cadastrada ✅</p>
          ) : (
            <div className="space-y-3">
              {dividas.map(d => {
                const parcela = (d.valor_total || 0) / (d.parcelas_total || 1);
                const pago = parcela * (d.parcelas_pagas || 0);
                const restante = (d.valor_total || 0) - pago;
                const percent = ((d.parcelas_pagas || 0) / (d.parcelas_total || 1)) * 100;
                return (
                  <div key={d.id} className="p-4 rounded-lg border border-border bg-secondary/30 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{d.nome}</p>
                        <p className="text-xs text-muted-foreground">{d.responsavel} · {formatBRL(d.valor_total)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          disabled={(d.parcelas_pagas || 0) <= 0}
                          onClick={() => update.mutate({ id: d.id, data: { parcelas_pagas: (d.parcelas_pagas || 0) - 1 } })}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-xs font-mono w-12 text-center">{d.parcelas_pagas || 0}/{d.parcelas_total}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          disabled={(d.parcelas_pagas || 0) >= (d.parcelas_total || 0)}
                          onClick={() => update.mutate({ id: d.id, data: { parcelas_pagas: (d.parcelas_pagas || 0) + 1 } })}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove.mutate(d.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-400">Pago: {formatBRL(pago)}</span>
                      <span className="text-destructive">Resta: {formatBRL(restante)}</span>
                      <span className="text-muted-foreground">Parcela: {formatBRL(parcela)}</span>
                    </div>
                    <Progress value={percent} className="h-2" />
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