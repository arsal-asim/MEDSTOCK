import React, { useEffect, useState } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [modal,    setModal]    = useState(null); // { request, action: 'approved'|'rejected' }
  const [form,     setForm]     = useState({ admin_note: '', amount: '', due_date: '' });
  const [saving,   setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    const params = filter !== 'all' ? { status: filter } : {};
    adminService.getAllRequests(params)
      .then(res => setRequests(res.requests))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const openModal = (request, action) => {
    setModal({ request, action });
    setForm({ admin_note: '', amount: '', due_date: '' });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (modal.action === 'approved' && (!form.amount || !form.due_date)) {
      toast.error('Amount and due date are required for approval');
      return;
    }
    setSaving(true);
    try {
      await adminService.updateRequest(modal.request.id, { status: modal.action, ...form });
      toast.success(`Request ${modal.action}`);
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>All Requests</h1>
        <p>Review and manage pharmacy inventory requests</p>
      </div>

      <div className="flex gap-2" style={{ marginBottom: 16 }}>
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Pharmacy</th><th>Location</th><th>Medicine</th><th>Qty</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row"><td colSpan={7}>Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr className="empty-row"><td colSpan={7}>No requests found.</td></tr>
            ) : requests.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 500 }}>{r.pharmacy_name}</td>
                <td className="text-muted">{r.location || '—'}</td>
                <td>{r.medicine_name}</td>
                <td>{r.quantity}</td>
                <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                <td>
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={() => openModal(r, 'approved')}>Approve</button>
                      <button className="btn btn-danger btn-sm"  onClick={() => openModal(r, 'rejected')}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approve / Reject Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.action === 'approved' ? '✅ Approve Request' : '❌ Reject Request'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">
                <p style={{ marginBottom: 16, color: '#374151' }}>
                  <strong>{modal.request.pharmacy_name}</strong> — {modal.request.medicine_name} × {modal.request.quantity}
                </p>

                {modal.action === 'approved' && (
                  <>
                    <div className="form-group">
                      <label>Credit Amount (PKR) *</label>
                      <input className="form-control" type="number" placeholder="e.g. 15000"
                        value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Repayment Due Date *</label>
                      <input className="form-control" type="date"
                        value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Note (optional)</label>
                  <input className="form-control" placeholder="Add a note for the pharmacy..."
                    value={form.admin_note} onChange={e => setForm(p => ({ ...p, admin_note: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className={`btn ${modal.action === 'approved' ? 'btn-success' : 'btn-danger'}`} disabled={saving}>
                  {saving ? 'Saving...' : modal.action === 'approved' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
