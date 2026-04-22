'use client'

import React from 'react'
import { Flame, Target, CheckCircle2, Zap } from 'lucide-react'
import { startOfWeek, isAfter } from 'date-fns'

export default function CoupleProgress({ tarefas, metas }) {
  const hoje = new Date()
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 })

  const concluidas = tarefas.filter((t) => t.status === 'concluida')
  const concluidasSemana = concluidas.filter((t) => {
    if (!t.updated_date) return false
    return isAfter(new Date(t.updated_date), inicioSemana)
  })

  const metasConcluidas = metas.filter((m) => (m.valor_atual || 0) >= (m.valor_total || 1))
  const totalTarefas = tarefas.length || 1
  const alinhamento = Math.min(Math.round((concluidas.length / totalTarefas) * 100), 100)
  const sequencia = Math.min(concluidasSemana.length + 1, 30)

  const stats = [
    {
      icon: Flame,
      value: `${sequencia} dias`,
      sub: 'de organização',
      color: 'text-warning',
      bg: 'bg-warning/12',
    },
    {
      icon: CheckCircle2,
      value: `${concluidasSemana.length} tarefas`,
      sub: 'concluídas juntos',
      color: 'text-primary',
      bg: 'bg-primary/12',
    },
    {
      icon: Target,
      value: `${metasConcluidas.length} concluídas`,
      sub: 'neste mês',
      color: 'text-moss-600 dark:text-moss-200',
      bg: 'bg-moss-500/12',
    },
    {
      icon: Zap,
      value: `${alinhamento}%`,
      sub: 'nível do casal',
      color: 'text-blush-600 dark:text-blush-200',
      bg: 'bg-blush-500/12',
    },
  ]

  return (
    <div className="rounded-[28px] border border-primary/20 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.72))] p-5 shadow-panel">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="kicker mb-2">Evolução conjunta</p>
          <h2 className="font-cormorant text-2xl font-semibold tracking-[-0.03em] text-foreground">
            Evolução do casal
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Vocês estão construindo constância juntos.</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-[hsl(var(--surface-elevated)/0.94)] px-3 py-1.5 shadow-soft">
          <Flame className="h-3.5 w-3.5 text-warning" />
          <span className="text-xs font-semibold text-foreground">{sequencia} dias</span>
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-muted-foreground">Nível de alinhamento</span>
          <span className="font-semibold text-primary">{alinhamento}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full border border-border/60 bg-[hsl(var(--surface-soft)/0.92)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-blush-400 transition-all duration-700"
            style={{ width: `${alinhamento}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="surface-tile rounded-xl p-3">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.bg}`}>
              <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
            </div>
            <p className={`mt-2 text-base font-bold leading-none ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-[10px] leading-tight text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {concluidasSemana.length > 0 && (
        <div className="mt-4 rounded-xl border border-primary/15 bg-primary/10 p-3">
          <p className="text-xs text-[hsl(var(--text-secondary))]">
            Vocês concluíram <strong>{concluidasSemana.length} tarefa{concluidasSemana.length !== 1 ? 's' : ''}</strong> esta semana.
            {alinhamento >= 70 ? ' Excelente alinhamento.' : ' Continue assim, cada entrega fortalece a parceria.'}
          </p>
        </div>
      )}
    </div>
  )
}
