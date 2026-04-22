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

  const shellStyles = {
    default: 'border-border/80 bg-[linear-gradient(155deg,hsl(var(--surface-elevated)/0.98),hsl(var(--surface)/0.94))] shadow-panel',
    accent: 'border-primary/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,239,243,0.94)_40%,rgba(243,227,233,0.92)_100%)] shadow-panel dark:bg-[linear-gradient(145deg,rgba(39,23,31,0.96),rgba(29,18,24,0.98)_48%,rgba(20,12,17,1)_100%)]',
    danger: 'border-rouge-200/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(253,243,242,0.95)_44%,rgba(249,232,229,0.92)_100%)] shadow-panel dark:border-rouge-500/15 dark:bg-[linear-gradient(145deg,rgba(40,20,24,0.96),rgba(30,15,18,0.98)_48%,rgba(19,10,12,1)_100%)]',
    studio: 'border-blush-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,238,242,0.95)_46%,rgba(240,234,242,0.9)_100%)] shadow-panel dark:bg-[linear-gradient(145deg,rgba(37,22,31,0.96),rgba(27,17,24,0.98)_48%,rgba(18,11,17,1)_100%)]',
    success: 'border-moss-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(242,248,244,0.95)_44%,rgba(235,244,239,0.92)_100%)] shadow-panel dark:border-moss-500/15 dark:bg-[linear-gradient(145deg,rgba(24,32,27,0.96),rgba(18,25,20,0.98)_48%,rgba(12,18,14,1)_100%)]',
  }

  const iconStyles = {
    default: 'bg-iris-100 text-iris-600 dark:bg-iris-500/15 dark:text-iris-200',
    accent: 'bg-blush-100 text-blush-600 dark:bg-blush-500/15 dark:text-blush-200',
    danger: 'bg-rouge-100 text-rouge-500 dark:bg-rouge-500/15 dark:text-rouge-200',
    studio: 'bg-gradient-to-br from-blush-100 to-iris-100 text-iris-700 dark:from-[#3e2631] dark:to-[#2a1a23] dark:text-rose-100',
    success: 'bg-moss-100 text-moss-600 dark:bg-moss-500/15 dark:text-moss-200',
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[28px] border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-panel-hover',
        shellStyles[resolvedVariant],
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
