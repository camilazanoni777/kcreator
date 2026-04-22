'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'duetto-plan-v1'

const defaultProfile = {
  nome: '',
  partner_name: '',
  partner_email: '',
  plano: 'individual',
  onboarding_done: false,
}

function loadStored() {
  if (typeof window === 'undefined') return { ...defaultProfile }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultProfile }
    const parsed = JSON.parse(raw)
    return { ...defaultProfile, ...parsed }
  } catch {
    return { ...defaultProfile }
  }
}

function saveStored(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    /* ignore */
  }
}

const PlanContext = createContext(null)

export function PlanProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setProfile(loadStored())
    setIsLoading(false)
  }, [])

  const completeOnboarding = useCallback(
    ({ plano, nome, partner_name, partner_email }) => {
      setProfile((prev) => {
        const next = {
          ...prev,
          plano: plano || 'individual',
          nome: nome?.trim() || '',
          partner_name: partner_name?.trim() || '',
          partner_email: partner_email?.trim() || '',
          onboarding_done: true,
        }
        saveStored(next)
        return next
      })
    },
    []
  )

  const updateProfile = useCallback((patch) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch }
      saveStored(next)
      return next
    })
  }, [])

  const setPlano = useCallback((plano) => {
    if (plano !== 'individual' && plano !== 'casal') return
    setProfile((prev) => {
      const next = { ...prev, plano }
      saveStored(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      profile,
      isLoading,
      onboardingDone: !!profile.onboarding_done,
      plano: profile.plano,
      nome: profile.nome || '',
      partnerName: profile.partner_name || '',
      isIndividual: profile.plano === 'individual',
      isCasal: profile.plano === 'casal',
      completeOnboarding,
      updateProfile,
      setPlano,
    }),
    [profile, isLoading, completeOnboarding, updateProfile, setPlano]
  )

  return (
    <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
  )
}

export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) {
    throw new Error('usePlan must be used within PlanProvider')
  }
  return ctx
}
