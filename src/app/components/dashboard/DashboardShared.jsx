'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const PRIORITY_META = {
  urgente: {
    label: 'Urgente',
    icon: '●',
    badge: 'status-danger',
  },
  alta: {
    label: 'Alta',
    icon: '●',
    badge: 'surface-danger border-destructive/20 text-destructive',
  },
  media: {
    label: 'Média',
    icon: '●',
    badge: 'status-warning',
  },
  baixa: {
    label: 'Baixa',
    icon: '●',
    badge: 'status-success',
  },
}

export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="kicker mb-2">{eyebrow}</p> : null}
        <h2 className="font-cormorant text-3xl font-semibold tracking-[-0.03em] text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaHref,
  ctaLabel,
  tone = 'default',
  compact = false,
  className,
}) {
  const toneStyles = {
    default: 'surface-soft',
    accent: 'surface-accent',
    danger: 'surface-danger',
    studio: 'surface-studio',
  }

  const iconStyles = {
    default: 'icon-shell icon-shell-primary',
    accent: 'icon-shell icon-shell-primary',
    danger: 'icon-shell icon-shell-danger',
    studio: 'icon-shell icon-shell-studio',
  }

  return (
    <div
      className={cn(
        'rounded-[24px] border',
        compact ? 'p-4' : 'p-5',
        toneStyles[tone],
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl shadow-sm',
          compact ? 'mb-3 h-10 w-10' : 'mb-4 h-12 w-12',
          iconStyles[tone]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className={cn('text-sm text-muted-foreground', compact ? 'mt-1.5 leading-5' : 'mt-2 leading-6')}>
        {description}
      </p>
      {ctaHref && ctaLabel ? (
        <Button asChild variant="outline" size="sm" className={compact ? 'mt-3' : 'mt-4'}>
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  )
}

export function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.media

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em]', meta.badge)}>
      <span className="text-[10px]">{meta.icon}</span>
      {meta.label}
    </span>
  )
}

export function RowStat({ label, value, helper, valueClassName }) {
  return (
    <div className="surface-glass flex items-center justify-between gap-3 rounded-[20px] px-4 py-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
      </div>
      <p className={cn('stat-number text-lg', valueClassName)}>{value}</p>
    </div>
  )
}

export function SoftAction({ href, children }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href}>
        {children}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  )
}

export function SectionPill({ icon: Icon, label, value, tone = 'default' }) {
  const toneStyles = {
    default: 'surface-glass text-foreground',
    accent: 'surface-accent text-primary',
    blush: 'surface-studio text-accent-foreground',
    success: 'surface-success text-success',
    danger: 'surface-danger text-destructive',
  }

  return (
    <div className={cn('flex items-center gap-3 rounded-[22px] border px-4 py-3', toneStyles[tone])}>
      <div className="icon-shell h-10 w-10">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</p>
        <p className="mt-1 text-sm font-semibold tracking-[-0.01em]">{value}</p>
      </div>
    </div>
  )
}
