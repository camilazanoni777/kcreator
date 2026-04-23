'use client'

import { PlanProvider, usePlan } from '@/lib/PlanContext'
import { EntitiesProvider } from '@/lib/hooks/useEntities'
import { SupabaseProvider, useSupabase } from '@/lib/supabase/SupabaseProvider'
import Onboarding from '@/pages/Onboarding'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import QuickCreateMenu from '@/components/layout/QuickCreateMenu'
import { ThemeToggle } from '@/components/theme-toggle'

function SaaSChrome({ children }) {
  const { enabled, isLoading: isSupabaseLoading } = useSupabase()
  const { onboardingDone, isLoading } = usePlan()

  if ((enabled && isSupabaseLoading) || isLoading) {
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
        {children}
      </main>
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] left-4 z-50 lg:hidden">
        <ThemeToggle compact />
      </div>
      <QuickCreateMenu />
      <MobileNav />
    </div>
  )
}

export function SaaSProviders({ children }) {
  return (
    <SupabaseProvider>
      <PlanProvider>
        <EntitiesProvider>
          <SaaSChrome>{children}</SaaSChrome>
        </EntitiesProvider>
      </PlanProvider>
    </SupabaseProvider>
  )
}
