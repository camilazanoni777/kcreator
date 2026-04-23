'use client'

import { createClient } from '@supabase/supabase-js'

import { getSupabaseEnv, isSupabaseConfigured } from './config'

let browserClient = null

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null

  if (!browserClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()

    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
      },
    })
  }

  return browserClient
}
