import React, { useEffect, useState } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

export default function AdminRepayments() {
  const [repayments, setRepayments] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');

  const load = () => {
    setLoading(true);
    const params = filter !== 'all' ? { status: filter } : {};
    adminService.getAllRepayments(params)
      .then(res => setRepayments(res.repayments))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const markPaid = async (id) => {
    if (!confirm('Mark this repayment as paid?')) return;
    try {
      await adminService.markPaid(id);
      toast.success('Marked as paid');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const totalPending = repayments
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Repayments</h1>
        <p>Track credit repayments from pharmacies</p>
      </div>

      <div className="stats-grid" style={{ maxWidth: 480, marginBottom: 20 }}>
        <div className="stat-card amber">
          <div className="stat-label">Total Outstanding</div>
          <div className="stat-value">PKR {totalPending.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex gap-2" style={{ marginBottom: 16 }}>
        {['all', 'pending', 'paid'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Pharmacy</th><th>Medicine</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Paid On</th><th>Action</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row"><td colSpan={7}>Loading...</td></tr>
            ) : repayments.length === 0 ? (
              <tr className="empty-row"><td colSpan={7}>No repayments found.</td></tr>
            ) : repayments.map(r => {
              const isOverdue = r.status === 'pending' && new Date(r.due_date) < new Date();
              return (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.pharmacy_name}</td>
                  <td>{r.medicine_name}</td>
                  <td>PKR {Number(r.amount).toLocaleString()}</td>
                  <td style={{ color: isOverdue ? '#dc2626' : 'inherit' }}>
                    {new Date(r.due_date).toLocaleDateString()}
                    {isOverdue && <span style={{ marginLeft: 6, fontSize: 11, color: '#dc2626' }}>overdue</span>}
                  </td>
                  <td><span className={`badge badge-${r.status === 'paid' ? 'paid' : isOverdue ? 'overdue' : 'due'}`}>{r.status}</span></td>
                  <td>{r.paid_at ? new Date(r.paid_at).toLocaleDateString() : '—'}</td>
                  <td>
                    {r.status === 'pending' && (
                      <button className="btn btn-success btn-sm" onClick={() => markPaid(r.id)}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
