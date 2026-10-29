import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cr_token')
      localStorage.removeItem('cr_admin')
    }
    return Promise.reject(err)
  }
)

/* ── Public endpoints ─────────────────────────────────────── */
export const registerStudent = (payload) => api.post('/register', payload)
export const validateCode    = (code)    => api.get(`/register/validate-code/${code}`)

/* ── Admin endpoints ──────────────────────────────────────── */
export const adminLogin       = (creds)   => api.post('/admin/login', creds)
export const fetchDashboard   = ()        => api.get('/admin/dashboard')
export const fetchRegistrations = (params) => api.get('/admin/registrations', { params })
export const exportCSV        = ()        => api.get('/admin/export', { responseType: 'blob' })
export const fetchCaptains    = ()        => api.get('/admin/captains')
export const addCaptain       = (data)    => api.post('/admin/captains', data)
export const deactivateCaptain= (id)      => api.delete(`/admin/captains/${id}`)
export const seedAdmin        = ()        => api.post('/admin/seed')

export default api
