import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import {
  fetchDashboard, fetchRegistrations, fetchCaptains,
  addCaptain, deactivateCaptain, exportCSV as apiExportCSV,
} from '../api/client'
import {
  BarChart3,
  ClipboardList,
  Users,
  Target,
  Download,
  RefreshCw,
  ExternalLink,
  LogOut,
  Plus,
  X,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'
import Plan from './Plan'

/* ── Small sidebar link ─────────────────────────────────────── */
function SidebarLink({ icon, label, active, onClick }) {
  return (
    <button className={`sidebar-link ${active ? 'active' : ''}`} onClick={onClick}>
      <span>{icon}</span>
      {label}
    </button>
  )
}

/* ── Source badge ───────────────────────────────────────────── */
const SRC_MAP = {
  'direct':          { label: 'Direct',         cls: 'src-direct' },
  'peer-referral':   { label: 'Peer referral',  cls: 'src-peer-referral' },
  'campus-captain':  { label: 'Captain',        cls: 'src-campus-captain' },
  'club-community':  { label: 'Club',           cls: 'src-club-community' },
  'social-outreach': { label: 'Social',         cls: 'src-social' },
}

/* ── Tooltip for charts ─────────────────────────────────────── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#111a2e', color: '#fff', padding: '10px 14px', borderRadius: 10, fontSize: 12, border: '1px solid rgba(255,255,255,.1)' }}>
      <div style={{ fontWeight: 800, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

const PIE_COLORS = ['#c7ff5e', '#8bb7ff', '#ff917e', '#b89fff', '#5ce1e6']

/* ════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [view, setView]   = useState('overview')   // overview | registrations | captains
  const [dash, setDash]   = useState(null)
  const [dashLoading, setDashLoading] = useState(true)

  /* Registrations tab state */
  const [regs, setRegs]       = useState([])
  const [regTotal, setRegTotal] = useState(0)
  const [regPage, setRegPage]   = useState(1)
  const [regPages, setRegPages] = useState(1)
  const [regLoading, setRegLoading] = useState(false)
  const [search, setSearch]     = useState('')
  const [srcFilter, setSrcFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState('')

  /* Captains tab state */
  const [captains, setCaptains] = useState([])
  const [capLoading, setCapLoading] = useState(false)
  const [addForm, setAddForm]   = useState({ name:'', email:'', college:'', whatsapp:'', target:'10', notes:'' })
  const [addLoading, setAddLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  /* ── Fetch dashboard ──────────────────────────────────────── */
  const loadDashboard = useCallback(async () => {
    setDashLoading(true)
    try {
      const { data } = await fetchDashboard()
      setDash(data.data)
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/admin/login') }
      else toast.error('Failed to load dashboard')
    } finally {
      setDashLoading(false)
    }
  }, [logout, navigate])

  /* ── Fetch registrations ─────────────────────────────────── */
  const loadRegistrations = useCallback(async (page = 1) => {
    setRegLoading(true)
    try {
      const { data } = await fetchRegistrations({ page, limit: 25, source: srcFilter, branch: branchFilter, search })
      setRegs(data.data.registrations)
      setRegTotal(data.data.total)
      setRegPage(data.data.page)
      setRegPages(data.data.pages)
    } catch {
      toast.error('Failed to load registrations')
    } finally {
      setRegLoading(false)
    }
  }, [srcFilter, branchFilter, search])

  /* ── Fetch captains ──────────────────────────────────────── */
  const loadCaptains = useCallback(async () => {
    setCapLoading(true)
    try {
      const { data } = await fetchCaptains()
      setCaptains(data.data)
    } catch {
      toast.error('Failed to load captains')
    } finally {
      setCapLoading(false)
    }
  }, [])

  useEffect(() => { loadDashboard() }, [loadDashboard])
  useEffect(() => {
    if (view === 'registrations') loadRegistrations(1)
    if (view === 'captains')      loadCaptains()
  }, [view, loadRegistrations, loadCaptains])

  /* ── CSV export ──────────────────────────────────────────── */
  const handleExport = async () => {
    try {
      const res = await apiExportCSV()
      const url = URL.createObjectURL(new Blob([res.data]))
      const a   = document.createElement('a')
      a.href = url; a.download = 'campus-relay-registrations.csv'; a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV exported!')
    } catch { toast.error('Export failed') }
  }

  /* ── Add captain ─────────────────────────────────────────── */
  const handleAddCaptain = async (e) => {
    e.preventDefault()
    if (!addForm.name || !addForm.email || !addForm.college) {
      toast.error('Name, email and college are required'); return
    }
    setAddLoading(true)
    try {
      await addCaptain(addForm)
      toast.success('Captain added!')
      setAddForm({ name:'', email:'', college:'', whatsapp:'', target:'10', notes:'' })
      setShowAddForm(false)
      loadCaptains()
      loadDashboard()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add captain')
    } finally {
      setAddLoading(false)
    }
  }

  const handleDeactivate = async (id, name) => {
    if (!confirm(`Deactivate captain ${name}?`)) return
    try {
      await deactivateCaptain(id)
      toast.success('Captain deactivated')
      loadCaptains()
    } catch { toast.error('Failed') }
  }

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="admin-layout">
      {/* Mobile Admin Header & Segmented Tab Navigation */}
      <div className="admin-mobile-header">
        <div className="admin-mobile-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/nxtwave_white_logo.svg" alt="NxtWave Logo" style={{ height: 22, width: 'auto' }} />
            <span style={{ fontSize: 10, background: 'rgba(199,255,94,0.15)', color: '#c7ff5e', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>GROWTH HUB</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={loadDashboard} className="admin-mobile-icon-btn" aria-label="Refresh" title="Refresh">
              <RefreshCw size={15} />
            </button>
            <button onClick={handleExport} className="admin-mobile-icon-btn" aria-label="Export CSV" title="Export CSV">
              <Download size={15} />
            </button>
            <button onClick={() => { logout(); navigate('/') }} className="admin-mobile-icon-btn" aria-label="Logout" title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Segmented Tab Control */}
        <div className="admin-mobile-tabs">
          <button className={`admin-mobile-tab ${view==='overview' ? 'active' : ''}`} onClick={() => setView('overview')}>
            <BarChart3 size={14} /> Overview
          </button>
          <button className={`admin-mobile-tab ${view==='registrations' ? 'active' : ''}`} onClick={() => setView('registrations')}>
            <ClipboardList size={14} /> Regs ({dash?.totalRegistrations || 0})
          </button>
          <button className={`admin-mobile-tab ${view==='captains' ? 'active' : ''}`} onClick={() => setView('captains')}>
            <Users size={14} /> Captains
          </button>
          <button className={`admin-mobile-tab ${view==='plan' ? 'active' : ''}`} onClick={() => setView('plan')}>
            <Target size={14} /> Strategy
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, paddingBottom: 16 }}>
          <img src="/nxtwave_white_logo.svg" alt="NxtWave Logo" style={{ height: 24, width: 'auto' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="brandmark" style={{ width: 20, height: 20, fontSize: 11 }}>CR</div>
            <span style={{ fontSize: 13, fontWeight: 800 }}>Campus Relay</span>
          </div>
        </div>

        <div className="sidebar-section">Main</div>
        <SidebarLink icon={<BarChart3 size={16} />} label="Overview"      active={view==='overview'}       onClick={() => setView('overview')} />
        <SidebarLink icon={<ClipboardList size={16} />} label="Registrations" active={view==='registrations'}  onClick={() => setView('registrations')} />
        <SidebarLink icon={<Users size={16} />} label="Captains"      active={view==='captains'}       onClick={() => setView('captains')} />
        <SidebarLink icon={<Target size={16} />} label="Growth Strategy & Budget" active={view==='plan'} onClick={() => setView('plan')} />

        <div className="sidebar-section" style={{ marginTop: 12 }}>Actions</div>
        <SidebarLink icon={<Download size={16} />} label="Export CSV"    active={false} onClick={handleExport} />
        <SidebarLink icon={<RefreshCw size={16} />} label="Refresh"       active={false} onClick={loadDashboard} />
        <SidebarLink icon={<ExternalLink size={16} />} label="View Student Site" active={false} onClick={() => window.open('/', '_blank')} />

        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <div style={{ fontSize: 11, color: '#3d4a65', marginBottom: 8 }}>
            Logged in as <strong style={{ color: '#596a8a' }}>{admin?.username}</strong>
          </div>
          <button className="sidebar-link" onClick={() => { logout(); navigate('/') }}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* ── Overview ──────────────────────────────────── */}
        {view === 'overview' && (
          <>
            <div className="admin-topbar">
              <h1>Growth Dashboard</h1>
              <div className="admin-topbar-actions">
                <button className="btn btn-outline-dark btn-sm" onClick={loadDashboard} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <RefreshCw size={14} /> Refresh
                </button>
                <button className="btn btn-dark btn-sm" onClick={handleExport} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            {dashLoading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#8b97b5' }}>
                <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, margin: '0 auto 12px' }} />
                Loading dashboard…
              </div>
            ) : dash ? (
              <>
                {/* KPI strip */}
                <div className="kpi-grid">
                  <div className="kpi-card highlight">
                    <div className="kpi-label">Total registrations</div>
                    <div className="kpi-value" style={{ color: 'var(--lime)' }}>{dash.totalRegistrations}</div>
                    <div className="kpi-sub">{dash.progressPct}% of 500 goal</div>
                    <div style={{ marginTop: 12 }}>
                      <div className="progress-track dark">
                        <div className="progress-fill" style={{ width: `${dash.progressPct}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-label">Colleges represented</div>
                    <div className="kpi-value">{dash.collegesCount}</div>
                    <div className="kpi-sub">Unique institutions</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-label">Peer referrals</div>
                    <div className="kpi-value">{dash.referralCount}</div>
                    <div className="kpi-sub">Via CR- codes</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-label">Active captains</div>
                    <div className="kpi-value">{dash.activeCaptains}</div>
                    <div className="kpi-sub">of 25 target</div>
                  </div>
                </div>

                {/* Charts row */}
                <div className="admin-charts-grid">
                  {/* Daily registrations bar chart */}
                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Registrations — last 7 days</h3>
                    {dash.dailyRegistrations?.length ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={dash.dailyRegistrations} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <XAxis dataKey="_id" tick={{ fontSize: 10, fill: '#8b97b5' }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: '#8b97b5' }} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip content={<ChartTip />} />
                          <Bar dataKey="count" name="Registrations" fill="#c7ff5e" radius={[6,6,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b97b5', fontSize: 13 }}>
                        No registrations yet — use the register page to add some test entries.
                      </div>
                    )}
                  </div>

                  {/* Source breakdown pie chart */}
                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Source breakdown</h3>
                    {dash.bySource?.length ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={dash.bySource} dataKey="count" nameKey="_id" outerRadius={65} innerRadius={35} paddingAngle={3}>
                            {dash.bySource.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#111a2e', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, fontSize: 11 }} />
                          <Legend formatter={(v) => SRC_MAP[v]?.label || v} wrapperStyle={{ fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b97b5', fontSize: 13 }}>
                        No data yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom row */}
                <div className="admin-breakdown-grid">
                  {/* Branch breakdown */}
                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>By branch</h3>
                    {dash.byBranch?.length ? dash.byBranch.slice(0,6).map((b) => (
                      <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, width: 110, flexShrink: 0 }}>{b._id}</div>
                        <div style={{ flex: 1, height: 6, background: '#eef1f8', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ width: `${(b.count / dash.totalRegistrations) * 100}%`, height: '100%', background: 'var(--blue)', borderRadius: 99 }} />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, width: 28, textAlign: 'right' }}>{b.count}</div>
                      </div>
                    )) : <div style={{ color: '#8b97b5', fontSize: 13 }}>No data yet</div>}
                  </div>

                  {/* Top captains */}
                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Top campus captains</h3>
                    {dash.topCaptains?.length ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {dash.topCaptains.slice(0,5).map((c, i) => (
                          <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 22, height: 22, borderRadius: 7, background: '#eef3ff', color: '#4a5c8a', fontWeight: 900, fontSize: 11, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{i+1}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                              <div style={{ fontSize: 10, color: '#8b97b5' }}>{c.captainCode} · {c.college}</div>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--navy)', flexShrink: 0 }}>{c.registrationCount}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#8b97b5', fontSize: 13 }}>
                        No captains yet.{' '}
                        <button style={{ color: 'var(--navy)', fontWeight: 700, fontSize: 12, cursor: 'pointer', background: 'none', border: 'none', padding: 0, textDecoration: 'underline' }}
                          onClick={() => setView('captains')}>Add captains →</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Channel target mix */}
                <div className="card" style={{ marginTop: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Channel target mix (planning model)</h3>
                  <div className="admin-target-mix-grid">
                    {dash.targetChannelMix?.map((ch) => (
                      <div key={ch.channel} style={{ padding: '14px 16px', background: '#f8f9fd', borderRadius: 14, border: '1px solid var(--line)' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#5a6a8a', marginBottom: 6, lineHeight: 1.4 }}>{ch.channel}</div>
                        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-.05em', marginBottom: 8 }}>{ch.target}</div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${ch.pct}%`, background: 'var(--navy)' }} />
                        </div>
                        <div style={{ fontSize: 10, color: '#8b97b5', marginTop: 5 }}>{ch.pct}% of total</div>
                      </div>
                    ))}
                  </div>
                  <div className="notice" style={{ marginTop: 14 }}>
                    Target budget cost per registration: <strong>₹{dash.budgetCostPerReg}</strong>
                    {dash.totalRegistrations > 0
                      ? ` (based on ₹2,000 ÷ ${dash.totalRegistrations} actual registrations)`
                      : ' (₹2,000 ÷ 500 target = ₹4.00 planning assumption)'}
                  </div>
                </div>

                {/* Recent registrations mini table */}
                <div className="data-table-wrap" style={{ marginTop: 16 }}>
                  <div className="data-table-head">
                    <h3>Recent registrations</h3>
                    <button className="btn btn-outline-dark btn-sm" onClick={() => setView('registrations')}>View all →</button>
                  </div>
                  <table className="data-table">
                    <thead><tr><th>Name</th><th>College</th><th>Branch</th><th>Source</th><th>Registered</th></tr></thead>
                    <tbody>
                      {dash.recentRegistrations?.length ? dash.recentRegistrations.map((r) => {
                        const src = SRC_MAP[r.source] || { label: r.source, cls: 'src-direct' }
                        return (
                          <tr key={r._id}>
                            <td style={{ fontWeight: 700 }}>{r.name}</td>
                            <td style={{ fontSize: 12, color: '#667087' }}>{r.college}</td>
                            <td style={{ fontSize: 12 }}>{r.branch}</td>
                            <td><span className={`source-badge ${src.cls}`}>{src.label}</span></td>
                            <td style={{ fontSize: 11, color: '#8b97b5' }}>{new Date(r.createdAt).toLocaleString()}</td>
                          </tr>
                        )
                      }) : (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#8b97b5' }}>No registrations yet. Try the register page!</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </>
        )}

        {/* ── Registrations tab ─────────────────────────── */}
        {view === 'registrations' && (
          <>
            <div className="admin-topbar">
              <h1>All Registrations <span style={{ fontSize: 16, color: '#8b97b5', fontWeight: 600 }}>({regTotal})</span></h1>
              <button className="btn btn-dark btn-sm" onClick={handleExport}>Export CSV ↓</button>
            </div>

            {/* Filter bar */}
            <div className="filter-bar admin-filter-bar" style={{ marginBottom: 16 }}>
              <input className="search-input" placeholder="Search name, email, college…"
                value={search} onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadRegistrations(1)} />
              <select className="filter-select" value={srcFilter} onChange={(e) => { setSrcFilter(e.target.value); }}>
                <option value="">All sources</option>
                {Object.entries(SRC_MAP).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select className="filter-select" value={branchFilter} onChange={(e) => { setBranchFilter(e.target.value); }}>
                <option value="">All branches</option>
                {['CSE','IT','AI & Data Science','ECE','EEE','Mechanical','Civil','Other'].map((b) => <option key={b}>{b}</option>)}
              </select>
              <button className="btn btn-dark btn-sm" onClick={() => loadRegistrations(1)}>Search</button>
              <button className="btn btn-outline-dark btn-sm" onClick={() => { setSearch(''); setSrcFilter(''); setBranchFilter(''); }}>Clear</button>
            </div>

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Email</th><th>College</th><th>Branch</th>
                    <th>Grad</th><th>Source</th><th>Code</th><th>Referrals</th><th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {regLoading ? (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#8b97b5' }}>
                      <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                    </td></tr>
                  ) : regs.length ? regs.map((r, i) => {
                    const src = SRC_MAP[r.source] || { label: r.source, cls: 'src-direct' }
                    return (
                      <tr key={r._id}>
                        <td style={{ color: '#8b97b5', fontSize: 11 }}>{(regPage - 1) * 25 + i + 1}</td>
                        <td style={{ fontWeight: 700 }}>{r.name}</td>
                        <td style={{ fontSize: 11, color: '#667087' }}>{r.email}</td>
                        <td style={{ fontSize: 12 }}>{r.college}</td>
                        <td style={{ fontSize: 12 }}>{r.branch}</td>
                        <td style={{ fontSize: 12 }}>{r.gradYear}</td>
                        <td><span className={`source-badge ${src.cls}`}>{src.label}</span></td>
                        <td style={{ fontSize: 11, fontFamily: 'monospace', color: '#4a5c8a' }}>{r.personalCode}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.referralCount || 0}</td>
                        <td style={{ fontSize: 11, color: '#8b97b5', whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    )
                  }) : (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#8b97b5' }}>No registrations match these filters.</td></tr>
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="pagination">
                <span className="page-info">{regTotal} total · page {regPage} of {regPages}</span>
                <button className="page-btn" disabled={regPage <= 1} onClick={() => loadRegistrations(regPage - 1)}>‹ Prev</button>
                {Array.from({ length: Math.min(5, regPages) }, (_, i) => {
                  const p = Math.max(1, regPage - 2) + i
                  if (p > regPages) return null
                  return <button key={p} className={`page-btn ${p === regPage ? 'current' : ''}`} onClick={() => loadRegistrations(p)}>{p}</button>
                })}
                <button className="page-btn" disabled={regPage >= regPages} onClick={() => loadRegistrations(regPage + 1)}>Next ›</button>
              </div>
            </div>
          </>
        )}

        {/* ── Captains tab ──────────────────────────────── */}
        {view === 'captains' && (
          <>
            <div className="admin-topbar">
              <h1>Campus Captains <span style={{ fontSize: 16, color: '#8b97b5', fontWeight: 600 }}>({captains.length} / 25)</span></h1>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {showAddForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add captain</>}
              </button>
            </div>

            {/* Add captain form */}
            {showAddForm && (
              <div className="card animate-fade-in" style={{ marginBottom: 20, border: '2px solid var(--navy)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Add new campus captain</h3>
                <form onSubmit={handleAddCaptain}>
                  <div className="form-grid">
                    <div className="field"><label>Full name *</label><input value={addForm.name} onChange={(e) => setAddForm((p)=>({...p,name:e.target.value}))} placeholder="Captain name" /></div>
                    <div className="field"><label>Email *</label><input type="email" value={addForm.email} onChange={(e) => setAddForm((p)=>({...p,email:e.target.value}))} placeholder="captain@college.edu" /></div>
                    <div className="field"><label>College *</label><input value={addForm.college} onChange={(e) => setAddForm((p)=>({...p,college:e.target.value}))} placeholder="College name" /></div>
                    <div className="field"><label>WhatsApp</label><input value={addForm.whatsapp} onChange={(e) => setAddForm((p)=>({...p,whatsapp:e.target.value}))} placeholder="+91 99999 99999" /></div>
                    <div className="field"><label>Registration target</label><input type="number" min={1} max={50} value={addForm.target} onChange={(e) => setAddForm((p)=>({...p,target:e.target.value}))} /></div>
                    <div className="field"><label>Notes</label><input value={addForm.notes} onChange={(e) => setAddForm((p)=>({...p,notes:e.target.value}))} placeholder="Any notes…" /></div>
                  </div>
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <button className="btn btn-dark" type="submit" disabled={addLoading}>
                      {addLoading ? <><span className="spinner" /> Adding…</> : 'Add captain ↗'}
                    </button>
                    <button className="btn btn-outline-dark" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Name</th><th>College</th><th>Captain code</th><th>Registrations</th><th>Target</th><th>Progress</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {capLoading ? (
                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#8b97b5' }}>
                      <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                    </td></tr>
                  ) : captains.length ? captains.map((c, i) => (
                    <tr key={c._id}>
                      <td style={{ color: '#8b97b5', fontSize: 11 }}>{i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#8b97b5' }}>{c.email}</div>
                      </td>
                      <td style={{ fontSize: 12 }}>{c.college}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 800, color: '#4a5c8a' }}>{c.captainCode}</td>
                      <td style={{ textAlign: 'center', fontWeight: 900, fontSize: 16 }}>{c.registrationCount}</td>
                      <td style={{ textAlign: 'center', color: '#8b97b5' }}>{c.target}</td>
                      <td style={{ width: 100 }}>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${Math.min(100, (c.registrationCount / c.target) * 100)}%`, background: c.registrationCount >= c.target ? 'var(--lime)' : 'var(--blue)' }} />
                        </div>
                      </td>
                      <td><span className={`pill ${c.active ? 'pill-lime' : 'pill-red'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        {c.active && (
                          <button className="btn btn-outline-dark btn-sm" onClick={() => handleDeactivate(c._id, c.name)}>Deactivate</button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#8b97b5' }}>
                      No captains yet. Add your first campus captain above.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="notice" style={{ marginTop: 16 }}>
              <strong>How it works:</strong> each captain gets a unique <strong>CC-XXXXX</strong> code. When students register using that code,
              the registration is attributed to the captain and their count increments. Target: 25 captains × 10 registrations = 250 seats.
            </div>
          </>
        )}

        {/* ── Growth Strategy & Budget View ──────────────── */}
        {view === 'plan' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px clamp(20px, 3vw, 36px)', border: '1px solid #dfe5f2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #eef2f8' }}>
              <div>
                <span className="pill pill-lime" style={{ marginBottom: 6 }}>INTERNAL CAMPAIGN BLUEPRINT</span>
                <h2 style={{ margin: '4px 0 0', fontSize: 24, letterSpacing: '-.03em' }}>500-Student Growth Plan & Budget</h2>
              </div>
              <button className="btn btn-dark btn-sm" onClick={() => setView('overview')}>← Back to Overview</button>
            </div>
            <Plan />
          </div>
        )}
      </main>
    </div>
  )
}
