'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  HeartHandshake,
  LayoutDashboard,
  Lightbulb,
  Settings,
  SmilePlus,
  Sparkles,
  Target,
  Video,
  Wallet,
  Waves,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlan } from '@/lib/PlanContext'

function buildSections() {
  return [
    {
      label: 'Planner',
      items: [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/agenda', label: 'Agenda', icon: CalendarDays },
        { path: '/tarefas', label: 'Tarefas', icon: CheckCircle2 },
        { path: '/metas', label: 'Metas', icon: Target },
      ],
    },
    {
      label: 'Wellness',
      items: [
        { path: '/habitos', label: 'Hábitos', icon: Waves },
        { path: '/checkin', label: 'Check-in', icon: SmilePlus },
      ],
    },
    {
      label: 'Finance',
      items: [
        { path: '/financeiro', label: 'Financeiro', icon: Wallet },
        { path: '/dividas', label: 'Dívidas', icon: CreditCard },
      ],
    },
    {
      label: 'Creator Studio',
      items: [
        { path: '/estudio', label: 'Studio', icon: Video },
        { path: '/publis', label: 'Publis', icon: HeartHandshake },
        { path: '/marcas', label: 'Marcas', icon: Sparkles },
        { path: '/ideias', label: 'Ideias', icon: Lightbulb },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
      ],
    },
  ]
}

function NavItem({ item, collapsed, active }) {
  const Icon = item.icon

  return (
    <Link
      href={item.path}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group relative flex items-center rounded-2xl border transition-all duration-200',
        collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3',
        active
          ? 'border-primary/25 bg-[linear-gradient(135deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.72))] text-foreground shadow-soft'
          : 'border-transparent text-sidebar-foreground/78 hover:border-border/70 hover:bg-[hsl(var(--surface-soft)/0.74)] hover:text-foreground'
      )}
    >
      {active ? (
        <span className="absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-iris-500 to-blush-300" />
      ) : null}
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-200',
          active
            ? 'bg-gradient-to-br from-iris-100 to-sand-100 text-iris-700 dark:from-[#422733] dark:to-[#2d1a23] dark:text-rose-100'
            : 'bg-[hsl(var(--surface-soft)/0.85)] text-muted-foreground group-hover:bg-[hsl(var(--surface-elevated)/0.92)]'
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>
      {!collapsed ? (
        <>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-[-0.01em]">{item.label}</p>
          </div>
          {active ? <span className="h-2.5 w-2.5 rounded-full bg-iris-400 shadow-[0_0_0_6px_rgba(133,105,120,0.12)]" /> : null}
        </>
      ) : null}
    </Link>
  )
}

function Section({ label, items, pathname, collapsed }) {
  return (
    <div className="space-y-2">
      {collapsed ? (
        <div className="mx-3 h-px bg-sidebar-border" />
      ) : (
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-sidebar-foreground/55">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
          return (
            <NavItem
              key={item.path}
              item={item}
              active={active}
              collapsed={collapsed}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const { isCasal, nome, partnerName } = usePlan()
  const [collapsed, setCollapsed] = useState(false)

  const sections = buildSections()
  const profileName =
    isCasal && nome && partnerName ? `${nome} & ${partnerName}` : nome || 'Seu espaço'

  return (
    <aside
      className={cn(
        'relative hidden lg:flex lg:shrink-0',
        collapsed ? 'w-[92px]' : 'w-[320px]'
      )}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col border-r border-sidebar-border/90 bg-[linear-gradient(180deg,hsl(var(--sidebar)/0.96),hsl(var(--surface))/1)] px-4 py-5 backdrop-blur-xl">
        <div className={cn('surface-toolbar flex items-start gap-3 p-4', collapsed && 'justify-center')}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-iris-500 to-blush-300 text-white shadow-lg shadow-iris-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="kicker mb-1">Lumina OS</p>
              <p className="truncate font-cormorant text-2xl font-semibold leading-none tracking-[-0.03em] text-foreground">
                {profileName}
              </p>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                Organização com intenção, bem-estar e performance em um só painel.
              </p>
            </div>
          ) : null}
        </div>

        {!collapsed ? (
          <div className="mt-4 rounded-[28px] border border-primary/20 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.96),hsl(var(--accent-soft)/0.7))] p-4 shadow-soft">
            <p className="kicker mb-2">Daily Focus</p>
            <p className="text-sm leading-6 text-[hsl(var(--text-secondary))]">
              Priorize o que sustenta sua rotina, protege sua energia e move sua evolução.
            </p>
          </div>
        ) : null}

        <nav className="mt-5 flex-1 space-y-5 overflow-y-auto pr-1">
          {sections.map((section) => (
            <Section
              key={section.label}
              label={section.label}
              items={section.items}
              pathname={pathname}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="space-y-3 pt-4">
          <Link
            href="/configuracoes"
            className={cn(
              'flex items-center rounded-2xl border border-transparent transition-all duration-200',
              collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3',
              pathname.startsWith('/configuracoes')
                ? 'border-primary/20 bg-[hsl(var(--surface-elevated)/0.94)] text-foreground shadow-soft'
                : 'text-sidebar-foreground/78 hover:border-border/70 hover:bg-[hsl(var(--surface-soft)/0.74)] hover:text-foreground'
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--surface-soft)/0.85)] text-muted-foreground">
              <Settings className="h-[18px] w-[18px]" />
            </div>
            {!collapsed ? <span className="text-sm font-semibold">Configurações</span> : null}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-3 top-8 hidden h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-[hsl(var(--surface-elevated)/0.96)] text-muted-foreground shadow-soft transition-colors hover:text-foreground lg:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
