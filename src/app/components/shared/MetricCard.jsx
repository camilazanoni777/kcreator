import React from 'react'
import { cn } from '@/lib/utils'

export default function MetricCard({
  label,
  value,
  sub,
  variant = 'default',
  icon: Icon,
  trendUp,
  trend,
  className,
}) {
  const isDashboardCard = typeof className === 'string' && className.includes('dashboard-card-')

  const variantStyles = {
    default: 'border-border/80 bg-[linear-gradient(160deg,hsl(var(--surface-elevated)/0.98),hsl(var(--surface)/0.94))]',
    positive: 'border-moss-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--success-soft)/0.42)_52%,hsl(var(--surface)/0.94)_100%)] dark:border-moss-500/18',
    negative: 'border-rouge-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--destructive)/0.12)_50%,hsl(var(--surface)/0.94)_100%)] dark:border-rouge-500/18',
    primary: 'border-primary/20 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.7)_52%,hsl(var(--surface)/0.94)_100%)]',
    accent: 'border-blush-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent)/0.26)_52%,hsl(var(--surface)/0.94)_100%)]',
    studio: 'border-blush-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.46)_48%,hsl(var(--surface)/0.94)_100%)]',
  }

  const iconStyles = {
    default: 'bg-[hsl(var(--surface-soft)/0.92)] text-muted-foreground dark:bg-[hsl(var(--surface-soft)/0.92)] dark:text-[hsl(var(--text-secondary))]',
    positive: 'bg-moss-100 text-moss-600 dark:bg-[#183028] dark:text-[#c2ddd0]',
    negative: 'bg-rouge-100 text-rouge-500 dark:bg-[#311b22] dark:text-[#f0c3ca]',
    primary: 'bg-iris-100 text-iris-600 dark:bg-[#212944] dark:text-[#d6dcfb]',
    accent: 'bg-blush-100 text-blush-600 dark:bg-[#2b223b] dark:text-[#ead4f7]',
    studio: 'bg-gradient-to-br from-blush-100 to-iris-100 text-iris-700 dark:from-[#2a3150] dark:to-[#1e2540] dark:text-[#dfe3ff]',
  }

  return (
    <div
      className={cn(
        'group rounded-[26px] border p-5 shadow-panel transition-all duration-300 hover:-translate-y-0.5 hover:shadow-panel-hover',
        !isDashboardCard && (variantStyles[variant] || variantStyles.default),
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground/85">
            {label}
          </p>
          <p className="stat-number truncate text-2xl">{value}</p>
          {sub && (
            <p className="mt-2 text-sm leading-5 text-muted-foreground">{sub}</p>
          )}
          {trend && (
            <p
              className={cn(
                'mt-3 text-[11px] font-semibold uppercase tracking-[0.14em]',
                trendUp ? 'text-moss-600 dark:text-[#c2ddd0]' : 'text-rouge-500 dark:text-[#f0c3ca]'
              )}
            >
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-soft', iconStyles[variant] || iconStyles.default)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  )
}
