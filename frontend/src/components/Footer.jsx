import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Laptop,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer" style={{ borderTop: '1px solid #e1e7f1', background: '#0b1020', color: '#9aa5be', padding: '40px clamp(20px, 5vw, 76px) 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', marginBottom: 12 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: '#c7ff5e', color: '#0b1020', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 13 }}>NW</span>
            <strong style={{ letterSpacing: '.06em', fontSize: 14 }}>NXTWAVE LIVE WORKSHOP</strong>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#8894af', margin: 0 }}>
            "Build Your First AI Project in 60 Minutes" — a free, live, hands-on masterclass empowering engineering students to build, deploy, and showcase real-world AI applications.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.12em', margin: '0 0 12px' }}>Workshop Details</h4>
          <ul style={{ fontSize: 13, lineHeight: 2, color: '#8894af', listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={13} style={{ color: '#c7ff5e' }} /> Upcoming Saturday · 7:00 PM IST
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={13} style={{ color: '#c7ff5e' }} /> 60 Minutes Practical Lab
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Laptop size={13} style={{ color: '#c7ff5e' }} /> Live Interactive Online Session
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={13} style={{ color: '#c7ff5e' }} /> Official Certificate of Completion
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.12em', margin: '0 0 12px' }}>Eligibility</h4>
          <ul style={{ fontSize: 13, lineHeight: 2, color: '#8894af', listStyle: 'none', padding: 0 }}>
            <li>• Open to all engineering students</li>
            <li>• Branches: CSE, IT, AI/DS, ECE, EEE, Mech, Civil</li>
            <li>• Batches: 2025, 2026, 2027, 2028</li>
            <li>• Prerequisite: Basic curiosity (No ML needed)</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.12em', margin: '0 0 12px' }}>Host & Organizer</h4>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#8894af', margin: '0 0 12px' }}>
            Conducted by NxtWave Senior AI Engineers & Mentors.
          </p>
          <div style={{ fontSize: 12, color: '#c7ff5e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} /> 100% Free for College Students
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.08)', fontSize: 12 }}>
        <span>© 2024 NxtWave Disruptive Technologies. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/register" style={{ color: '#c7ff5e', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Register Free <ArrowUpRight size={13} />
          </Link>
          <span style={{ opacity: 0.3 }}>|</span>
          <Link to="/admin/login" style={{ color: '#62708f', fontSize: 11 }}>Organizer / Admin Portal</Link>
        </div>
      </div>
    </footer>
  )
}
