import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Orders ────────────────────────────────────────────────────────────────────
export const getOrders        = (dateFilter = 'all') => api.get(`/orders?dateFilter=${dateFilter}`)
export const getOrderById     = (id)                 => api.get(`/orders/${id}`)
export const createOrder      = (data)               => api.post('/orders', data)
export const updateOrder      = (id, data)           => api.put(`/orders/${id}`, data)
export const deleteOrder      = (id)                 => api.delete(`/orders/${id}`)

// ── Dashboard ─────────────────────────────────────────────────────────────────
const getUserId = () => localStorage.getItem('helleyx_user') || 'default_user'
export const getDashboard     = ()     => api.get(`/dashboard/${getUserId()}`)
export const saveDashboard    = (data) => api.post(`/dashboard/${getUserId()}/save`, data)
export const addWidget        = (data) => api.post(`/dashboard/${getUserId()}/widgets`, data)
export const updateWidget     = (id, data) => api.put(`/dashboard/widgets/${id}`, data)
export const deleteWidget     = (id)   => api.delete(`/dashboard/widgets/${id}`)

export default api
