import React, { createContext, useContext, useState } from 'react'
import { authenticate, clearCurrentUser, CurrentUser, getCurrentUser, registerUser, setCurrentUser } from '../utils/auth'

type AuthContextValue = {
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  login: (email: string, password: string, remember: boolean, role?: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(getCurrentUser)

  async function login(email: string, password: string, remember: boolean, role?: string) {
    const result = await authenticate(email, password, role)
    setCurrentUser(result, remember)
    setCurrentUserState(result)
  }

  async function register(userData: any) {
    const result = await registerUser(userData)
    // Automatically log in after registration
    setCurrentUser(result, true)
    setCurrentUserState(result)
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
