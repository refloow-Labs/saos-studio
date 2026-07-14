import { create } from 'zustand'

/**
 * GDPR consent state. Persisted in localStorage. Default state = no decision
 * yet (banner shows). After user action: 'granted' or 'denied' per category.
 *
 * Consent Mode v2 categories:
 *   necessary       — always granted (auth, language, consent itself)
 *   analytics       — Google Analytics
 *   marketing       — ad pixels (not used today, here for forward-compat)
 */

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'
export type ConsentValue = 'granted' | 'denied'

export interface ConsentState {
  decided: boolean // false = banner visible
  necessary: ConsentValue
  analytics: ConsentValue
  marketing: ConsentValue
  decidedAt?: string
}

const STORAGE_KEY = 'saos_consent_v1'

const defaultState: ConsentState = {
  decided: false,
  necessary: 'granted',
  analytics: 'denied',
  marketing: 'denied',
}

function load(): ConsentState {
  if (typeof window === 'undefined') return defaultState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as Partial<ConsentState>
    return { ...defaultState, ...parsed, necessary: 'granted' }
  } catch {
    return defaultState
  }
}

function save(state: ConsentState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore (private browsing / quota)
  }
}

interface ConsentStore extends ConsentState {
  acceptAll: () => void
  rejectAll: () => void
  setCategory: (cat: ConsentCategory, value: ConsentValue) => void
  saveAndClose: () => void
  reopen: () => void
}

export const useConsentStore = create<ConsentStore>((set, get) => ({
  ...load(),

  acceptAll: () => {
    const next: ConsentState = {
      decided: true,
      necessary: 'granted',
      analytics: 'granted',
      marketing: 'granted',
      decidedAt: new Date().toISOString(),
    }
    save(next)
    set(next)
  },

  rejectAll: () => {
    const next: ConsentState = {
      decided: true,
      necessary: 'granted',
      analytics: 'denied',
      marketing: 'denied',
      decidedAt: new Date().toISOString(),
    }
    save(next)
    set(next)
  },

  setCategory: (cat, value) => {
    if (cat === 'necessary') return // always granted
    set((s) => ({ ...s, [cat]: value }))
  },

  saveAndClose: () => {
    const s = get()
    const next: ConsentState = {
      decided: true,
      necessary: 'granted',
      analytics: s.analytics,
      marketing: s.marketing,
      decidedAt: new Date().toISOString(),
    }
    save(next)
    set(next)
  },

  reopen: () => {
    const next = { ...get(), decided: false }
    save(next)
    set({ decided: false })
  },
}))
