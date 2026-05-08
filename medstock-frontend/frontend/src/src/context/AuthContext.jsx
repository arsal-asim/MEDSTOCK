import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, verify stored token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    authService.getMe()
      .then(res => setUser(res.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    localStorage.setItem('token', res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('token', res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (data) => setUser(prev => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
