import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestService, repaymentService } from '../../services';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [requests,   setRequests]   = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([requestService.getMyRequests(), repaymentService.getMyRepayments()])
      .then(([r, rp]) => { setRequests(r.requests); setRepayments(rp.repayments); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending  = requests.filter(r => r.status === 'pending').length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;
  const unpaid   = repayments.filter(r => r.status === 'pending').length;

  const recent = requests.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user?.name}</h1>
        <p>{user?.pharmacyName} — Inventory Finance Dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Requests</div>
          <div className="stat-value">{requests.length}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{pending}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Approved</div>
          <div className="stat-value">{approved}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Outstanding Repayments</div>
          <div className="stat-value">{unpaid}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
          <h3 className="card-title" style={{ margin: 0 }}>Recent Requests</h3>
          <Link to="/requests" className="btn btn-primary btn-sm">+ New Request</Link>
        </div>

        {loading ? <p className="text-muted">Loading...</p> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr className="empty-row"><td colSpan={4}>No requests yet. <Link to="/requests">Submit one now.</Link></td></tr>
                ) : recent.map(r => (
                  <tr key={r.id}>
                    <td>{r.medicine_name}</td>
                    <td>{r.quantity}</td>
                    <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
