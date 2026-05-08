import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm]     = useState({ name: user?.name || '', pharmacyName: user?.pharmacyName || '', location: '' });
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(form);
      updateUser({ name: form.name, pharmacyName: form.pharmacyName });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account details</p>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div style={{ marginBottom: 20, padding: '12px 16px', background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
          <p className="text-small text-muted">Email</p>
          <p style={{ fontWeight: 500 }}>{user?.email}</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input className="form-control" name="name" value={form.name} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Pharmacy Name</label>
            <input className="form-control" name="pharmacyName" value={form.pharmacyName} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input className="form-control" name="location" placeholder="City, Country" value={form.location} onChange={onChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
