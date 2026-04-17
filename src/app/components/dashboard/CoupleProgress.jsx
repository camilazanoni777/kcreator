'use client'

import React from 'react';
import { Flame, Target, CheckCircle2, Zap } from 'lucide-react';
import { startOfWeek, isAfter } from 'date-fns';

export default function CoupleProgress({ tarefas, metas }) {
  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });

  const concluidas = tarefas.filter(t => t.status === 'concluida');
  const concluidasSemana = concluidas.filter(t => {
    if (!t.updated_date) return false;
    return isAfter(new Date(t.updated_date), inicioSemana);
  });

  const metasConcluidas = metas.filter(m => (m.valor_atual || 0) >= (m.valor_total || 1));

  const totalTarefas = tarefas.length || 1;
  const alinhamento = Math.min(Math.round((concluidas.length / totalTarefas) * 100), 100);

  // Simula sequência baseada em tarefas concluídas recentes
  const sequencia = Math.min(concluidasSemana.length + 1, 30);

  const stats = [
    {
      icon: Flame,
      label: 'Sequência',
      value: `${sequencia} dias`,
      sub: 'de organização',
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
    },
    {
      icon: CheckCircle2,
      label: 'Esta semana',
      value: `${concluidasSemana.length} tarefas`,
      sub: 'concluídas juntos',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Target,
      label: 'Metas',
      value: `${metasConcluidas.length} concluídas`,
      sub: 'neste mês',
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: Zap,
      label: 'Alinhamento',
      value: `${alinhamento}%`,
      sub: 'nível do casal',
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
    },
  ];

  return (
    <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-playfair text-base font-semibold text-foreground">Evolução do Casal</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Vocês estão construindo constância juntos 🤍</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-semibold text-foreground">{sequencia} dias</span>
        </div>
      </div>

      {/* Barra de alinhamento */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Nível de alinhamento</span>
          <span className="font-semibold text-primary">{alinhamento}%</span>
        </div>
        <div className="h-2 rounded-full bg-border/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
            style={{ width: `${alinhamento}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl bg-card/60 border border-border/40">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg}`}>
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
            </div>
            <p className={`text-base font-bold leading-none mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Insight */}
      {concluidasSemana.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-primary/8 border border-primary/10">
          <p className="text-xs text-primary/80">
            ✨ Vocês concluíram <strong>{concluidasSemana.length} tarefa{concluidasSemana.length !== 1 ? 's' : ''}</strong> esta semana.
            {alinhamento >= 70 ? ' Excelente alinhamento!' : ' Continue assim — cada tarefa fortalece a parceria.'}
          </p>
        </div>
      )}
    </div>
  );
}