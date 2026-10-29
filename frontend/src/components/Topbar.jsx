import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Topbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="topbar">
      <NavLink to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <span className="brandmark">NW</span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '.08em' }}>NXTWAVE</span>
          <span style={{ fontSize: 10, color: '#c7ff5e', fontWeight: 700, letterSpacing: '.12em' }}>AI MASTERCLASS</span>
        </div>
      </NavLink>

      <nav className="topbar-nav">
        <button onClick={() => scrollTo('about')} className="topbar-link">About</button>
        <button onClick={() => scrollTo('project')} className="topbar-link">What You'll Build</button>
        <button onClick={() => scrollTo('curriculum')} className="topbar-link">Curriculum</button>
        <button onClick={() => scrollTo('perks')} className="topbar-link">Perks & Certificate</button>
        <button onClick={() => scrollTo('faqs')} className="topbar-link">FAQs</button>
        {isAuthenticated && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
            Admin Dashboard
          </NavLink>
        )}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
        ) : (
          <button onClick={() => scrollTo('register')} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Claim Free Seat <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    </header>
  )
}
