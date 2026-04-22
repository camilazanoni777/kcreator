'use client'

import { PlanProvider, usePlan } from '@/lib/PlanContext'
import { EntitiesProvider } from '@/lib/hooks/useEntities'
import Onboarding from '@/pages/Onboarding'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import ThemeToggle from '@/components/theme-toggle'

function SaaSChrome({ children }) {
  const { onboardingDone, isLoading } = usePlan()

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-7 h-7 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!onboardingDone) {
    return <Onboarding />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="relative flex-1 min-h-screen overflow-x-hidden pb-24 lg:pb-0">
        <div className="sticky top-0 z-40 px-4 pt-4 sm:px-8">
          <div className="surface-toolbar flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="kicker mb-1">Workspace Controls</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Aparência refinada, contraste melhor e navegação mais clara em qualquer largura.
              </p>
            </div>
            <div className="header-actions justify-start sm:justify-end">
              <ThemeToggle />
            </div>
          </div>
        </div>
        <div className="relative z-10">{children}</div>
      </main>
      <MobileNav />
    </div>
  )
}

export function SaaSProviders({ children }) {
  return (
    <PlanProvider>
      <EntitiesProvider>
        <SaaSChrome>{children}</SaaSChrome>
      </EntitiesProvider>
    </PlanProvider>
  )
}
