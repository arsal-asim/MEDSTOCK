import api from './api';

// Auth
export const authService = {
  register:      (data) => api.post('/auth/register', data),
  login:         (data) => api.post('/auth/login', data),
  getMe:         ()     => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Pharmacy - requests
export const requestService = {
  getMyRequests: ()     => api.get('/requests'),
  submit:        (data) => api.post('/requests', data),
};

// Pharmacy - repayments
export const repaymentService = {
  getMyRepayments: () => api.get('/repayments'),
};

// Admin
export const adminService = {
  getDashboard:    ()           => api.get('/admin/dashboard'),
  getPharmacies:   ()           => api.get('/admin/pharmacies'),
  getAllRequests:   (params)     => api.get('/admin/requests', { params }),
  updateRequest:   (id, data)   => api.put(`/admin/requests/${id}`, data),
  getAllRepayments: (params)     => api.get('/admin/repayments', { params }),
  markPaid:        (id)         => api.put(`/admin/repayments/${id}/paid`),
};
