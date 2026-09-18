import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: '44444444-4444-4444-4444-444444444444',
  name: 'Admin User',
  email: 'admin@ncpor.gov.in',
  role: 'expedition_planner',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        // ignore
      }
    }
    return DEFAULT_USER;
  });
  const [loading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || 'demo_prototype_token';
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    connectSocket(token);
  }, [user]);

  const login = useCallback(async () => user, [user]);
  const register = useCallback(async () => user, [user]);

  const logout = useCallback(() => {
    setUser(DEFAULT_USER);
  }, []);

  const value = { user, loading, login, register, logout, isAuthenticated: true };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
