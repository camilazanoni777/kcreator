'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'kcreator-entities-v1'
const LEGACY_STORAGE_KEY = 'duetto-entities-v1'

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
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY)
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
    localStorage.removeItem(LEGACY_STORAGE_KEY)
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

const EntitiesContext = createContext(null)

export function EntitiesProvider({ children }) {
  const [store, setStore] = useState(emptyStore)

  useEffect(() => {
    setStore(loadStore())
  }, [])

  const setSlice = useCallback((type, updater) => {
    setStore((prev) => {
      const list = prev[type] || []
      const nextList = typeof updater === 'function' ? updater(list) : updater
      const next = { ...prev, [type]: nextList }
      saveStore(next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ store, setSlice }), [store, setSlice])

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
  if (!ctx) throw new Error('useEntityMutations requires EntitiesProvider')
  const { setSlice } = ctx

  return useMemo(
    () => ({
      create: {
        mutate: (payload) => {
          const row = {
            ...payload,
            id: newId(),
            created_at: new Date().toISOString(),
          }
          setSlice(type, (list) => [...list, row])
        },
      },
      update: {
        mutate: ({ id, data }) => {
          setSlice(type, (list) =>
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
        mutate: (id) => {
          setSlice(type, (list) => list.filter((row) => row.id !== id))
        },
      },
    }),
    [type, setSlice]
  )
}
