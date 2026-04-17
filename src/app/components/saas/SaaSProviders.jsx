'use client'

import React from 'react'
import { PlanProvider, usePlan } from '@/lib/PlanContext'
import { EntitiesProvider } from '@/lib/hooks/useEntities'
import Onboarding from '../../pages/Onboarding'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

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
        {children}
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
