'use client'

import { MoonStar, SunMedium } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

export function ThemeToggle({
  compact = false,
  className,
  label = true,
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? resolvedTheme === 'dark' : false

  const copy = useMemo(
    () => ({
      title: isDark ? 'Modo escuro' : 'Modo claro',
      action: isDark ? 'Ativar modo claro' : 'Ativar modo escuro',
    }),
    [isDark]
  )

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={copy.action}
      title={copy.action}
      className={cn(
        'group inline-flex items-center gap-3 rounded-full surface-floating text-left text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-panel-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20',
        compact ? 'h-11 w-11 justify-center rounded-2xl p-0' : 'px-3 py-2.5',
        className
      )}
    >
      <span
        className={cn(
          'relative flex shrink-0 items-center rounded-full bg-secondary/80 ring-1 ring-border/60',
          compact ? 'h-8 w-8 justify-center' : 'h-9 w-[4.35rem] px-1'
        )}
      >
        {compact ? (
          isDark ? (
            <MoonStar className="h-4 w-4 text-primary" />
          ) : (
            <SunMedium className="h-4 w-4 text-primary" />
          )
        ) : (
          <>
            <span
              className={cn(
                'absolute top-1 h-7 w-7 rounded-full bg-card shadow-soft transition-transform duration-300',
                isDark ? 'translate-x-[2.15rem]' : 'translate-x-0'
              )}
            />
            <SunMedium
              className={cn(
                'relative z-10 h-4 w-4 transition-colors duration-300',
                isDark ? 'text-muted-foreground/65' : 'text-primary'
              )}
            />
            <MoonStar
              className={cn(
                'relative z-10 ml-auto h-4 w-4 transition-colors duration-300',
                isDark ? 'text-primary' : 'text-muted-foreground/65'
              )}
            />
          </>
        )}
      </span>

      {!compact && label ? (
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Aparencia
          </span>
          <span className="block text-sm font-semibold tracking-[-0.01em] text-foreground">
            {copy.title}
          </span>
        </span>
      ) : null}
    </button>
  )
}
