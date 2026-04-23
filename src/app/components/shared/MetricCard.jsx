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
    default: 'surface-base',
    positive: 'surface-success',
    negative: 'surface-danger',
    primary: 'surface-accent',
    accent: 'surface-accent',
    studio: 'surface-studio',
  }

  const iconStyles = {
    default: 'icon-shell',
    positive: 'icon-shell icon-shell-success',
    negative: 'icon-shell icon-shell-danger',
    primary: 'icon-shell icon-shell-primary',
    accent: 'icon-shell icon-shell-accent',
    studio: 'icon-shell icon-shell-studio',
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
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm', iconStyles[variant] || iconStyles.default)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  )
}
