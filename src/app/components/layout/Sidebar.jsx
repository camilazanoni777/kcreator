'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  LayoutDashboard,
  Settings,
  Sparkles,
  Target,
  Video,
  Wallet,
  Waves,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { usePlan } from '@/lib/PlanContext'
import { ThemeToggle } from '@/components/theme-toggle'

function buildSections() {
  return [
    {
      label: 'Principal',
      items: [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/hoje', label: 'Hoje', icon: HeartPulse },
        { path: '/agenda', label: 'Agenda', icon: CalendarDays },
        { path: '/tarefas', label: 'Tarefas', icon: CheckCircle2 },
        { path: '/metas', label: 'Metas', icon: Target },
        { path: '/financeiro', label: 'Financeiro', icon: Wallet },
        { path: '/estudio', label: 'Creator Studio', icon: Video },
      ],
    },
    {
      label: 'Secundário',
      items: [
        { path: '/checkin', label: 'Check-in', icon: Sparkles },
        { path: '/habitos', label: 'Hábitos', icon: Waves },
        { path: '/configuracoes', label: 'Configurações', icon: Settings },
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
          ? 'border-primary/18 bg-card/90 text-foreground shadow-soft'
          : 'border-transparent text-sidebar-foreground/72 hover:border-border/60 hover:bg-card/72 hover:text-foreground'
      )}
    >
      {active ? (
        <span className="absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-iris-500 to-blush-300" />
      ) : null}

      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-200',
          active
            ? 'icon-shell icon-shell-primary'
            : 'icon-shell bg-secondary/70 text-muted-foreground group-hover:bg-card'
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>

      {!collapsed ? (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-[-0.01em]">{item.label}</p>
        </div>
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
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
          {label}
        </p>
      )}

      <div className="space-y-1">
        {items.map((item) => {
          const active = item.path === '/'
            ? pathname === '/'
            : pathname.startsWith(item.path)

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
        collapsed ? 'w-[92px]' : 'w-[292px]'
      )}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col border-r border-sidebar-border/90 bg-sidebar/92 px-4 py-5 backdrop-blur-xl">
        <div
          className={cn(
            'surface-glass flex items-start gap-3 rounded-[28px] p-4',
            collapsed && 'justify-center'
          )}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-iris-500 to-blush-300 text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>

          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="kicker mb-1">Lumina OS</p>
              <p className="truncate font-cormorant text-2xl font-semibold leading-none tracking-[-0.03em] text-foreground">
                {profileName}
              </p>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                Navegação principal do seu sistema.
              </p>
            </div>
          ) : null}
        </div>

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

        <div className={cn('mb-4', collapsed ? 'flex justify-center' : '')}>
          <ThemeToggle compact={collapsed} />
        </div>

        {!collapsed ? (
          <div className="surface-glass rounded-[24px] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Contexto
            </p>
            <p className="mt-2 text-sm text-foreground/78">
              Use a home para decidir o agora. Use o menu para executar.
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-3 top-8 hidden h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-card text-muted-foreground shadow-soft transition-colors hover:text-foreground lg:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
