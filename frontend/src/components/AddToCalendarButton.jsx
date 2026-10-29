import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown, Check, Download, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { getGoogleCalendarUrl, getOutlookCalendarUrl, downloadIcsFile } from '../utils/calendar'

export default function AddToCalendarButton({
  passId = '',
  variant = 'default', // 'navbar' | 'primary' | 'outline' | 'default' | 'card'
  className = '',
  style = {},
  label = 'Add to Calendar',
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleGoogle = (e) => {
    e.stopPropagation()
    const url = getGoogleCalendarUrl(passId)
    window.open(url, '_blank', 'noopener,noreferrer')
    toast.success('Opening Google Calendar...')
    setOpen(false)
  }

  const handleOutlook = (e) => {
    e.stopPropagation()
    const url = getOutlookCalendarUrl(passId)
    window.open(url, '_blank', 'noopener,noreferrer')
    toast.success('Opening Outlook Calendar...')
    setOpen(false)
  }

  const handleIcs = (e) => {
    e.stopPropagation()
    downloadIcsFile(passId)
    toast.success('Calendar .ics file downloaded!')
    setOpen(false)
  }

  // Styles based on variant
  let btnClasses = 'calendar-btn'
  let btnStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    cursor: 'pointer',
    fontWeight: 700,
    borderRadius: 10,
    transition: 'all .15s ease',
    ...style,
  }

  if (variant === 'navbar') {
    btnStyles = {
      ...btnStyles,
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#e2e8f0',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      fontSize: 12,
      padding: '7px 13px',
      height: 38,
    }
  } else if (variant === 'primary') {
    btnStyles = {
      ...btnStyles,
      background: 'var(--lime)',
      color: 'var(--navy)',
      border: 'none',
      fontSize: 14,
      padding: '10px 18px',
      fontWeight: 800,
    }
  } else if (variant === 'card') {
    btnStyles = {
      ...btnStyles,
      background: '#fff',
      color: 'var(--navy)',
      border: '1px solid #cbd5e1',
      fontSize: 13,
      padding: '9px 15px',
      boxShadow: '0 2px 8px rgba(0,0,0,.04)',
    }
  } else {
    btnStyles = {
      ...btnStyles,
      background: '#0b1020',
      color: '#c7ff5e',
      border: '1px solid rgba(199, 255, 94, 0.3)',
      fontSize: 13,
      padding: '8px 16px',
    }
  }

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <button
        type="button"
        className={btnClasses}
        style={btnStyles}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        title="Add workshop to your calendar"
      >
        <Calendar size={14} style={{ color: variant === 'navbar' ? '#c7ff5e' : 'currentColor' }} />
        <span>{label}</span>
        <ChevronDown size={12} style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>

      {open && (
        <div
          className="calendar-dropdown animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 1000,
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 14,
            padding: '6px',
            minWidth: 200,
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div style={{ padding: '6px 10px 4px', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 800 }}>
            Choose Calendar
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 8,
              background: 'transparent',
              color: '#f8fafc',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              textAlign: 'left',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4285F4' }} />
              Google Calendar
            </span>
            <ExternalLink size={12} style={{ color: '#64748b' }} />
          </button>

          <button
            type="button"
            onClick={handleOutlook}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 8,
              background: 'transparent',
              color: '#f8fafc',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              textAlign: 'left',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0078D4' }} />
              Outlook Web
            </span>
            <ExternalLink size={12} style={{ color: '#64748b' }} />
          </button>

          <button
            type="button"
            onClick={handleIcs}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 8,
              background: 'transparent',
              color: '#f8fafc',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              textAlign: 'left',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Download size={13} style={{ color: '#c7ff5e' }} />
              Apple / iCal / Outlook (.ics)
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
