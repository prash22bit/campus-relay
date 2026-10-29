import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Calendar,
  Clock,
  Laptop,
  GraduationCap,
  Sparkles,
  Zap,
  CheckCircle2,
  Check,
  ArrowUpRight,
  ArrowDown,
  Ticket,
  Gift,
  ShieldCheck,
  Code2,
  FileText,
  MessageSquare,
  Plus,
  Minus,
  X,
  Copy,
  Share2,
} from 'lucide-react'
import { registerStudent, validateCode } from '../api/client'
import AddToCalendarButton from '../components/AddToCalendarButton'

const BRANCHES = ['CSE', 'IT', 'AI & Data Science', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other']
const YEARS = ['2025', '2026', '2027', '2028', 'Other']

const agenda = [
  { time: '00 - 10 min', title: 'The GenAI Landscape', desc: 'Demystifying LLMs, APIs, and token limits. How modern AI apps differ from traditional software.' },
  { time: '10 - 25 min', title: 'Prompt & System Design', desc: 'Crafting production-grade system prompts, context injection, and structured JSON output formats.' },
  { time: '25 - 45 min', title: 'Hands-On Live Coding', desc: 'Live coding the AI Document & Resume Reviewer from scratch with real-time streaming responses.' },
  { time: '45 - 55 min', title: '1-Click Cloud Deployment', desc: 'Deploying the app to a live public URL so recruiters and peers can interact with your project.' },
  { time: '55 - 60 min', title: 'Resume Positioning & Q&A', desc: 'How to describe this project in technical interviews, live Q&A, and claiming your certificate.' },
]

const faqs = [
  { q: 'Is this workshop really 100% free?', a: 'Yes. There are zero hidden fees. NxtWave provides free access to the live session, starter code, and verified completion certificate for college students.' },
  { q: 'Do I need prior Machine Learning or AI experience?', a: 'None at all. If you know basic programming fundamentals (variables, functions, basic JavaScript or Python), you will easily follow along and build the project.' },
  { q: 'What do I need to attend the workshop?', a: 'Just your laptop, an active internet connection, and a web browser. All coding is done via an interactive cloud sandbox, so no heavy local installations are required.' },
  { q: 'Will I get an official certificate?', a: 'Yes. All students who attend the live session and build along receive an official, verifiable Certificate of Participation from NxtWave.' },
  { q: 'Can I add this project to my resume?', a: 'Absolutely. That is the exact goal of this masterclass. You will finish with a working, deployed URL and GitHub repository to showcase in technical interviews.' },
]

export default function Home() {
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
  const [activeFaq, setActiveFaq] = useState(null)

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
    if (Object.keys(errs).length) {
      setErrors(errs)
      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
      return
    }

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
      toast.success('Your seat is confirmed!')
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

  const scrollToRegister = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home-page">
      {/* Top Urgency Banner */}
      <div className="urgency-banner">
        <div className="urgency-banner-left">
          <span className="live-pill">
            <span className="live-dot" style={{ width: 6, height: 6 }} /> LIVE MASTERCLASS
          </span>
          <span className="urgency-item"><Calendar size={13} /> This Saturday · 7:00 PM IST</span>
          <span className="urgency-item desktop-only"><Clock size={13} /> 60 Mins Practical</span>
          <span className="urgency-item desktop-only"><Zap size={13} /> Free Pass</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AddToCalendarButton variant="navbar" label="Add to Calendar" style={{ height: 28, fontSize: 11, padding: '3px 10px', background: 'rgba(255,255,255,0.1)' }} />
          <button onClick={scrollToRegister} className="urgency-cta-btn">
            Claim Seat <ArrowUpRight size={12} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero" id="about">
        <div className="hero-copy animate-fade-up">
          <div className="eyebrow">
            <Sparkles size={13} /> FREE CERTIFIED LIVE MASTERCLASS
          </div>
          <h1>
            Build & Deploy Your First Real <em>AI Project</em> in 60 Minutes.
          </h1>
          <p className="hero-sub" style={{ fontSize: 17, lineHeight: 1.7, color: '#b8c5de', maxWidth: 640 }}>
            Tired of surface-level AI theory? Join this guided, beginner-friendly live session to code an interactive AI application from scratch, deploy it to the cloud, and walk away with a real project for your resume.
          </p>

          <div className="hero-cta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28, alignItems: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={scrollToRegister}>
              Claim Your Free Seat Now <ArrowUpRight size={16} />
            </button>
            <AddToCalendarButton variant="navbar" style={{ height: 50, padding: '0 18px', fontSize: 14 }} />
            <button className="btn btn-ghost btn-lg" onClick={() => document.getElementById('project')?.scrollIntoView({ behavior: 'smooth' })}>
              See What You'll Build <ArrowDown size={16} />
            </button>
          </div>

          {/* Quick Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginTop: 32 }}>
            <div className="stat-box">
              <Clock size={18} style={{ color: '#c7ff5e', marginBottom: 4 }} />
              <strong>60 Mins</strong><span>Live Hands-on</span>
            </div>
            <div className="stat-box">
              <Zap size={18} style={{ color: '#c7ff5e', marginBottom: 4 }} />
              <strong>Free Pass</strong><span>100% Free For Students</span>
            </div>
            <div className="stat-box">
              <Laptop size={18} style={{ color: '#c7ff5e', marginBottom: 4 }} />
              <strong>Live Lab</strong><span>In-Browser Sandbox</span>
            </div>
            <div className="stat-box">
              <GraduationCap size={18} style={{ color: '#c7ff5e', marginBottom: 4 }} />
              <strong>Certificate</strong><span>Verified by NxtWave</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Project Card */}
        <div className="hero-art animate-fade-in" aria-label="Project Preview">
          <div className="art-orb" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#c7ff5e', textTransform: 'uppercase', letterSpacing: '.14em', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="live-dot" style={{ width: 6, height: 6 }} /> LIVE LAB PREVIEW
            </span>
            <span style={{ fontSize: 11, color: '#8899b8', background: 'rgba(255,255,255,.08)', padding: '3px 8px', borderRadius: 6 }}>
              Zero ML Experience Required
            </span>
          </div>

          <div className="code-card">
            <div className="code-dots"><i /><i /><i /></div>
            <div><span className="code-ln">01</span>&nbsp;<span className="c-blue">import</span> &#123; createAIApp &#125; <span className="c-blue">from</span> <span className="c-green">'@nxtwave/ai'</span>;</div>
            <div><span className="code-ln">02</span>&nbsp;<span className="c-blue">const</span> reviewer = <span className="c-coral">createAIApp</span>(&#123;</div>
            <div><span className="code-ln">03</span>&nbsp;&nbsp;&nbsp;model: <span className="c-green">"gpt-4o-mini"</span>,</div>
            <div><span className="code-ln">04</span>&nbsp;&nbsp;&nbsp;task: <span className="c-green">"smart-resume-and-code-audit"</span></div>
            <div><span className="code-ln">05</span>&nbsp;&#125;);</div>
            <div><span className="code-ln">06</span>&nbsp;<span className="c-blue">await</span> reviewer.<span className="c-coral">deployToLiveUrl</span>();</div>
          </div>

          <div className="mini-result" style={{ marginTop: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} style={{ color: '#c7ff5e' }} /> Output
            </span>
            <strong>Live Deployed AI Project URL</strong>
          </div>

          <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, color: '#c7d2ea', fontSize: 12, position: 'relative', zIndex: 1 }}>
            <div style={{ fontWeight: 800, color: '#fff', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Code2 size={15} style={{ color: '#c7ff5e' }} />
              <span>What You Walk Away With:</span>
            </div>
            <div style={{ lineHeight: 1.6, color: '#97a6c5' }}>
              A working AI web application deployed on your personal link + GitHub source code + Official NxtWave Certificate for your LinkedIn profile.
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="section" id="register" style={{ background: '#f0f3fa', borderTop: '1px solid #dfe5f2', borderBottom: '1px solid #dfe5f2' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div className="section-head" style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 36px' }}>
            <div className="kicker" style={{ color: '#174092' }}>RESERVE YOUR SPOT</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Claim Your Free Workshop Pass</h2>
            <p className="section-intro" style={{ margin: '12px auto 0' }}>
              Seats are limited to ensure interactive lab performance. Fill in your details below to instantly secure your seat and receive your access link.
            </p>
          </div>

          <div className="workspace" style={{ gridTemplateColumns: 'minmax(0, 1.25fr) minmax(320px, 0.75fr)', gap: 24, alignItems: 'start' }}>
            {/* Form Card */}
            <div className="card" style={{ background: '#fff', borderRadius: 24, padding: 'clamp(24px, 4vw, 36px)', boxShadow: '0 16px 45px rgba(11,16,32,.07)' }}>
              {!result ? (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 20, letterSpacing: '-.03em' }}>Student Registration</h3>
                    <span className="pill pill-lime" style={{ background: '#f2fae3', color: '#385718', border: '1px solid #d4eb9d' }}>100% Free</span>
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
                      <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" maxLength={80} autoComplete="name" />
                      {errors.name && <span className="err-msg">{errors.name}</span>}
                    </div>

                    <div className={`field full ${errors.email ? 'error' : ''}`}>
                      <label htmlFor="email">College Email Address *</label>
                      <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. rahul@college.edu or personal email" maxLength={120} autoComplete="email" />
                      {errors.email && <span className="err-msg">{errors.email}</span>}
                    </div>

                    <div className={`field ${errors.college ? 'error' : ''}`}>
                      <label htmlFor="college">College / Institute *</label>
                      <input id="college" name="college" value={form.college} onChange={handleChange} placeholder="e.g. CBIT Hyderabad, VNR VJIET" maxLength={100} />
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
                        Referral / Invite Code (optional)
                        {codeStatus === 'checking' && <span style={{ color: '#64748b', fontSize: 11, marginLeft: 6 }}>validating…</span>}
                        {codeStatus === 'valid' && <span style={{ color: '#16a34a', fontSize: 11, marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Check size={12} /> Valid code</span>}
                        {codeStatus === 'invalid' && <span style={{ color: '#dc2626', fontSize: 11, marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 3 }}><X size={12} /> Code not found</span>}
                      </label>
                      <input id="referralCode" name="referralCode" value={form.referralCode} onChange={handleChange} placeholder="e.g. CC-CBIT01 or CR-XXXXX" style={{ textTransform: 'uppercase' }} maxLength={20} />
                      <span className="hint">Received from a friend or Campus Captain</span>
                    </div>
                  </div>

                  <button className="btn btn-dark btn-full" style={{ marginTop: 22, height: 48, fontSize: 15 }} type="submit" disabled={loading}>
                    {loading ? <><span className="spinner" /> Reserving Seat…</> : <>Reserve My Free Seat <ArrowUpRight size={16} /></>}
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
                /* Confirmed State */
                <div className="success-box animate-fade-in" style={{ padding: 24, borderRadius: 18, background: '#f2fae3', border: '1px solid #cce89d' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#2d5a15', marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#d6eda8', display: 'grid', placeItems: 'center', color: '#2d5a15' }}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 20 }}>Seat Confirmed, {result.name}!</h4>
                      <p style={{ margin: 0, fontSize: 13, color: '#4a6b2a' }}>Your workshop registration is verified.</p>
                    </div>
                  </div>

                  <div style={{ background: '#fff', borderRadius: 14, padding: 18, margin: '16px 0', border: '1px solid #d3e7b3' }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: '#5b7e33', fontWeight: 800 }}>
                      Your Unique Workshop Pass ID
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: '#101426', letterSpacing: '.08em', margin: '6px 0' }}>
                      {result.personalCode}
                    </div>
                    <div style={{ fontSize: 12, color: '#687754' }}>
                      Save this pass ID. We will also use this to issue your completion certificate.
                    </div>
                  </div>

                  {/* Student Viral Loop Incentive */}
                  <div style={{ background: '#fff', borderRadius: 14, padding: 18, margin: '16px 0', border: '2px dashed #9bc56b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#254b11', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                      <Gift size={18} style={{ color: '#254b11' }} />
                      <span>Invite 2 Classmates & Unlock Bonus AI Toolkit</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#4d6935', lineHeight: 1.5, margin: '0 0 12px' }}>
                      Share your personal invite link with friends from your department. When 2 classmates register, you will unlock the exclusive <strong>AI Prompt Engineering Toolkit & Complete GitHub Repository</strong>!
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
                    Register another classmate <ArrowUpRight size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Event Pass Details */}
            <aside style={{ background: '#0b1020', color: '#fff', borderRadius: 24, padding: 'clamp(24px, 3vw, 32px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(199,255,94,.08)', right: -60, top: -60, pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: '#c7ff5e', fontWeight: 800 }}>WORKSHOP BRIEF</span>
                <span style={{ fontSize: 11, background: 'rgba(255,255,255,.1)', padding: '3px 8px', borderRadius: 99 }}>Online Live</span>
              </div>

              <h3 style={{ fontSize: 22, letterSpacing: '-.03em', margin: '0 0 16px', color: '#fff' }}>
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
                  <span><strong>Platform:</strong> Interactive Online Lab</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Zap size={16} style={{ color: '#c7ff5e' }} />
                  <span><strong>Fee:</strong> Free for College Students</span>
                </div>
                <AddToCalendarButton variant="navbar" style={{ marginTop: 6, width: '100%', justifyContent: 'center' }} />
              </div>

              <div style={{ fontSize: 12, color: '#9fb1d4', lineHeight: 1.6 }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: 8 }}>Included in Your Pass:</strong>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Check size={14} style={{ color: '#c7ff5e' }} /> <span>Full 60-min live code-along guidance</span></li>
                  <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Check size={14} style={{ color: '#c7ff5e' }} /> <span>Deploy your project to a public live link</span></li>
                  <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Check size={14} style={{ color: '#c7ff5e' }} /> <span>Verifiable NxtWave Certificate</span></li>
                  <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Check size={14} style={{ color: '#c7ff5e' }} /> <span>Complete GitHub repo boilerplate</span></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Section: What You Will Build */}
      <section className="section" id="project">
        <div className="section-head">
          <div>
            <div className="kicker">THE LIVE PROJECT</div>
            <h2>Build a Working AI App.<br />Not Just Another Theory Class.</h2>
          </div>
          <p className="section-intro">
            You will write real code, configure an AI model, and deploy a live web application that analyzes documents and generates structured suggestions.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature">
            <div className="feature-num">01</div>
            <h3>Connect to Generative AI APIs</h3>
            <p>Learn how to connect to state-of-the-art LLMs, configure secure API keys, and handle request streaming in a web app.</p>
          </article>

          <article className="feature">
            <div className="feature-num">02</div>
            <h3>Prompt Engineering with Context</h3>
            <p>Write bulletproof system prompts and inject dynamic user context to make the AI produce structured, reliable outputs.</p>
          </article>

          <article className="feature">
            <div className="feature-num">03</div>
            <h3>Deploy to a Live Shareable URL</h3>
            <p>Turn your local code into a live website you can link on your resume, LinkedIn profile, and show recruiters in interviews.</p>
          </article>
        </div>
      </section>

      {/* Section: 60-Minute Masterclass Agenda */}
      <section className="section" id="curriculum" style={{ background: '#f5f7fc', borderTop: '1px solid #e1e7f1' }}>
        <div className="section-head">
          <div>
            <div className="kicker">MINUTE-BY-MINUTE BREAKDOWN</div>
            <h2>The 60-Minute Masterclass Agenda</h2>
          </div>
          <p className="section-intro">
            Structured for maximum learning velocity. Every 15 minutes unlocks a tangible milestone.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 12, maxWidth: 840, margin: '0 auto' }}>
          {agenda.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 20, background: '#fff', padding: '18px 24px', borderRadius: 16, border: '1px solid #e2e8f4', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#174092', background: '#eef3ff', padding: '6px 10px', borderRadius: 8, textAlign: 'center' }}>
                {item.time}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: 16 }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: 13, color: '#6b768e', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Perks & Certificate */}
      <section className="section" id="perks">
        <div className="section-head">
          <div>
            <div className="kicker">STUDENT TAKEAWAYS</div>
            <h2>Everything You Get for Attending</h2>
          </div>
          <p className="section-intro">
            We provide all the tools, templates, and credentials so you have lasting value beyond the 60 minutes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <div className="card" style={{ padding: 24, borderRadius: 20, border: '1px solid #e0e6f2' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eef3ff', display: 'grid', placeItems: 'center', color: '#174092', marginBottom: 16 }}>
              <GraduationCap size={22} />
            </div>
            <h3 style={{ fontSize: 18, margin: '0 0 8px' }}>Official NxtWave Certificate</h3>
            <p style={{ fontSize: 13, color: '#68748d', lineHeight: 1.6, margin: 0 }}>
              Receive an official Certificate of Participation from NxtWave to verify your hands-on AI competence on LinkedIn.
            </p>
          </div>

          <div className="card" style={{ padding: 24, borderRadius: 20, border: '1px solid #e0e6f2' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f2fae3', display: 'grid', placeItems: 'center', color: '#385718', marginBottom: 16 }}>
              <Laptop size={22} />
            </div>
            <h3 style={{ fontSize: 18, margin: '0 0 8px' }}>Complete GitHub Starter Repo</h3>
            <p style={{ fontSize: 13, color: '#68748d', lineHeight: 1.6, margin: 0 }}>
              Full source code, boilerplate, and step-by-step instructions so you can continue building and extending the project.
            </p>
          </div>

          <div className="card" style={{ padding: 24, borderRadius: 20, border: '1px solid #e0e6f2' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3e9', display: 'grid', placeItems: 'center', color: '#b45309', marginBottom: 16 }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: 18, margin: '0 0 8px' }}>Resume & Interview Points</h3>
            <p style={{ fontSize: 13, color: '#68748d', lineHeight: 1.6, margin: 0 }}>
              Bulletproof phrasing and technical talking points on how to explain your AI project in upcoming campus placement interviews.
            </p>
          </div>

          <div className="card" style={{ padding: 24, borderRadius: 20, border: '1px solid #e0e6f2' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f0ff', display: 'grid', placeItems: 'center', color: '#7c3aed', marginBottom: 16 }}>
              <MessageSquare size={22} />
            </div>
            <h3 style={{ fontSize: 18, margin: '0 0 8px' }}>Live Doubt Solving</h3>
            <p style={{ fontSize: 13, color: '#68748d', lineHeight: 1.6, margin: 0 }}>
              Ask questions live to senior engineers and get real-time feedback on your code and career roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Section: FAQs */}
      <section className="section" id="faqs" style={{ background: '#f5f7fc', borderTop: '1px solid #e1e7f1' }}>
        <div className="section-head" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}>
          <div className="kicker">HAVE QUESTIONS?</div>
          <h2>Frequently Asked Questions</h2>
          <p className="section-intro" style={{ margin: '8px auto 0' }}>
            Everything you need to know about the masterclass.
          </p>
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0e7f3', overflow: 'hidden' }}>
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', fontWeight: 800, fontSize: 15, color: '#101426', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <span>{f.q}</span>
                <span style={{ color: '#6b7a99' }}>
                  {activeFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              {activeFaq === i && (
                <div style={{ padding: '0 20px 20px', fontSize: 14, color: '#5f6c86', lineHeight: 1.6, borderTop: '1px solid #f1f4fa' }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Strip */}
      <section style={{ background: '#0b1020', color: '#fff', padding: '56px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: '#c7ff5e', fontWeight: 800, display: 'inline-block', marginBottom: 12 }}>
            LIMITED LIVE SEATS REMAINING
          </span>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', letterSpacing: '-.04em', margin: '0 0 16px', color: '#fff' }}>
            Don't Just Watch AI Happen.<br /><span style={{ color: '#c7ff5e' }}>Build It Yourself.</span>
          </h2>
          <p style={{ fontSize: 16, color: '#a9b7d3', lineHeight: 1.7, margin: '0 auto 28px', maxWidth: 540 }}>
            Join hundreds of engineering students this Saturday. Zero fees, 60 minutes of live coding, and a real project on your resume.
          </p>
          <button className="btn btn-primary btn-lg" onClick={scrollToRegister}>
            Claim Your Free Seat Now <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      {/* Native Mobile Sticky Bottom Action Bar */}
      <div className="mobile-sticky-bar">
        {!result ? (
          <div className="mobile-sticky-inner">
            <div className="mobile-sticky-info">
              <span className="mobile-sticky-tag">100% Free Pass</span>
              <strong className="mobile-sticky-title">This Sat · 7:00 PM</strong>
            </div>
            <button className="btn btn-primary mobile-sticky-btn" onClick={scrollToRegister}>
              Claim Seat <ArrowUpRight size={15} />
            </button>
          </div>
        ) : (
          <div className="mobile-sticky-inner">
            <div className="mobile-sticky-info">
              <span className="mobile-sticky-tag" style={{ color: '#c7ff5e' }}>Pass Confirmed</span>
              <strong className="mobile-sticky-title">{result.personalCode}</strong>
            </div>
            <button className="btn mobile-sticky-btn" onClick={shareWA} style={{ background: '#25D366', color: '#fff' }}>
              <Share2 size={15} /> WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
