import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', pharmacyName: '', location: '' });
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.pharmacyName) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard');
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
        <h1>Register Pharmacy</h1>
        <p className="auth-subtitle">Create your pharmacy account</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Your Name *</label>
            <input className="form-control" name="name" placeholder="John Doe"
              value={form.name} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input className="form-control" type="email" name="email" placeholder="you@pharmacy.com"
              value={form.email} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input className="form-control" type="password" name="password" placeholder="Min 6 characters"
              value={form.password} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Pharmacy Name *</label>
            <input className="form-control" name="pharmacyName" placeholder="City Pharmacy"
              value={form.pharmacyName} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input className="form-control" name="location" placeholder="Islamabad, Pakistan"
              value={form.location} onChange={onChange} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-muted text-small mt-2" style={{ textAlign: 'center' }}>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
