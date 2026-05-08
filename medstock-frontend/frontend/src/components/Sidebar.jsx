import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pharmacyLinks = [
  { to: '/dashboard',  label: '📊 Dashboard' },
  { to: '/requests',   label: '📋 Requests' },
  { to: '/repayments', label: '💳 Repayments' },
  { to: '/profile',    label: '👤 Profile' },
];

const adminLinks = [
  { to: '/admin',            label: '📊 Dashboard' },
  { to: '/admin/requests',   label: '📋 All Requests' },
  { to: '/admin/repayments', label: '💳 Repayments' },
  { to: '/admin/pharmacies', label: '🏪 Pharmacies' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks : pharmacyLinks;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>MedStock</h2>
        <p>{user?.role === 'admin' ? 'Admin Panel' : user?.pharmacyName || 'Pharmacy'}</p>
      </div>

      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/admin'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ padding: '4px 12px 8px', fontSize: 12, color: '#9ca3af' }}>
          {user?.name}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
