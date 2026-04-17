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
    default: 'border-border/80 bg-white/95',
    positive: 'border-moss-200/80 bg-gradient-to-br from-white via-moss-50/90 to-[#f8fff9]',
    negative: 'border-rouge-200/80 bg-gradient-to-br from-white via-rouge-50 to-[#fff8f8]',
    primary: 'border-iris-200/80 bg-gradient-to-br from-white via-iris-50/85 to-blush-50/70',
    accent: 'border-blush-200/80 bg-gradient-to-br from-white via-blush-50/85 to-iris-50/60',
    studio: 'border-blush-200/90 bg-gradient-to-br from-white via-blush-50/80 to-[#fffafb]',
  }

  const iconStyles = {
    default: 'bg-secondary text-muted-foreground',
    positive: 'bg-moss-100 text-moss-600',
    negative: 'bg-rouge-100 text-rouge-500',
    primary: 'bg-iris-100 text-iris-600',
    accent: 'bg-blush-100 text-blush-600',
    studio: 'bg-gradient-to-br from-blush-100 to-iris-100 text-iris-700',
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
