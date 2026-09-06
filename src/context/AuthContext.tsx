import React, { createContext, useContext, useState } from 'react'
import { authenticate, clearCurrentUser, CurrentUser, getCurrentUser, RegisteredUser, saveUser, setCurrentUser } from '../utils/auth'

type AuthContextValue = {
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  login: (email: string, password: string, remember: boolean) => CurrentUser | 'not-found' | 'invalid'
  register: (user: RegisteredUser) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(getCurrentUser)

  function login(email: string, password: string, remember: boolean) {
    const result = authenticate(email, password)
    if (typeof result === 'string') return result
    setCurrentUser(result, remember)
    setCurrentUserState(result)
    return result
  }

  function register(user: RegisteredUser) {
    return saveUser(user)
  }

  function logout() {
    clearCurrentUser()
    setCurrentUserState(null)
  }

  return <AuthContext.Provider value={{ currentUser, isAuthenticated: Boolean(currentUser), login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
