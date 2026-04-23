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

const STORAGE_KEY = 'duetto-entities-v1'

const ENTITY_TYPES = [
  'Tarefa',
  'Meta',
  'Ideia',
  'Habito',
  'Salario',
  'GastoVariavel',
  'ContaFixa',
  'EntradaExtra',
  'Conteudo',
  'Divida',
  'CheckIn',
  'Publi',
]

function emptyStore() {
  return Object.fromEntries(ENTITY_TYPES.map((k) => [k, []]))
}

function loadStore() {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw)
    const base = emptyStore()
    for (const k of ENTITY_TYPES) {
      if (Array.isArray(parsed[k])) base[k] = parsed[k]
    }
    return base
  } catch {
    return emptyStore()
  }
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    /* ignore */
  }
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

const TABLE_BY_TYPE = {
  Tarefa: 'tarefas',
  Meta: 'metas',
  Ideia: 'ideias',
  Habito: 'habitos',
  Salario: 'salarios',
  GastoVariavel: 'gastos_variaveis',
  ContaFixa: 'contas_fixas',
  EntradaExtra: 'entradas_extras',
  Conteudo: 'conteudos',
  Divida: 'dividas',
  CheckIn: 'checkins',
  Publi: 'publis',
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value || ''
  )
}

function normalizeRemoteRow(type, row) {
  const next = { ...row }

  if (next.updated_at && !next.updated_date) {
    next.updated_date = next.updated_at
  }

  if (type === 'Tarefa' && typeof next.hora === 'string') {
    next.hora = next.hora.slice(0, 5)
  }

  return next
}

function sanitizeForRemote(type, payload, { preserveId = false } = {}) {
  const next = { ...payload }

  if (!preserveId || !isUuid(next.id)) {
    delete next.id
  }

  if (next.updated_date && !next.updated_at) {
    next.updated_at = next.updated_date
  }

  delete next.updated_date
  delete next.user_id

  if (type === 'Tarefa') {
    if (typeof next.hora === 'string') {
      next.hora = next.hora.slice(0, 5)
    }
    if (!next.hora) next.hora = null
    if (!next.prazo) next.prazo = null
  }

  if (type === 'Meta' && !next.prazo) {
    next.prazo = null
  }

  Object.keys(next).forEach((key) => {
    if (next[key] === undefined) {
      delete next[key]
    }
  })

  return next
}

const EntitiesContext = createContext(null)

export function EntitiesProvider({ children }) {
  const { enabled, isLoading: isSupabaseLoading, supabase, user } = useSupabase()
  const [store, setStore] = useState(emptyStore)

  useEffect(() => {
    setStore(loadStore())
  }, [])

  const setSliceLocal = useCallback((type, updater) => {
    setStore((prev) => {
      const list = prev[type] || []
      const nextList = typeof updater === 'function' ? updater(list) : updater
      const next = { ...prev, [type]: nextList }
      saveStore(next)
      return next
    })
  }, [])

  const refreshSliceFromRemote = useCallback(
    async (type) => {
      if (!supabase || !user) return null

      const table = TABLE_BY_TYPE[type]
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error(`Erro ao carregar ${type} do Supabase:`, error)
        return null
      }

      const rows = (data || []).map((row) => normalizeRemoteRow(type, row))

      setStore((prev) => {
        const next = { ...prev, [type]: rows }
        saveStore(next)
        return next
      })

      return rows
    },
    [supabase, user]
  )

  const migrateLocalSliceIfNeeded = useCallback(
    async (type, remoteRows) => {
      if (!supabase || !user || remoteRows.length > 0) return remoteRows

      const localStore = loadStore()
      const localRows = localStore[type] || []
      if (localRows.length === 0) return remoteRows

      const payload = localRows.map((row) =>
        sanitizeForRemote(type, row, {
          preserveId: true,
        })
      )

      const { error } = await supabase.from(TABLE_BY_TYPE[type]).insert(payload)

      if (error) {
        console.error(`Erro ao migrar ${type} local para Supabase:`, error)
        return remoteRows
      }

      return (await refreshSliceFromRemote(type)) || remoteRows
    },
    [refreshSliceFromRemote, supabase, user]
  )

  useEffect(() => {
    if (isSupabaseLoading) return
    if (!enabled || !supabase || !user) return

    let active = true

    const syncRemoteStore = async () => {
      for (const type of ENTITY_TYPES) {
        if (!active) return

        const rows = await refreshSliceFromRemote(type)
        if (!active || rows === null) continue

        await migrateLocalSliceIfNeeded(type, rows)
      }
    }

    syncRemoteStore()

    return () => {
      active = false
    }
  }, [
    enabled,
    isSupabaseLoading,
    migrateLocalSliceIfNeeded,
    refreshSliceFromRemote,
    supabase,
    user,
  ])

  const value = useMemo(
    () => ({ store, setSliceLocal }),
    [store, setSliceLocal]
  )

  return (
    <EntitiesContext.Provider value={value}>{children}</EntitiesContext.Provider>
  )
}

export function useEntityList(type) {
  const ctx = useContext(EntitiesContext)
  if (!ctx) throw new Error('useEntityList requires EntitiesProvider')
  return { data: ctx.store[type] || [] }
}

export function useEntityMutations(type) {
  const ctx = useContext(EntitiesContext)
  const { enabled, supabase, user } = useSupabase()
  if (!ctx) throw new Error('useEntityMutations requires EntitiesProvider')
  const { setSliceLocal } = ctx

  const isRemoteEnabled = Boolean(enabled && supabase && user)

  return useMemo(
    () => ({
      create: {
        mutate: async (payload) => {
          if (isRemoteEnabled) {
            const table = TABLE_BY_TYPE[type]
            const row = sanitizeForRemote(type, {
              ...payload,
              created_at: new Date().toISOString(),
            })

            const { error } = await supabase.from(table).insert(row)

            if (!error) {
              const { data } = await supabase
                .from(table)
                .select('*')
                .order('created_at', { ascending: true })

              if (data) {
                setSliceLocal(type, data.map((item) => normalizeRemoteRow(type, item)))
                return
              }
            } else {
              console.error(`Erro ao criar ${type} no Supabase:`, error)
            }
          }

          const row = {
            ...payload,
            id: newId(),
            created_at: new Date().toISOString(),
          }
          setSliceLocal(type, (list) => [...list, row])
        },
      },
      update: {
        mutate: async ({ id, data }) => {
          if (isRemoteEnabled) {
            const table = TABLE_BY_TYPE[type]
            const row = sanitizeForRemote(type, {
              ...data,
              updated_at: new Date().toISOString(),
            })

            const { error } = await supabase.from(table).update(row).eq('id', id)

            if (!error) {
              const { data: refreshed } = await supabase
                .from(table)
                .select('*')
                .order('created_at', { ascending: true })

              if (refreshed) {
                setSliceLocal(
                  type,
                  refreshed.map((item) => normalizeRemoteRow(type, item))
                )
                return
              }
            } else {
              console.error(`Erro ao atualizar ${type} no Supabase:`, error)
            }
          }

          setSliceLocal(type, (list) =>
            list.map((row) => {
              if (row.id !== id) return row
              return {
                ...row,
                ...data,
                updated_date: new Date().toISOString(),
              }
            })
          )
        },
      },
      remove: {
        mutate: async (id) => {
          if (isRemoteEnabled) {
            const table = TABLE_BY_TYPE[type]
            const { error } = await supabase.from(table).delete().eq('id', id)

            if (!error) {
              const { data } = await supabase
                .from(table)
                .select('*')
                .order('created_at', { ascending: true })

              if (data) {
                setSliceLocal(type, data.map((item) => normalizeRemoteRow(type, item)))
                return
              }
            } else {
              console.error(`Erro ao remover ${type} no Supabase:`, error)
            }
          }

          setSliceLocal(type, (list) => list.filter((row) => row.id !== id))
        },
      },
    }),
    [isRemoteEnabled, setSliceLocal, supabase, type]
  )
}
