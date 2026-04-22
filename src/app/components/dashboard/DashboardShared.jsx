'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const PRIORITY_META = {
  urgente: {
    label: 'Urgente',
    icon: '●',
    badge: 'border-rouge-200 bg-rouge-50 text-rouge-500 dark:border-rouge-500/18 dark:bg-[#341a23] dark:text-[#f0c3ca]',
  },
  alta: {
    label: 'Alta',
    icon: '●',
    badge: 'border-[#f0d0d0] bg-[#fff3f3] text-[#b96a6a] dark:border-[#6c4a3f]/45 dark:bg-[#322117] dark:text-[#f2c8b2]',
  },
  media: {
    label: 'Média',
    icon: '●',
    badge: 'border-sand-200 bg-sand-50 text-[#a67a2d] dark:border-[#65522d]/45 dark:bg-[#2e2412] dark:text-[#ecd6a0]',
  },
  baixa: {
    label: 'Baixa',
    icon: '●',
    badge: 'border-moss-200 bg-moss-50 text-moss-600 dark:border-moss-500/18 dark:bg-[#182a24] dark:text-[#c4ddd2]',
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
    accent: 'border-iris-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.62)_50%,hsl(var(--surface)/0.94)_100%)] dark:border-[#37415f]/35',
    danger: 'border-rouge-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--destructive)/0.1)_50%,hsl(var(--surface)/0.94)_100%)] dark:border-rouge-500/16',
    studio: 'border-blush-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.48)_50%,hsl(var(--surface)/0.94)_100%)] dark:border-[#3d4668]/35',
  }

  const iconStyles = {
    default: 'bg-[hsl(var(--surface-elevated)/0.96)] text-iris-600 dark:bg-[hsl(var(--surface-soft)/0.92)] dark:text-[#d7ddfb]',
    accent: 'bg-iris-100 text-iris-600 dark:bg-[#212944] dark:text-[#d7ddfb]',
    danger: 'bg-rouge-100 text-rouge-500 dark:bg-[#311921] dark:text-[#f0c3ca]',
    studio: 'bg-gradient-to-br from-blush-100 to-iris-100 text-iris-700 dark:from-[#2a3150] dark:to-[#1e2540] dark:text-[#dfe3ff]',
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
    accent: 'border-iris-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.56)_100%)] text-iris-700 dark:border-[#37415f]/35 dark:text-[#d7ddfb]',
    blush: 'border-blush-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent)/0.24)_100%)] text-blush-600 dark:border-[#48426d]/35 dark:text-[#ead4f7]',
    success: 'border-moss-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--success-soft)/0.4)_100%)] text-moss-600 dark:border-[#355143]/35 dark:text-[#c4ddd2]',
    danger: 'border-rouge-200/70 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--destructive)/0.1)_100%)] text-rouge-500 dark:border-[#6a3e46]/35 dark:text-[#f0c3ca]',
  }

  return (
    <div className={cn('flex items-center gap-3 rounded-[22px] border px-4 py-3 shadow-soft', toneStyles[tone])}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsl(var(--surface-elevated)/0.96)] shadow-soft dark:bg-[hsl(var(--surface-elevated)/0.96)]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</p>
        <p className="mt-1 text-sm font-semibold tracking-[-0.01em]">{value}</p>
      </div>
    </div>
  )
}
