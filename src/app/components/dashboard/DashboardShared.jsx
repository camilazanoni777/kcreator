'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const PRIORITY_META = {
  urgente: {
    label: 'Urgente',
    icon: '●',
    badge: 'border-rouge-200 bg-rouge-50 text-rouge-500',
  },
  alta: {
    label: 'Alta',
    icon: '●',
    badge: 'border-[#f0d0d0] bg-[#fff3f3] text-[#b96a6a]',
  },
  media: {
    label: 'Média',
    icon: '●',
    badge: 'border-sand-200 bg-sand-50 text-[#a67a2d]',
  },
  baixa: {
    label: 'Baixa',
    icon: '●',
    badge: 'border-moss-200 bg-moss-50 text-moss-600',
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
}) {
  const toneStyles = {
    default: 'border-border/70 bg-secondary/45',
    accent: 'border-iris-200/70 bg-gradient-to-br from-white via-iris-50/80 to-blush-50/60',
    danger: 'border-rouge-200/70 bg-gradient-to-br from-white via-rouge-50 to-[#fff9f9]',
    studio: 'border-blush-200/70 bg-gradient-to-br from-white via-blush-50/70 to-iris-50/50',
  }

  const iconStyles = {
    default: 'bg-white text-iris-600',
    accent: 'bg-iris-100 text-iris-600',
    danger: 'bg-rouge-100 text-rouge-500',
    studio: 'bg-gradient-to-br from-blush-100 to-iris-100 text-iris-700',
  }

  return (
    <div className={cn('rounded-[24px] border p-5', toneStyles[tone])}>
      <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm', iconStyles[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      {ctaHref && ctaLabel ? (
        <Button asChild variant="outline" size="sm" className="mt-4">
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
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-border/60 bg-white/70 px-4 py-3">
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
    default: 'border-border/70 bg-white/80 text-foreground',
    accent: 'border-iris-200/70 bg-iris-50 text-iris-700',
    blush: 'border-blush-200/70 bg-blush-50 text-blush-600',
    success: 'border-moss-200/70 bg-moss-50 text-moss-600',
    danger: 'border-rouge-200/70 bg-rouge-50 text-rouge-500',
  }

  return (
    <div className={cn('flex items-center gap-3 rounded-[22px] border px-4 py-3', toneStyles[tone])}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</p>
        <p className="mt-1 text-sm font-semibold tracking-[-0.01em]">{value}</p>
      </div>
    </div>
  )
}
