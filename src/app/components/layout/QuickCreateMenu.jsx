'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  CircleDollarSign,
  HeartPulse,
  Plus,
  Target,
  Video,
  WalletCards,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

const ACTIONS = [
  {
    href: '/tarefas',
    label: 'Nova tarefa',
    description: 'Prioridade, prazo e foco.',
    icon: Plus,
  },
  {
    href: '/financeiro',
    label: 'Nova entrada',
    description: 'Atualize o caixa do mês.',
    icon: WalletCards,
  },
  {
    href: '/financeiro',
    label: 'Nova saída',
    description: 'Registre gasto ou conta.',
    icon: CircleDollarSign,
  },
  {
    href: '/metas',
    label: 'Nova meta',
    description: 'Defina o alvo do ciclo.',
    icon: Target,
  },
  {
    href: '/estudio',
    label: 'Nova publi',
    description: 'Leve creator para a rotina.',
    icon: Video,
  },
  {
    href: '/checkin',
    label: 'Novo check-in',
    description: 'Humor, energia e foco.',
    icon: HeartPulse,
  },
]

export default function QuickCreateMenu() {
  const [open, setOpen] = useState(false)
  const shellRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!shellRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  return (
    <div
      ref={shellRef}
      className="fixed bottom-24 right-4 z-50 lg:bottom-6 lg:right-6"
    >
      {open ? (
        <div className="surface-floating mb-3 w-[18rem] rounded-[28px] p-3">
          <div className="mb-2 px-2 pt-1">
            <p className="kicker mb-1">Ação rápida</p>
            <p className="text-sm font-semibold text-foreground">+ Novo</p>
          </div>

          <div className="space-y-2">
            {ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-[22px] border border-transparent bg-secondary/35 px-3 py-3 transition-all duration-200 hover:border-primary/18 hover:bg-card"
              >
                <div className="icon-shell icon-shell-primary h-10 w-10">
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <Button
        size="lg"
        className="h-14 rounded-full px-5 shadow-panel"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        + Novo
      </Button>
    </div>
  )
}
