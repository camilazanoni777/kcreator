import React from 'react'
import { cn } from '@/lib/utils'

export default function HeroCard({
  eyebrow,
  title,
  subtitle,
  progressLabel,
  progressValue,
  progressText,
  streak,
  nivel,
  stats,
  action,
  rightNote,
  className,
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[36px] border border-primary/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(247,240,244,0.94)_46%,rgba(243,230,236,0.92)_100%)] p-6 shadow-panel sm:p-8 dark:bg-[linear-gradient(145deg,rgba(37,21,30,0.96),rgba(26,16,22,0.98)_46%,rgba(17,10,15,1)_100%)]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(246,216,240,0.24),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(192,132,252,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.14),transparent_30%)]" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_320px]">
        <div className="space-y-5">
          {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
          <div className="space-y-3">
            <h1 className="font-cormorant text-4xl font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[hsl(var(--text-secondary))] sm:text-[15px]">
              {subtitle}
            </p>
          </div>
          {action ? <div className="header-actions">{action}</div> : null}
          {progressLabel != null && progressValue != null && (
            <div className="surface-tile p-4 backdrop-blur-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{progressLabel}</p>
                  {progressText ? (
                    <p className="mt-1 text-xs text-muted-foreground">{progressText}</p>
                  ) : null}
                </div>
                <div className="rounded-full bg-iris-100 px-3 py-1 text-xs font-semibold text-iris-700 dark:bg-[#442938] dark:text-rose-100">
                  {progressValue}%
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-border/60 bg-[hsl(var(--surface-soft)/0.96)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-iris-500 via-iris-400 to-blush-300 transition-all duration-700"
                  style={{ width: `${Math.min(100, progressValue)}%` }}
                />
              </div>
            </div>
          )}
          {stats?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="surface-tile rounded-[22px] px-4 py-3 backdrop-blur-sm"
                >
                  <p className="mb-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                    {s.label}
                  </p>
                  <p className="stat-number text-lg">{s.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="surface-tile rounded-[28px] p-5 backdrop-blur-sm">
              <p className="kicker mb-2">Streak</p>
              <p className="stat-number text-3xl">{streak ?? 0}</p>
              <p className="mt-2 text-xs text-muted-foreground">consistência em foco</p>
            </div>
            <div className="surface-tile rounded-[28px] p-5 backdrop-blur-sm">
              <p className="kicker mb-2">Nível</p>
              <p className="text-base font-semibold tracking-[-0.02em] text-foreground">
                {nivel || 'Em construção'}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">ritmo do seu ciclo</p>
            </div>
          </div>
          <div className="surface-tile rounded-[30px] p-5 backdrop-blur-sm">
            <p className="kicker mb-2">Resumo da semana</p>
            <p className="text-sm leading-6 text-[hsl(var(--text-secondary))]">
              {rightNote || subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
