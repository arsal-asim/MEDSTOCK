import React, { useEffect, useState } from 'react';
import { repaymentService } from '../../services';
import toast from 'react-hot-toast';

function getRepaymentBadge(r) {
  if (r.status === 'paid') return 'paid';
  const today   = new Date();
  const dueDate = new Date(r.due_date);
  return dueDate < today ? 'overdue' : 'due';
}

export default function Repayments() {
  const [repayments, setRepayments] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    repaymentService.getMyRepayments()
      .then(res => setRepayments(res.repayments))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalOwed = repayments
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Repayments</h1>
        <p>Track your outstanding credit and payment history</p>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ maxWidth: 480 }}>
        <div className="stat-card amber">
          <div className="stat-label">Total Outstanding</div>
          <div className="stat-value">PKR {totalOwed.toLocaleString()}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Paid</div>
          <div className="stat-value">{repayments.filter(r => r.status === 'paid').length}</div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Paid On</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row"><td colSpan={7}>Loading...</td></tr>
            ) : repayments.length === 0 ? (
              <tr className="empty-row"><td colSpan={7}>No repayment records yet.</td></tr>
            ) : repayments.map((r, i) => (
              <tr key={r.id}>
                <td className="text-muted">{i + 1}</td>
                <td>{r.medicine_name}</td>
                <td>{r.quantity}</td>
                <td>PKR {Number(r.amount).toLocaleString()}</td>
                <td>{new Date(r.due_date).toLocaleDateString()}</td>
                <td><span className={`badge badge-${getRepaymentBadge(r)}`}>{getRepaymentBadge(r)}</span></td>
                <td>{r.paid_at ? new Date(r.paid_at).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
