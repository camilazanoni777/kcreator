'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, CheckCircle2, LayoutDashboard, SmilePlus, Video, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/tarefas', label: 'Tarefas', icon: CheckCircle2 },
  { path: '/checkin', label: 'Wellness', icon: SmilePlus },
  { path: '/financeiro', label: 'Finance', icon: Wallet },
  { path: '/estudio', label: 'Studio', icon: Video },
  { path: '/analytics', label: 'Data', icon: BarChart3 },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-white/92 px-3 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] pt-2 backdrop-blur-xl">
      <div className="grid grid-cols-6 gap-2">
        {ITEMS.map(({ path, label, icon: Icon }) => {
          const active = path === '/' ? pathname === '/' : pathname.startsWith(path)

          return (
            <Link
              key={path}
              href={path}
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold transition-all duration-200',
                active ? 'bg-gradient-to-b from-iris-50 to-blush-50 text-foreground' : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200',
                  active ? 'bg-gradient-to-br from-iris-100 to-blush-100 text-iris-700 shadow-sm' : 'bg-secondary/60'
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <span className="tracking-[0.02em]">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
