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
    default: 'border-border/80 bg-white/95 shadow-panel',
    accent: 'border-iris-200/80 bg-gradient-to-br from-white via-iris-50/80 to-blush-50/90 shadow-panel',
    danger: 'border-rouge-200/80 bg-gradient-to-br from-white via-rouge-50 to-[#fff8f8] shadow-panel',
    studio: 'border-blush-200/90 bg-gradient-to-br from-white via-blush-50/75 to-iris-50/60 shadow-panel',
    success: 'border-moss-200/80 bg-gradient-to-br from-white via-moss-50/80 to-[#f8fff9] shadow-panel',
  }

  const iconStyles = {
    default: 'bg-iris-100 text-iris-600',
    accent: 'bg-blush-100 text-blush-600',
    danger: 'bg-rouge-100 text-rouge-500',
    studio: 'bg-gradient-to-br from-blush-100 to-iris-100 text-iris-700',
    success: 'bg-moss-100 text-moss-600',
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
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm',
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
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      <div className={cn('space-y-4', contentClassName)}>{children}</div>
    </div>
  )
}
