'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { getSupabaseBrowserClient } from './client'
import { isSupabaseConfigured } from './config'

const defaultValue = {
  enabled: false,
  error: null,
  isAuthenticated: false,
  isLoading: false,
  isReady: true,
  session: null,
  supabase: null,
  user: null,
}

const SupabaseContext = createContext(defaultValue)

export function SupabaseProvider({ children }) {
  const enabled = isSupabaseConfigured()
  const [state, setState] = useState(() =>
    enabled
      ? {
          ...defaultValue,
          enabled: true,
          isLoading: true,
          isReady: false,
          supabase: getSupabaseBrowserClient(),
        }
      : defaultValue
  )

  useEffect(() => {
    if (!enabled) {
      setState(defaultValue)
      return undefined
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setState(defaultValue)
      return undefined
    }

    let active = true

    const applySession = (session, error = null) => {
      if (!active) return

      setState({
        enabled: true,
        error,
        isAuthenticated: Boolean(session?.user),
        isLoading: false,
        isReady: true,
        session,
        supabase,
        user: session?.user ?? null,
      })
    }

    const bootstrap = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        applySession(null, error)
        return
      }

      let session = data.session

      if (!session) {
        const anonymousAuth = await supabase.auth.signInAnonymously()

        if (anonymousAuth.error) {
          applySession(null, anonymousAuth.error)
          return
        }

        session = anonymousAuth.data.session ?? null
      }

      applySession(session)
    }

    bootstrap()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return

      setState((current) => ({
        ...current,
        enabled: true,
        error: null,
        isAuthenticated: Boolean(session?.user),
        isLoading: false,
        isReady: true,
        session,
        supabase,
        user: session?.user ?? null,
      }))
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [enabled])

  const value = useMemo(() => state, [state])

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  return useContext(SupabaseContext)
}
