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
  const variantStyles = {
    default: 'border-border/80 bg-[linear-gradient(160deg,hsl(var(--surface-elevated)/0.98),hsl(var(--surface)/0.94))]',
    positive: 'border-moss-200/70 bg-gradient-to-br from-white via-moss-50/90 to-[#f8fff9] dark:border-moss-500/15 dark:from-[#1c2420] dark:via-[#17201a] dark:to-[#141a16]',
    negative: 'border-rouge-200/70 bg-gradient-to-br from-white via-rouge-50 to-[#fff8f8] dark:border-rouge-500/15 dark:from-[#281b1d] dark:via-[#231618] dark:to-[#191214]',
    primary: 'border-primary/20 bg-gradient-to-br from-white via-iris-50/85 to-blush-50/70 dark:from-[#271e25] dark:via-[#221b23] dark:to-[#1b171d]',
    accent: 'border-blush-200/70 bg-gradient-to-br from-white via-blush-50/85 to-iris-50/60 dark:from-[#281e24] dark:via-[#221b21] dark:to-[#1b171d]',
    studio: 'border-blush-200/70 bg-gradient-to-br from-white via-blush-50/80 to-[#fffafb] dark:from-[#251d23] dark:via-[#211920] dark:to-[#19151b]',
  }

  const iconStyles = {
    default: 'bg-[hsl(var(--surface-soft)/0.92)] text-muted-foreground',
    positive: 'bg-moss-100 text-moss-600 dark:bg-moss-500/15 dark:text-moss-200',
    negative: 'bg-rouge-100 text-rouge-500 dark:bg-rouge-500/15 dark:text-rouge-200',
    primary: 'bg-iris-100 text-iris-600 dark:bg-iris-500/15 dark:text-iris-200',
    accent: 'bg-blush-100 text-blush-600 dark:bg-blush-500/15 dark:text-blush-200',
    studio: 'bg-gradient-to-br from-blush-100 to-iris-100 text-iris-700 dark:from-[#3e2631] dark:to-[#2a1a23] dark:text-rose-100',
  }

  return (
    <div
      className={cn(
        'group rounded-[26px] border p-5 shadow-panel transition-all duration-300 hover:-translate-y-0.5 hover:shadow-panel-hover',
        variantStyles[variant] || variantStyles.default,
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
                trendUp ? 'text-moss-600' : 'text-rouge-500'
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
