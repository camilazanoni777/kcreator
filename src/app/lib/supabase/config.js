const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ''

export function getSupabaseEnv() {
  return {
    supabaseUrl,
    supabaseAnonKey,
  }
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
