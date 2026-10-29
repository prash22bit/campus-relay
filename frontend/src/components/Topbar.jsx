import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X, Sparkles, Calendar, Laptop, HelpCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AddToCalendarButton from './AddToCalendarButton'

export default function Topbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  const scrollTo = (id) => {
    setMobileMenuOpen(false)
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
    <>
      <header className="topbar">
        <NavLink to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/nxtwave_white_logo.svg" alt="NxtWave Logo" style={{ height: 24, width: 'auto' }} />
          <div style={{ height: 18, width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '.08em', color: '#fff' }}>CAMPUS RELAY</span>
            <span style={{ fontSize: 10, color: '#c7ff5e', fontWeight: 700, letterSpacing: '.12em' }}>AI WORKSHOP</span>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
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

        {/* Desktop Actions */}
        <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
          ) : (
            <>
              <AddToCalendarButton variant="navbar" className="desktop-only-btn" />
              <button onClick={() => scrollTo('register')} className="btn btn-primary btn-sm desktop-only-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Claim Free Seat <ArrowUpRight size={14} />
              </button>
            </>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down Navigation Drawer */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 68,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 16, 32, 0.98)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          zIndex: 999,
          display: mobileMenuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          padding: '20px 20px 32px',
          overflowY: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => scrollTo('about')}
            className="mobile-drawer-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              textAlign: 'left',
            }}
          >
            <Sparkles size={18} style={{ color: '#c7ff5e' }} />
            <span>About Masterclass</span>
          </button>

          <button
            onClick={() => scrollTo('project')}
            className="mobile-drawer-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              textAlign: 'left',
            }}
          >
            <Laptop size={18} style={{ color: '#8bb7ff' }} />
            <span>What You'll Build (Live AI App)</span>
          </button>

          <button
            onClick={() => scrollTo('curriculum')}
            className="mobile-drawer-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              textAlign: 'left',
            }}
          >
            <Calendar size={18} style={{ color: '#c7ff5e' }} />
            <span>60-Minute Schedule</span>
          </button>

          <button
            onClick={() => scrollTo('perks')}
            className="mobile-drawer-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              textAlign: 'left',
            }}
          >
            <ShieldCheck size={18} style={{ color: '#2ecc71' }} />
            <span>Perks & Certificate</span>
          </button>

          <button
            onClick={() => scrollTo('faqs')}
            className="mobile-drawer-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              textAlign: 'left',
            }}
          >
            <HelpCircle size={18} style={{ color: '#ff917e' }} />
            <span>Frequently Asked Questions</span>
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AddToCalendarButton variant="navbar" style={{ width: '100%', height: 46, justifyContent: 'center' }} />
          <button
            onClick={() => scrollTo('register')}
            className="btn btn-primary"
            style={{
              width: '100%',
              height: 52,
              fontSize: 16,
              fontWeight: 800,
              borderRadius: 14,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Claim Free Seat Now <ArrowUpRight size={18} />
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ width: '100%', height: 46, fontSize: 14, borderRadius: 12 }}
            >
              Logout (Admin)
            </button>
          ) : (
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/admin/login') }}
              style={{
                color: '#7e8eab',
                fontSize: 12,
                textAlign: 'center',
                padding: '8px 0',
                textDecoration: 'underline',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Organizer / Admin Portal
            </button>
          )}
        </div>
      </div>
    </>
  )
}

