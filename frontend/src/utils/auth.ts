import { API_URL } from './api';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

const LOCAL_SESSION_KEY = 'rootbridge_current_user';
const TOKEN_KEY = 'rootbridge_token';

function saveSession(user: CurrentUser, remember: boolean) {
  const storage = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  
  other.removeItem(LOCAL_SESSION_KEY);
  other.removeItem(TOKEN_KEY);
  
  storage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
  storage.setItem(TOKEN_KEY, user.token);
}

export function getCurrentUser(): CurrentUser | null {
  const raw = localStorage.getItem(LOCAL_SESSION_KEY) || sessionStorage.getItem(LOCAL_SESSION_KEY);
  return raw ? JSON.parse(raw) as CurrentUser : null;
}

export function clearCurrentUser() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(LOCAL_SESSION_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function authenticate(email: string, password: string, role?: string): Promise<CurrentUser> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data;
}

export async function registerUser(userData: any): Promise<CurrentUser> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  
  return data;
}


export { saveSession as setCurrentUser };
