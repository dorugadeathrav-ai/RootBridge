export type UserRole = 'buyer' | 'seller'

export interface RegisteredUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  profile?: Record<string, unknown>
  createdAt?: string
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  role: UserRole
}

const USERS_KEY = 'rootbridge_users'
const LOCAL_SESSION_KEY = 'rootbridge_current_user'
const SESSION_KEY = 'rootbridge_session_user'

const demoUsers: RegisteredUser[] = [
  { id: 'demo-buyer', name: 'Demo Buyer', email: 'buyer@rootbridge.demo', password: 'Buyer@123', role: 'buyer' },
  { id: 'demo-seller', name: 'Demo Seller', email: 'seller@rootbridge.demo', password: 'Seller@123', role: 'seller' }
]

function read<T>(storage: Storage, key: string): T | null {
  const raw = storage.getItem(key)
  return raw ? JSON.parse(raw) as T : null
}

export function getUsers(): RegisteredUser[] {
  const users = read<RegisteredUser[]>(localStorage, USERS_KEY)
  if (users) return users
  if (import.meta.env.DEV) {
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers))
    return demoUsers
  }
  return []
}

export function saveUser(user: RegisteredUser): boolean {
  const users = getUsers()
  if (users.some(existing => existing.email.toLowerCase() === user.email.trim().toLowerCase())) return false
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  return true
}

export function getCurrentUser(): CurrentUser | null {
  return read<CurrentUser>(localStorage, LOCAL_SESSION_KEY) ?? read<CurrentUser>(sessionStorage, SESSION_KEY)
}

export function setCurrentUser(user: CurrentUser, remember: boolean) {
  const target = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage
  other.removeItem(remember ? SESSION_KEY : LOCAL_SESSION_KEY)
  target.setItem(remember ? LOCAL_SESSION_KEY : SESSION_KEY, JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem(LOCAL_SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

export function authenticate(email: string, password: string): CurrentUser | 'not-found' | 'invalid' {
  const user = getUsers().find(candidate => candidate.email.toLowerCase() === email.trim().toLowerCase())
  if (!user) return 'not-found'
  if (user.password !== password) return 'invalid'
  const { password: _password, ...currentUser } = user
  return currentUser
}

export function updatePassword(email: string, newPassword: string): boolean {
  const users = getUsers()
  const index = users.findIndex(user => user.email.toLowerCase() === email.trim().toLowerCase())
  if (index < 0) return false
  users[index] = { ...users[index], password: newPassword }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return true
}

export function getRegisteredUser(id: string): RegisteredUser | null {
  return getUsers().find(user => user.id === id) ?? null
}

export function updateRegisteredUser(user: RegisteredUser): boolean {
  const users = getUsers()
  const index = users.findIndex(item => item.id === user.id)
  if (index < 0) return false

  users[index] = user
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  const nextCurrentUser: CurrentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }

  if (localStorage.getItem(LOCAL_SESSION_KEY)) {
    setCurrentUser(nextCurrentUser, true)
  } else if (sessionStorage.getItem(SESSION_KEY)) {
    setCurrentUser(nextCurrentUser, false)
  }

  return true
}
