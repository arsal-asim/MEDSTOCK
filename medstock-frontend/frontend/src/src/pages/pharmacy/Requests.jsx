import React, { useState, useEffect, useCallback } from 'react';
import { requestService } from '../../services';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected'];

export default function Requests() {
  // ── Request history state ──
  const [requests, setRequests] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [filter, setFilter] = useState('all');

  // ── New request form state ──
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ medicine_name: '', quantity: '' });
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch requests ──
  const fetchRequests = useCallback(() => {
    setLoadingList(true);
    requestService.getMyRequests()
      .then(res => setRequests(res.requests))
      .catch(err => toast.error(err.message))
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  // ── Form helpers ──
  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.medicine_name.trim()) e.medicine_name = 'Medicine name is required';
    if (!form.quantity)             e.quantity = 'Quantity is required';
    else if (Number(form.quantity) <= 0) e.quantity = 'Quantity must be greater than zero';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await requestService.submit({
        medicine_name: form.medicine_name.trim(),
        quantity: Number(form.quantity),
      });
      toast.success('Request submitted successfully!');
      setForm({ medicine_name: '', quantity: '' });
      setErrors({});
      setShowForm(false);
      fetchRequests(); // refresh the list immediately
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setForm({ medicine_name: '', quantity: '' });
    setErrors({});
  };

  // ── Filtered list ──
  const filtered = filter === 'all'
    ? requests
    : requests.filter(r => r.status === filter);

  // ── Summary counts ──
  const counts = {
    all:      requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex justify-between items-center page-header">
        <div>
          <h1>Requests</h1>
          <p>Submit new inventory requests and track all your orders</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + New Request
          </button>
        )}
      </div>

      {/* ── Inline new-request form (slides in when showForm is true) ── */}
      {showForm && (
        <div className="card requests-form-card">
          <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
            <div>
              <h3 className="card-title" style={{ margin: 0 }}>New Inventory Request</h3>
              <p style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
                Fill in the details below and submit your stock request
              </p>
            </div>
            <button className="modal-close" onClick={cancelForm} title="Close">✕</button>
          </div>

          <form onSubmit={onSubmit} className="requests-form">
            <div className="form-group">
              <label>Medicine Name *</label>
              <input
                className="form-control"
                name="medicine_name"
                placeholder="e.g. Paracetamol 500mg"
                value={form.medicine_name}
                onChange={onChange}
                autoFocus
              />
              {errors.medicine_name && (
                <span className="form-error">{errors.medicine_name}</span>
              )}
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                className="form-control"
                type="number"
                name="quantity"
                placeholder="e.g. 100"
                value={form.quantity}
                onChange={onChange}
                min="1"
              />
              {errors.quantity && (
                <span className="form-error">{errors.quantity}</span>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Summary mini-stats ── */}
      <div className="requests-summary">
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            className={`requests-summary__chip ${filter === s ? 'requests-summary__chip--active' : ''}`}
            onClick={() => setFilter(s)}
          >
            <span className="requests-summary__chip-label">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            <span className={`requests-summary__chip-count badge badge-${s === 'all' ? 'pending' : s}`}
              style={s === 'all' ? { background: '#eff6ff', color: '#2563eb' } : {}}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Requests table ── */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Admin Note</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr className="empty-row"><td colSpan={6}>Loading your requests…</td></tr>
            ) : filtered.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={6}>
                  {filter === 'all'
                    ? <span>No requests yet. <button className="link-btn" onClick={() => setShowForm(true)}>Submit your first one →</button></span>
                    : `No ${filter} requests found.`
                  }
                </td>
              </tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td className="text-muted">{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{r.medicine_name}</td>
                <td>{r.quantity}</td>
                <td>
                  <span className={`badge badge-${r.status}`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </td>
                <td className="text-muted">{r.admin_note || '—'}</td>
                <td className="text-muted">{new Date(r.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
