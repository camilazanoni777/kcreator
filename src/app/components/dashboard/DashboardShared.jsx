'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const PRIORITY_META = {
  urgente: {
    label: 'Urgente',
    icon: '●',
    badge: 'border-rouge-200 bg-rouge-50 text-rouge-500 dark:border-rouge-500/20 dark:bg-rouge-500/12 dark:text-rouge-200',
  },
  alta: {
    label: 'Alta',
    icon: '●',
    badge: 'border-[#f0d0d0] bg-[#fff3f3] text-[#b96a6a] dark:border-[#7a4a4a]/50 dark:bg-[#3a2222] dark:text-[#f4c7c7]',
  },
  media: {
    label: 'Média',
    icon: '●',
    badge: 'border-sand-200 bg-sand-50 text-[#a67a2d] dark:border-[#6d5630]/50 dark:bg-[#35291a] dark:text-[#f4ddb0]',
  },
  baixa: {
    label: 'Baixa',
    icon: '●',
    badge: 'border-moss-200 bg-moss-50 text-moss-600 dark:border-moss-500/20 dark:bg-moss-500/12 dark:text-moss-200',
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
      {action ? <div className="header-actions shrink-0 justify-end">{action}</div> : null}
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
    default: 'border-border/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.96),hsl(var(--surface-soft)/0.88))]',
    accent: 'border-iris-200/70 bg-gradient-to-br from-white via-iris-50/80 to-blush-50/60 dark:from-[#271f25] dark:via-[#1f151d] dark:to-[#1a1018]',
    danger: 'border-rouge-200/70 bg-gradient-to-br from-white via-rouge-50 to-[#fff9f9] dark:border-rouge-500/15 dark:from-[#261619] dark:via-[#1d1113] dark:to-[#180d10]',
    studio: 'border-blush-200/70 bg-gradient-to-br from-white via-blush-50/70 to-iris-50/50 dark:from-[#251b22] dark:via-[#1c141b] dark:to-[#171019]',
  }

  const iconStyles = {
    default: 'bg-[hsl(var(--surface-elevated)/0.96)] text-iris-600',
    accent: 'bg-iris-100 text-iris-600',
    danger: 'bg-rouge-100 text-rouge-500',
    studio: 'bg-gradient-to-br from-blush-100 to-iris-100 text-iris-700 dark:from-[#3e2631] dark:to-[#2a1a23] dark:text-rose-100',
  }

  return (
    <div className={cn('rounded-[24px] border p-5 shadow-soft', toneStyles[tone])}>
      <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-soft', iconStyles[tone])}>
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
    <div className="surface-tile rounded-[20px] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
        </div>
        <p className={cn('stat-number text-lg', valueClassName)}>{value}</p>
      </div>
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
    default: 'border-border/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.94),hsl(var(--surface-soft)/0.9))] text-foreground',
    accent: 'border-iris-200/70 bg-iris-50 text-iris-700 dark:border-iris-500/20 dark:bg-iris-500/12 dark:text-iris-200',
    blush: 'border-blush-200/70 bg-blush-50 text-blush-600 dark:border-blush-500/20 dark:bg-blush-500/12 dark:text-blush-200',
    success: 'border-moss-200/70 bg-moss-50 text-moss-600 dark:border-moss-500/20 dark:bg-moss-500/12 dark:text-moss-200',
    danger: 'border-rouge-200/70 bg-rouge-50 text-rouge-500 dark:border-rouge-500/20 dark:bg-rouge-500/12 dark:text-rouge-200',
  }

  return (
    <div className={cn('flex items-center gap-3 rounded-[22px] border px-4 py-3 shadow-soft', toneStyles[tone])}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsl(var(--surface-elevated)/0.96)] shadow-soft">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</p>
        <p className="mt-1 text-sm font-semibold tracking-[-0.01em]">{value}</p>
      </div>
    </div>
  )
}
