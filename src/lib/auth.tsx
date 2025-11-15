import React from 'react'

type User = {
  id: string
  email: string
  role: string
  userType?: string
  staffId?: string
}

type Session = {
  user: User | null
  accessExpires?: string | null
}

type AuthContextValue = Session & {
  setSession: (data: Session) => void
  clearSession: () => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'auth:session'

function readStorage(): Session {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, accessExpires: null }
    return JSON.parse(raw)
  } catch {
    return { user: null, accessExpires: null }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<Session>(() => readStorage())

  const setSession = React.useCallback((data: Session) => {
    setState(data)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {}
  }, [])

  const clearSession = React.useCallback(() => {
    setState({ user: null, accessExpires: null })
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({ ...state, setSession, clearSession }),
    [state, setSession, clearSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
