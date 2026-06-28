import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { User } from '../types';
import { apiService } from '../services/api';

// ── Check if JWT is expired ──────────────────────────────────
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && typeof payload.exp === 'number') {
      return payload.exp * 1000 < Date.now();
    }
    return false;
  } catch {
    return true;
  }
}

// ── Shape of auth context value ───────────────────────────────
interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Call after a successful login/register API response */
  login: (token: string, user: User) => void;
  /** Clears state + localStorage, redirects to /login */
  logout: () => void;
  /** Optimistically update user fields without a full re-login */
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  // Initialise from localStorage with validity checking
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('campusflow_token');
    if (isTokenExpired(savedToken)) {
      localStorage.removeItem('campusflow_token');
      localStorage.removeItem('campusflow_user');
      return null;
    }
    return savedToken;
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedToken = localStorage.getItem('campusflow_token');
      if (isTokenExpired(savedToken)) {
        return null;
      }
      const raw = localStorage.getItem('campusflow_user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  // Sync user profile on mount / token change
  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      apiService.getProfile()
        .then((freshUser) => {
          localStorage.setItem('campusflow_user', JSON.stringify(freshUser));
          setUser(freshUser);
        })
        .catch((err) => {
          console.error('Failed to sync profile on load:', err);
        });
    }
  }, [token]);

  // ── login ─────────────────────────────────────────────────
  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('campusflow_token', newToken);
    localStorage.setItem('campusflow_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  // ── logout ────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('campusflow_token');
    localStorage.removeItem('campusflow_user');
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  // ── updateUser ────────────────────────────────────────────
  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem('campusflow_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ── Listen for 401 events dispatched by the axios interceptor ──
  useEffect(() => {
    const handle = () => {
      toast.error('Session expired. Please log in again.');
      logout();
    };
    window.addEventListener('auth:unauthorized', handle);
    return () => window.removeEventListener('auth:unauthorized', handle);
  }, [logout]);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── useAuth hook ──────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
