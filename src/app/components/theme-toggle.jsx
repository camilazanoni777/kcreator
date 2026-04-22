'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export default function ThemeToggle({ className }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const label = isDark ? 'Ativar modo claro' : 'Ativar modo escuro'

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'group inline-flex w-full items-center justify-between gap-3 rounded-[24px] border border-border/80 bg-[hsl(var(--surface-elevated)/0.92)] px-3 py-2 text-left text-sm font-semibold text-foreground shadow-panel backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-[hsl(var(--card-hover)/0.94)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 sm:w-auto',
        className
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#f6ddd6] via-[#efced7] to-[#e6c0d1] text-[#8d536f] shadow-soft transition-colors dark:from-[#3c2632] dark:via-[#301f29] dark:to-[#24161f] dark:text-[#f6dbe6]">
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground/90">
          Aparência
        </span>
        <span className="mt-1 block truncate text-sm text-foreground">
          {isDark ? 'Modo claro' : 'Modo night'}
        </span>
      </span>
    </button>
  )
}
