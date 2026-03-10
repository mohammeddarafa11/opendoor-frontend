import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ─── Request interceptor: attach token ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor: handle 401 ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Only redirect if not already on login/register
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// ═════════════════════════════════════════════════════════════════════
// AUTH API — matches backend authRoutes.js exactly
// ═════════════════════════════════════════════════════════════════════
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateMe: (data) => api.put("/auth/me", data),
  changePassword: (data) => api.put("/auth/change-password", data),
  uploadDocument: (formData) =>
    api.post("/auth/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getDocuments: () => api.get("/auth/documents"),
  createStaff: (data) => api.post("/auth/create-staff", data),
};

// ═════════════════════════════════════════════════════════════════════
// UNITS API
// ═════════════════════════════════════════════════════════════════════
export const unitsAPI = {
  getAll: (params) => api.get("/units", { params }),
  getById: (id) => api.get(`/units/${id}`),
  create: (data) => api.post("/units", data),
  update: (id, data) => api.put(`/units/${id}`, data),
  delete: (id) => api.delete(`/units/${id}`),
  uploadImages: (id, formData) =>
    api.post(`/units/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteImage: (id, imageId) => api.delete(`/units/${id}/images/${imageId}`),
};

// ═════════════════════════════════════════════════════════════════════
// RESERVATIONS API
// ═════════════════════════════════════════════════════════════════════
export const reservationsAPI = {
  getAll: () => api.get("/reservations"),
  getMy: () => api.get("/reservations/my"),
  getByAgent: () => api.get("/reservations/agent"),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post("/reservations", data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  cancel: (id, reason) =>
    api.put(`/reservations/${id}/cancel`, { cancellation_reason: reason }),
};

// ═════════════════════════════════════════════════════════════════════
// PAYMENTS API
// ═════════════════════════════════════════════════════════════════════
export const paymentsAPI = {
  getAll: () => api.get("/payments"),
  getMy: () => api.get("/payments/my"),
  getByReservation: (resId) => api.get(`/payments/reservation/${resId}`),
  create: (data) => api.post("/payments", data),
  verify: (id) => api.put(`/payments/${id}/verify`),
};

// ═════════════════════════════════════════════════════════════════════
// WAITLIST API
// ═════════════════════════════════════════════════════════════════════
export const waitlistAPI = {
  getAll: () => api.get("/waitlist"),
  getMy: () => api.get("/waitlist/my"),
  getByUnit: (unitId) => api.get(`/waitlist/unit/${unitId}`),
  join: (unitId) => api.post("/waitlist", { unit: unitId }),
  leave: (id) => api.delete(`/waitlist/${id}`),
  notify: (id) => api.post(`/waitlist/${id}/notify`),
};

// ═════════════════════════════════════════════════════════════════════
// WISHLIST API
// ═════════════════════════════════════════════════════════════════════
export const wishlistAPI = {
  getMy: () => api.get("/wishlist"),
  toggle: (unitId) => api.post("/wishlist/toggle", { unit: unitId }),
  check: (unitId) => api.get(`/wishlist/check/${unitId}`),
  remove: (id) => api.delete(`/wishlist/${id}`),
};

// ═════════════════════════════════════════════════════════════════════
// DASHBOARD API
// ═════════════════════════════════════════════════════════════════════
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getManagerStats: () => api.get("/dashboard/manager"),
  getAgentStats: () => api.get("/dashboard/agent"),
};

// ═════════════════════════════════════════════════════════════════════
// ADMIN API
// ═════════════════════════════════════════════════════════════════════
export const adminAPI = {
  getUsers: (params) => api.get("/admin/users", { params }),
  getAgents: () => api.get("/admin/agents"),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
};

// ═════════════════════════════════════════════════════════════════════
// PROJECTS API
// ═════════════════════════════════════════════════════════════════════
export const projectsAPI = {
  getAll: () => api.get("/projects"),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// ═════════════════════════════════════════════════════════════════════
// BLOCKS API
// ═════════════════════════════════════════════════════════════════════
export const blocksAPI = {
  getAll: (params) => api.get("/blocks", { params }),
  getById: (id) => api.get(`/blocks/${id}`),
  create: (data) => api.post("/blocks", data),
  update: (id, data) => api.put(`/blocks/${id}`, data),
  delete: (id) => api.delete(`/blocks/${id}`),
};

export default api;
