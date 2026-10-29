import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Check,
  Ticket,
  Gift,
  Share2,
  Copy,
  ShieldCheck,
  GraduationCap,
  Zap,
  Calendar,
  Clock,
  Laptop,
  X,
} from 'lucide-react'
import { registerStudent, validateCode } from '../api/client'
import AddToCalendarButton from '../components/AddToCalendarButton'

const BRANCHES = ['CSE', 'IT', 'AI & Data Science', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other']
const YEARS = ['2025', '2026', '2027', '2028', 'Other']

export default function Register() {
  const [params] = useSearchParams()
  const refFromUrl = params.get('ref')?.toUpperCase() || ''

  const [form, setForm] = useState({
    name: '',
    email: '',
    college: '',
    branch: '',
    gradYear: '',
    referralCode: refFromUrl,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [codeStatus, setCodeStatus] = useState(null)

  useEffect(() => {
    const code = form.referralCode.trim().toUpperCase()
    if (!code) { setCodeStatus(null); return }
    const timer = setTimeout(async () => {
      setCodeStatus('checking')
      try {
        const { data } = await validateCode(code)
        setCodeStatus(data.valid ? 'valid' : 'invalid')
      } catch {
        setCodeStatus(null)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [form.referralCode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.college.trim()) e.college = 'College name is required'
    if (!form.branch) e.branch = 'Select your branch'
    if (!form.gradYear) e.gradYear = 'Select graduation year'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const { data } = await registerStudent({
        name: form.name.trim(),
        email: form.email.trim(),
        college: form.college.trim(),
        branch: form.branch,
        gradYear: form.gradYear,
        referralCode: form.referralCode.trim().toUpperCase() || undefined,
      })
      setResult({
        personalCode: data.data.personalCode,
        name: data.data.name,
        inviteUrl: data.data.inviteUrl,
      })
      toast.success('Your seat is reserved!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      if (err.response?.status === 409) {
        if (err.response?.data?.personalCode) {
          setResult({
            personalCode: err.response.data.personalCode,
            name: form.name || 'Student',
            inviteUrl: `${window.location.origin}/?ref=${err.response.data.personalCode}`,
          })
        }
        toast.error(msg)
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => toast.success('Copied to clipboard!')).catch(() => toast.error('Copy failed'))
  }

  const shareWA = () => {
    if (!result?.personalCode) return
    const text = `Hey! I just registered for NxtWave's free live workshop: "Build Your First AI Project in 60 Minutes".\n\nWe will build a real AI app from scratch and get a verified project certificate!\n\nClaim your free seat here: ${result.inviteUrl}\nInvite Code: ${result.personalCode}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <section className="section" style={{ minHeight: '80vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <Link to="/" style={{ color: '#174092', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <ArrowLeft size={14} /> Back to Workshop Details
          </Link>
          <div className="kicker" style={{ color: '#174092' }}>FREE LIVE WORKSHOP</div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', margin: '4px 0 8px', letterSpacing: '-.03em' }}>
            Claim Your Free Seat
          </h1>
          <p style={{ color: '#68758e', fontSize: 15, margin: 0, maxWidth: 600 }}>
            Join the 60-minute hands-on lab: <strong>"Build Your First AI Project in 60 Minutes"</strong>. Fill in your details below to receive your workshop pass.
          </p>
        </div>

        <div className="workspace" style={{ gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)', gap: 24, alignItems: 'start' }}>
          {/* Main Registration Card */}
          <div className="card" style={{ background: '#fff', borderRadius: 24, padding: 'clamp(24px, 4vw, 36px)', boxShadow: '0 16px 45px rgba(11,16,32,.07)' }}>
            {!result ? (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 20, letterSpacing: '-.03em' }}>Student Registration</h3>
                  <span className="pill pill-lime" style={{ background: '#f2fae3', color: '#385718', border: '1px solid #d4eb9d' }}>100% Free Pass</span>
                </div>

                {refFromUrl && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Ticket size={16} />
                    <span>Referral code <strong>{refFromUrl}</strong> applied. You are eligible for priority workshop entry.</span>
                  </div>
                )}

                <div className="form-grid">
                  <div className={`field full ${errors.name ? 'error' : ''}`}>
                    <label htmlFor="name">Full Name *</label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ananya Sharma" maxLength={80} autoComplete="name" />
                    {errors.name && <span className="err-msg">{errors.name}</span>}
                  </div>

                  <div className={`field full ${errors.email ? 'error' : ''}`}>
                    <label htmlFor="email">College Email Address *</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. ananya@college.edu or personal email" maxLength={120} autoComplete="email" />
                    {errors.email && <span className="err-msg">{errors.email}</span>}
                  </div>

                  <div className={`field ${errors.college ? 'error' : ''}`}>
                    <label htmlFor="college">College / Institute *</label>
                    <input id="college" name="college" value={form.college} onChange={handleChange} placeholder="e.g. VNR VJIET, CBIT, Vasavi" maxLength={100} />
                    {errors.college && <span className="err-msg">{errors.college}</span>}
                  </div>

                  <div className={`field ${errors.branch ? 'error' : ''}`}>
                    <label htmlFor="branch">Branch of Study *</label>
                    <select id="branch" name="branch" value={form.branch} onChange={handleChange}>
                      <option value="">Select your branch</option>
                      {BRANCHES.map((b) => <option key={b}>{b}</option>)}
                    </select>
                    {errors.branch && <span className="err-msg">{errors.branch}</span>}
                  </div>

                  <div className={`field ${errors.gradYear ? 'error' : ''}`}>
                    <label htmlFor="gradYear">Graduation Year *</label>
                    <select id="gradYear" name="gradYear" value={form.gradYear} onChange={handleChange}>
                      <option value="">Select graduation year</option>
                      {YEARS.map((y) => <option key={y}>{y}</option>)}
                    </select>
                    {errors.gradYear && <span className="err-msg">{errors.gradYear}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="referralCode">
                      Invite Code (optional)
                      {codeStatus === 'checking' && <span style={{ color: '#64748b', fontSize: 11, marginLeft: 6 }}>validating…</span>}
                      {codeStatus === 'valid' && <span style={{ color: '#16a34a', fontSize: 11, marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Check size={12} /> Valid code</span>}
                      {codeStatus === 'invalid' && <span style={{ color: '#dc2626', fontSize: 11, marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 3 }}><X size={12} /> Code not found</span>}
                    </label>
                    <input id="referralCode" name="referralCode" value={form.referralCode} onChange={handleChange} placeholder="e.g. CC-CBIT01 or CR-XXXXX" style={{ textTransform: 'uppercase' }} maxLength={20} />
                    <span className="hint">Shared by a classmate or Campus Captain</span>
                  </div>
                </div>

                <button className="btn btn-dark btn-full" style={{ marginTop: 22, height: 48, fontSize: 15 }} type="submit" disabled={loading}>
                  {loading ? <><span className="spinner" /> Reserving Seat…</> : <>Complete Free Registration <ArrowUpRight size={16} /></>}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16, fontSize: 11, color: '#64748b' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={14} style={{ color: '#16a34a' }} /> Instant Confirmation
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <GraduationCap size={14} style={{ color: '#174092' }} /> Verified Certificate
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={14} style={{ color: '#c7ff5e' }} /> Zero Fees
                  </span>
                </div>
              </form>
            ) : (
              /* Success View */
              <div className="success-box animate-fade-in" style={{ padding: 24, borderRadius: 18, background: '#f2fae3', border: '1px solid #cce89d' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#2d5a15', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#d6eda8', display: 'grid', placeItems: 'center', color: '#2d5a15' }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 20 }}>Seat Confirmed, {result.name}!</h4>
                    <p style={{ margin: 0, fontSize: 13, color: '#4a6b2a' }}>We have saved your seat for the live AI workshop.</p>
                  </div>
                </div>

                <div style={{ background: '#fff', borderRadius: 14, padding: 18, margin: '16px 0', border: '1px solid #d3e7b3' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: '#5b7e33', fontWeight: 800 }}>
                    Your Personal Workshop Pass ID
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#101426', letterSpacing: '.08em', margin: '6px 0' }}>
                    {result.personalCode}
                  </div>
                  <div style={{ fontSize: 12, color: '#687754' }}>
                    Keep this pass handy. It will be used to issue your completion certificate.
                  </div>
                </div>

                <div style={{ background: '#fff', borderRadius: 14, padding: 18, margin: '16px 0', border: '2px dashed #9bc56b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#254b11', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                    <Gift size={18} style={{ color: '#254b11' }} />
                    <span>Bring 2 Classmates & Unlock Bonus AI Toolkit</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#4d6935', lineHeight: 1.5, margin: '0 0 12px' }}>
                    Share your invite link with friends. When 2 classmates register, you will automatically unlock the <strong>AI Prompt Engineering Toolkit & Complete GitHub Repository</strong>!
                  </p>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <button className="btn btn-dark btn-sm" onClick={shareWA} style={{ background: '#25D366', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Share2 size={14} /> Share on WhatsApp <ArrowUpRight size={13} />
                    </button>
                    <button className="btn btn-outline-dark btn-sm" onClick={() => copyText(result.inviteUrl)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Copy size={14} /> Copy Invite Link
                    </button>
                    <AddToCalendarButton passId={result.personalCode} variant="card" />
                  </div>
                </div>

                <button className="btn btn-outline-dark btn-sm" style={{ marginTop: 8 }} onClick={() => { setResult(null); setForm({ name: '', email: '', college: '', branch: '', gradYear: '', referralCode: '' }) }}>
                  Register another seat <ArrowUpRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar: Workshop Pass Information */}
          <aside style={{ background: '#0b1020', color: '#fff', borderRadius: 24, padding: 'clamp(24px, 3vw, 32px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(199,255,94,.08)', right: -60, top: -60, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: '#c7ff5e', fontWeight: 800 }}>WORKSHOP DETAILS</span>
              <span style={{ fontSize: 11, background: 'rgba(255,255,255,.1)', padding: '3px 8px', borderRadius: 99 }}>Live Online</span>
            </div>

            <h3 style={{ fontSize: 20, letterSpacing: '-.03em', margin: '0 0 16px', color: '#fff' }}>
              Build Your First AI Project in 60 Minutes
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.1)', paddingBottom: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Calendar size={16} style={{ color: '#c7ff5e' }} />
                <span><strong>Date:</strong> This Saturday</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={16} style={{ color: '#c7ff5e' }} />
                <span><strong>Time:</strong> 7:00 PM – 8:00 PM IST</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Laptop size={16} style={{ color: '#c7ff5e' }} />
                <span><strong>Mode:</strong> Interactive Online Coding Lab</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap size={16} style={{ color: '#c7ff5e' }} />
                <span><strong>Fee:</strong> 100% Free Pass</span>
              </div>
              <AddToCalendarButton variant="navbar" style={{ marginTop: 6, width: '100%', justifyContent: 'center' }} />
            </div>

            <div style={{ fontSize: 12, color: '#9fb1d4', lineHeight: 1.6 }}>
              <strong style={{ color: '#fff', display: 'block', marginBottom: 8 }}>Included in Your Free Seat:</strong>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Check size={14} style={{ color: '#c7ff5e' }} /> <span>Step-by-step live code guidance</span></li>
                <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Check size={14} style={{ color: '#c7ff5e' }} /> <span>Deploy your app to a live public URL</span></li>
                <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Check size={14} style={{ color: '#c7ff5e' }} /> <span>Official NxtWave Completion Certificate</span></li>
                <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Check size={14} style={{ color: '#c7ff5e' }} /> <span>Full GitHub repository and starter assets</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
