import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        connectSocket(token);
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user: userData, accessToken, refreshToken } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      connectSocket(accessToken);
      return userData;
    } catch (err) {
      // Prototype fallback when standalone frontend is deployed
      const demoAccounts = {
        'admin@ncpor.gov.in': { name: 'Admin User', role: 'expedition_planner' },
        'director@ncpor.gov.in': { name: 'Dr. Rajesh Kumar', role: 'ncpor_director' },
        'priya.sharma@ncpor.gov.in': { name: 'Priya Sharma', role: 'station_manager' },
      };
      if (demoAccounts[email] && password === 'admin123') {
        const userData = {
          id: '44444444-4444-4444-4444-444444444444',
          name: demoAccounts[email].name,
          email,
          role: demoAccounts[email].role,
        };
        const token = 'demo_prototype_token';
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
      throw err;
    }
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    const { user: userData, accessToken, refreshToken } = data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    connectSocket(accessToken);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    disconnectSocket();
    setUser(null);
  }, []);

  const value = { user, loading, login, register, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
