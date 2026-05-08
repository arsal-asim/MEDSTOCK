import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/RouteGuards';

import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard     from './pages/pharmacy/Dashboard';
import NewRequest    from './pages/pharmacy/NewRequest';
import RequestHistory from './pages/pharmacy/RequestHistory';
import Repayments    from './pages/pharmacy/Repayments';
import Profile       from './pages/pharmacy/Profile';

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
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<GuestRoute />}>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/requests"   element={<RequestHistory />} />
            <Route path="/new-request" element={<NewRequest />} />
            <Route path="/repayments" element={<Repayments />} />
            <Route path="/profile"    element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin"              element={<AdminDashboard />} />
            <Route path="/admin/requests"     element={<AdminRequests />} />
            <Route path="/admin/repayments"   element={<AdminRepayments />} />
            <Route path="/admin/pharmacies"   element={<AdminPharmacies />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
