import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6b7280' }}>Loading...</p>
    </div>
  );
}

// Any logged-in user
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user)   return <Navigate to="/login" replace />;
  return (
    <div className="layout">
      <Sidebar />
      <main className="main"><Outlet /></main>
    </div>
  );
}

// Admin only
export function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user)              return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return (
    <div className="layout">
      <Sidebar />
      <main className="main"><Outlet /></main>
    </div>
  );
}

// Redirect logged-in users away from login/register (but not from homepage)
export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return <Outlet />;
}
