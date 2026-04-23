'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useSupabase } from '@/lib/supabase/SupabaseProvider'

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

function normalizeProfile(profile) {
  return {
    ...defaultProfile,
    ...profile,
    nome: profile?.nome?.trim() || '',
    partner_name: profile?.partner_name?.trim() || '',
    partner_email: profile?.partner_email?.trim() || '',
    plano: profile?.plano === 'casal' ? 'casal' : 'individual',
    onboarding_done: Boolean(profile?.onboarding_done),
  }
}

const PlanContext = createContext(null)

export function PlanProvider({ children }) {
  const { enabled, isLoading: isSupabaseLoading, supabase, user } = useSupabase()
  const [profile, setProfile] = useState(() => loadStored())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const local = loadStored()
    setProfile(local)

    if (!enabled) {
      setIsLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (isSupabaseLoading) {
      setIsLoading(true)
      return
    }

    if (!enabled || !supabase || !user) {
      setIsLoading(false)
      return
    }

    let active = true

    const syncProfile = async () => {
      setIsLoading(true)

      const localProfile = loadStored()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (!active) return

      if (error) {
        console.error('Erro ao carregar profile do Supabase:', error)
        setProfile(localProfile)
        setIsLoading(false)
        return
      }

      if (!data) {
        const shouldSeedRemote =
          localProfile.onboarding_done ||
          localProfile.nome ||
          localProfile.partner_name ||
          localProfile.partner_email

        if (shouldSeedRemote) {
          const seededProfile = normalizeProfile(localProfile)
          const { data: inserted, error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              ...seededProfile,
            })
            .select()
            .single()

          if (!active) return

          if (!upsertError && inserted) {
            const next = normalizeProfile(inserted)
            setProfile(next)
            saveStored(next)
            setIsLoading(false)
            return
          }
        }

        const next = { ...defaultProfile }
        setProfile(next)
        saveStored(next)
        setIsLoading(false)
        return
      }

      const next = normalizeProfile(data)
      setProfile(next)
      saveStored(next)
      setIsLoading(false)
    }

    syncProfile()

    return () => {
      active = false
    }
  }, [enabled, isSupabaseLoading, supabase, user])

  const persistProfile = useCallback(
    async (next) => {
      const normalized = normalizeProfile(next)
      setProfile(normalized)
      saveStored(normalized)

      if (!enabled || !supabase || !user) return

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...normalized,
      })

      if (error) {
        console.error('Erro ao salvar profile no Supabase:', error)
      }
    },
    [enabled, supabase, user]
  )

  const completeOnboarding = useCallback(
    ({ plano, nome, partner_name, partner_email }) => {
      const next = normalizeProfile({
        ...profile,
        plano: plano || 'individual',
        nome,
        partner_name,
        partner_email,
        onboarding_done: true,
      })
      persistProfile(next)
    },
    [persistProfile, profile]
  )

  const updateProfile = useCallback((patch) => {
    const next = normalizeProfile({ ...profile, ...patch })
    persistProfile(next)
  }, [persistProfile, profile])

  const setPlano = useCallback((plano) => {
    if (plano !== 'individual' && plano !== 'casal') return
    const next = normalizeProfile({ ...profile, plano })
    persistProfile(next)
  }, [persistProfile, profile])

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
