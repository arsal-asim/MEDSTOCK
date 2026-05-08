import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../services';
import toast from 'react-hot-toast';

export default function NewRequest() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ medicine_name: '', quantity: '' });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.medicine_name.trim()) e.medicine_name = 'Medicine name is required';
    if (!form.quantity)             e.quantity = 'Quantity is required';
    else if (form.quantity <= 0)    e.quantity = 'Quantity must be greater than zero';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await requestService.submit({ medicine_name: form.medicine_name.trim(), quantity: Number(form.quantity) });
      toast.success('Request submitted successfully!');
      navigate('/requests');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>New Inventory Request</h1>
        <p>Submit a request for medicines you need</p>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Medicine Name *</label>
            <input
              className="form-control"
              name="medicine_name"
              placeholder="e.g. Paracetamol 500mg"
              value={form.medicine_name}
              onChange={onChange}
            />
            {errors.medicine_name && <span className="form-error">{errors.medicine_name}</span>}
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
            {errors.quantity && <span className="form-error">{errors.quantity}</span>}
          </div>

          <div className="flex gap-2 mt-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/requests')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
