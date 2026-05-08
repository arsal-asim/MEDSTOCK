import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../../services';
import toast from 'react-hot-toast';

export default function RequestHistory() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    requestService.getMyRequests()
      .then(res => setRequests(res.requests))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center page-header">
        <div>
          <h1>My Requests</h1>
          <p>Track all your inventory requests</p>
        </div>
        <Link to="/new-request" className="btn btn-primary">+ New Request</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2" style={{ marginBottom: 16 }}>
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Admin Note</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row"><td colSpan={6}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr className="empty-row"><td colSpan={6}>No requests found.</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td className="text-muted">{i + 1}</td>
                <td>{r.medicine_name}</td>
                <td>{r.quantity}</td>
                <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                <td className="text-muted">{r.admin_note || '—'}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
