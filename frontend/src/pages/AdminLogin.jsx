import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { seedAdmin } from '../api/client'

export default function AdminLogin() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [seeding, setSeeding] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { toast.error('Enter username and password'); return }
    const res = await login(form.username, form.password)
    if (res.success) {
      toast.success('Welcome to the operator dashboard!')
      navigate('/admin')
    } else {
      toast.error(res.message || 'Login failed')
    }
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await seedAdmin()
      toast.success('Admin seeded! username: admin, password: campusrelay2024')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Seed failed — admin may already exist')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card animate-fade-up">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <img src="/nxtwave_white_logo.svg" alt="NxtWave Logo" style={{ height: 26, width: 'auto' }} />
          <div style={{ height: 18, width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.16em', textTransform: 'uppercase', color: '#c7ff5e' }}>Operator Portal</div>
        </div>

        <h1>Operator login</h1>
        <p>Access the live dashboard, registration list, captain management, and CSV export.</p>

        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" value={form.username} onChange={handleChange}
              placeholder="admin" autoComplete="username" />
          </div>
          <div className="field" style={{ marginBottom: 20 }}>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Logging in…</> : 'Log in ↗'}
          </button>
        </form>

        <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, color: '#596a8a', lineHeight: 1.6, margin: '0 0 10px' }}>
            First time? Seed the default admin account (only works if no admin exists yet).
          </p>
          <button className="btn btn-outline btn-sm" onClick={handleSeed} disabled={seeding} type="button">
            {seeding ? <><span className="spinner" /> Seeding…</> : 'Seed admin account'}
          </button>
          <p style={{ fontSize: 10, color: '#3d4a65', marginTop: 8, lineHeight: 1.5 }}>
            Default: <strong style={{ color: '#7e8eab' }}>admin</strong> / <strong style={{ color: '#7e8eab' }}>campusrelay2024</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
