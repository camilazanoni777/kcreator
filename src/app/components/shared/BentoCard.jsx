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
    default: 'surface-base',
    accent: 'surface-accent',
    danger: 'surface-danger',
    studio: 'surface-studio',
    success: 'surface-success',
  }

  const iconStyles = {
    default: 'icon-shell icon-shell-primary',
    accent: 'icon-shell icon-shell-accent',
    danger: 'icon-shell icon-shell-danger',
    studio: 'icon-shell icon-shell-studio',
    success: 'icon-shell icon-shell-success',
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
