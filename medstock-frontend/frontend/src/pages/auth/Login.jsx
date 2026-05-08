import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back">← Back to Home</Link>
        <span className="auth-logo">💊 MedStock</span>
        <h1>Sign in</h1>
        <p className="auth-subtitle">Pharmacy Inventory Finance System</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" name="email"
              placeholder="you@pharmacy.com" value={form.email} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password"
              placeholder="••••••••" value={form.password} onChange={onChange} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-muted text-small mt-2" style={{ textAlign: 'center' }}>
          New pharmacy? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
