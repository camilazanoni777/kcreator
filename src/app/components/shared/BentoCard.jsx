import React from 'react'
import { cn } from '@/lib/utils'

export default function BentoCard({
  title,
  icon: Icon,
  children,
  accent,
  danger,
  variant,
  eyebrow,
  action,
  className,
  contentClassName,
}) {
  const resolvedVariant = variant || (danger ? 'danger' : accent ? 'accent' : 'default')
  const isDashboardCard = typeof className === 'string' && className.includes('dashboard-card-')

  const shellStyles = {
    default: 'border-border/80 bg-[linear-gradient(155deg,hsl(var(--surface-elevated)/0.98),hsl(var(--surface)/0.94))] shadow-panel',
    accent: 'border-primary/20 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.72)_48%,hsl(var(--surface)/0.94)_100%)] shadow-panel',
    danger: 'border-rouge-200/60 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--destructive)/0.12)_48%,hsl(var(--surface)/0.94)_100%)] shadow-panel dark:border-rouge-500/18',
    studio: 'border-blush-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.5)_48%,hsl(var(--surface)/0.94)_100%)] shadow-panel',
    success: 'border-moss-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--success-soft)/0.44)_48%,hsl(var(--surface)/0.94)_100%)] shadow-panel dark:border-moss-500/18',
  }

  const iconStyles = {
    default: 'bg-iris-100 text-iris-600 dark:bg-[#212944] dark:text-[#d7ddfb]',
    accent: 'bg-blush-100 text-blush-600 dark:bg-[#2b223b] dark:text-[#ead4f7]',
    danger: 'bg-rouge-100 text-rouge-500 dark:bg-[#311921] dark:text-[#f0c3ca]',
    studio: 'bg-gradient-to-br from-blush-100 to-iris-100 text-iris-700 dark:from-[#293149] dark:to-[#1b2234] dark:text-[#e6def6]',
    success: 'bg-moss-100 text-moss-600 dark:bg-[#183028] dark:text-[#c2ddd0]',
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[28px] border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-panel-hover',
        !isDashboardCard && shellStyles[resolvedVariant],
        className
      )}
    >
      {(eyebrow || title || Icon || action) && (
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-soft',
                  iconStyles[resolvedVariant]
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              {eyebrow ? <p className="kicker mb-1">{eyebrow}</p> : null}
              {title ? (
                <h2 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                  {title}
                </h2>
              ) : null}
            </div>
          </div>
          {action ? <div className="header-actions shrink-0 justify-end">{action}</div> : null}
        </div>
      )}
      <div className={cn('space-y-4', contentClassName)}>{children}</div>
    </div>
  )
}
