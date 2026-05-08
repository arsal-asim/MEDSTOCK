import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/RouteGuards';

import HomePage from './pages/public/HomePage';

import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard  from './pages/pharmacy/Dashboard';
import Requests   from './pages/pharmacy/Requests';
import Repayments from './pages/pharmacy/Repayments';
import Profile    from './pages/pharmacy/Profile';

import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminRequests   from './pages/admin/AdminRequests';
import AdminRepayments from './pages/admin/AdminRepayments';
import AdminPharmacies from './pages/admin/AdminPharmacies';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public homepage — always accessible */}
          <Route path="/" element={<HomePage />} />

          {/* Auth pages — redirect logged-in users to their dashboard */}
          <Route element={<GuestRoute />}>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Pharmacy user pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/requests"   element={<Requests />} />
            <Route path="/repayments" element={<Repayments />} />
            <Route path="/profile"    element={<Profile />} />
          </Route>

          {/* Admin pages */}
          <Route element={<AdminRoute />}>
            <Route path="/admin"              element={<AdminDashboard />} />
            <Route path="/admin/requests"     element={<AdminRequests />} />
            <Route path="/admin/repayments"   element={<AdminRepayments />} />
            <Route path="/admin/pharmacies"   element={<AdminPharmacies />} />
          </Route>

          {/* Catch-all → homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
