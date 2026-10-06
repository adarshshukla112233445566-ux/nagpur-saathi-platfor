import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { DemoUser } from './types';

interface AuthState {
  user: DemoUser | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, mobile: string, password: string) => { ok: boolean; error?: string };
  loginAsAdmin: () => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const USERS_KEY = 'nagpur_saathi_users_v1';
const SESSION_KEY = 'nagpur_saathi_session_v1';

interface StoredUser extends DemoUser {
  password: string;
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as StoredUser[];
  } catch {}
  return [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as DemoUser);
    } catch {}
  }, []);

  const persist = (u: DemoUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  };

  const login: AuthState['login'] = (email, password) => {
    const users = loadUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password. Try again or create an account.' };
    const { password: _pw, ...safe } = found;
    persist(safe);
    return { ok: true };
  };

  const signup: AuthState['signup'] = (name, email, mobile, password) => {
    const users = loadUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser: StoredUser = { name, email, mobile, role: 'citizen', password };
    users.push(newUser);
    saveUsers(users);
    const { password: _pw, ...safe } = newUser;
    persist(safe);
    return { ok: true };
  };

  const loginAsAdmin = () => {
    persist({ name: 'City Administrator', email: 'admin@nagpursaathi.in', mobile: '+91 90000 00000', role: 'admin' });
  };

  const loginAsGuest = () => {
    persist({ name: 'Guest Citizen', email: 'guest@nagpursaathi.local', mobile: '', role: 'citizen' });
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, loginAsAdmin, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
