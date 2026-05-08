import React, { useEffect, useState } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setData(res))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading...</p>;

  const { stats, recent } = data;

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>System overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Pharmacies</div>
          <div className="stat-value">{stats.total_pharmacies}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Approved</div>
          <div className="stat-value">{stats.approved}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Rejected</div>
          <div className="stat-value">{stats.rejected}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Pending Repayments</div>
          <div className="stat-value">{stats.pending_repayments}</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Total Credit Issued</div>
          <div className="stat-value">PKR {Number(stats.total_credit).toLocaleString()}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Recent Requests</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Pharmacy</th><th>Medicine</th><th>Qty</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr className="empty-row"><td colSpan={5}>No requests yet.</td></tr>
              ) : recent.map(r => (
                <tr key={r.id}>
                  <td>{r.pharmacy_name}</td>
                  <td>{r.medicine_name}</td>
                  <td>{r.quantity}</td>
                  <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
