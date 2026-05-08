import React, { useEffect, useState } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

export default function AdminPharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    adminService.getPharmacies()
      .then(res => setPharmacies(res.pharmacies))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Pharmacies</h1>
        <p>All registered pharmacies on the platform</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Pharmacy</th><th>Owner</th><th>Email</th><th>Location</th><th>Total Requests</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row"><td colSpan={7}>Loading...</td></tr>
            ) : pharmacies.length === 0 ? (
              <tr className="empty-row"><td colSpan={7}>No pharmacies registered yet.</td></tr>
            ) : pharmacies.map((p, i) => (
              <tr key={p.id}>
                <td className="text-muted">{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>{p.owner_name}</td>
                <td className="text-muted">{p.email}</td>
                <td>{p.location || '—'}</td>
                <td>{p.total_requests}</td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
