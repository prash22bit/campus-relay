import {
  Lock,
  ClipboardList,
  Link2,
  Share2,
  BarChart3,
  Users,
  Download,
  Target,
  Sparkles,
  FlaskConical,
  XCircle,
  AlertTriangle,
  Bot,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'

const budget = [
  { item: 'Build / demo awards (4 × ₹250)', amount: '₹1,000', note: 'Paid after workshop attendance + submitted build. Only if permitted by organiser.' },
  { item: 'Captain connectivity reimbursements (6 × ₹100)', amount: '₹600', note: 'Against proof of permitted placements — not per-registration commissions.' },
  { item: 'Contingency', amount: '₹400', note: 'Reserve for essential data / printing / operational needs. Release only if required.' },
  { item: 'Total Budget', amount: '₹2,000', note: 'Use free static hosting, Google Forms / Sheets and built-in WhatsApp share links.' },
]

const aiNotes = [
  {
    prompt: '"Give me 20 ways to get registrations."',
    suggested: 'Broad social posting, paid ads, influencer outreach, email blasts, WhatsApp groups, and more.',
    changed: 'Prioritised four measurable source buckets with named targets. A tiny budget and 7-day window rewards focus and clear ownership — not a long idea list.',
  },
  {
    prompt: '"Make this go viral with a viral coefficient above 1."',
    suggested: 'A strong referral loop and aggressive growth assumptions with a K-factor calculation.',
    changed: 'Rejected the coefficient as unsupported without observed share, click, and registration rates. Set explicit targets, made assumptions visible, and would revise them after the first 24 hours of source data.',
  },
  {
    prompt: '"Make the registration message more persuasive."',
    suggested: 'Urgency language, scarcity countdown, certificate promises, and extra reward claims.',
    changed: 'Rejected unverified scarcity, certificate and outcome claims. The workshop owner must confirm date, project, and rewards before those are promised. Also avoided unsolicited bulk WhatsApp messages.',
  },
]

const sources = [
  { label: 'Campus Captains', target: 250, pct: 50, color: 'var(--lime)', desc: '25 people × 10 qualified registrations' },
  { label: 'Clubs & Placement Cells', target: 100, pct: 20, color: 'var(--blue)', desc: '10 communities × 10 unique registrations' },
  { label: 'Peer Referral Loop', target: 100, pct: 20, color: 'var(--coral)', desc: 'Net-new, de-duplicated after attribution' },
  { label: 'Owned Social & Direct', target: 50, pct: 10, color: '#b89fff', desc: 'Personal posts and permitted direct outreach' },
]

const growthTests = [
  {
    id: '01',
    category: 'MESSAGING & VALUE PROP',
    title: 'Value Proposition Copy Hook',
    hypothesis: 'Outcome-first copy ("Leave with a project you can explain in an interview") will generate higher registration conversion per unique click than speed-first copy ("Build an AI project in 60 minutes"), because final-year students are driven by placement anxiety.',
    test: 'A/B test two distinct landing page headline variants and share cards across comparable campus WhatsApp groups (12 captains with Variant A, 13 captains with Variant B).',
    metric: 'Primary: Unique click-to-registration conversion rate (Target: >35%). Secondary: Total completed registrations.',
  },
  {
    id: '02',
    category: 'VIRAL MECHANICS',
    title: 'Incentivized Post-Registration Referral Loop',
    hypothesis: 'Offering an immediate digital reward (exclusive AI Developer Starter Pack with Prompt Engineering Toolkit + Source Code) on the confirmation screen will increase the peer referral rate (K-factor) from 0.05 to >0.20.',
    test: 'Post-registration screen test: Half of registrants see a standard "Invite classmates" prompt, while the other half see the "Unlock Starter Pack by sharing with 2 friends" unlock mechanic with pre-filled 1-click WhatsApp button.',
    metric: 'Primary: Referral share clicks and completed secondary registrations (Target: 100+ via CR- codes). Secondary: Share button click-through rate.',
  },
  {
    id: '03',
    category: 'CHANNEL ACTIVATION',
    title: 'Campus Captain Quota & Accountability',
    hypothesis: 'Assigning a dedicated quota (10 students per captain) with a real-time leaderboard and personal CC- code tracking will yield 3x higher activation than generic open-ended community posting.',
    test: 'Cohort test: 15 captains given structured 1-message kits with personal CC- attribution codes and daily milestone tracking vs 10 captains given generic registration links.',
    metric: 'Primary: Captain activation rate (% achieving >=10 registrations, Target: >80%). Secondary: Registration velocity in first 48 hours.',
  },
]

const rejections = [
  {
    type: 'Marketing',
    title: 'Paid Meta & Instagram Ads',
    suggested: 'AI suggested allocating ₹1,500 into paid Instagram/Meta ads targeting "engineering students" and "AI" with ₹3–4 CPC claims.',
    reason: 'A ₹2,000 budget burns within 24-48 hours with high click fraud and non-converting bot traffic (real student CAC > ₹30). College students suffer from webinar fatigue and ignore sponsored ads. Peer recommendations from Class Representatives have 10x higher credibility.',
  },
  {
    type: 'Marketing',
    title: 'Fear-Based Placement Scarcity & Bulk WhatsApp Spam',
    suggested: 'AI proposed aggressive urgency copy ("Only 15 seats left! Risk falling behind in placements!") and auto-scraping phone numbers into unverified groups.',
    reason: 'Fake webinar scarcity destroys NxtWave brand trust when students realize webinars have unlimited digital capacity. Scraping student numbers violates WhatsApp Business terms and campus privacy policies, risking account bans and institutional friction.',
  },
  {
    type: 'Technical',
    title: 'Client-Side localStorage for Attribution & Analytics',
    suggested: 'AI provided a single-file prototype using browser localStorage to store registrations, referral codes, and local operator metrics.',
    reason: 'localStorage fails completely in multi-user acquisition because it cannot track referrals across different devices, cannot send server-side confirmations, and cannot prevent duplicate registrations. Replaced with production MongoDB Atlas + Express backend.',
  },
  {
    type: 'Technical',
    title: 'Mixing Internal Growth Strategy & Student UI on Same Page',
    suggested: 'AI suggested putting the operator metrics, budget tables, and AI reflections directly on the public workshop homepage.',
    reason: 'Students arriving to register should see a high-converting, professional workshop landing page focused solely on what they will build. Internal marketing calculations and admin data belong strictly in a JWT-authenticated /admin portal.',
  },
]

export default function Plan({ embedded = false }) {
  return (
    <div className={`plan-container ${embedded ? 'plan-embedded' : ''}`}>
      {/* ── Standalone Hero (Shown only on /plan route) ───── */}
      {!embedded && (
        <section style={{ background: 'var(--navy)', color: '#fff', padding: 'clamp(48px,7vw,88px) clamp(20px,5vw,76px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(199,255,94,.07) 0%, transparent 70%)', right: -50, top: -100, pointerEvents: 'none' }} />
          <div style={{ maxWidth: 900, position: 'relative', zIndex: 1 }}>
            <div className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: '#fff', borderColor: 'rgba(255,255,255,.2)', marginBottom: 14 }}>
              <Lock size={12} style={{ marginRight: 6 }} /> ORGANIZER & EVALUATOR BRIEF · INTERNAL GROWTH STRATEGY
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '-.055em', lineHeight: 1.05, margin: '14px 0 18px', fontWeight: 900 }}>
              Campus Relay —<br /><em style={{ fontStyle: 'normal', color: 'var(--lime)' }}>the strategy behind the build.</em>
            </h1>
            <p style={{ color: '#b3bdd4', fontSize: 16, lineHeight: 1.7, maxWidth: 640 }}>
              Get 500 final-year engineering students to register for a free AI workshop in 7 days,
              with a ₹2,000 budget. This is the full thinking behind how.
            </p>
            <div className="plan-hero-metrics">
              {[['₹2,000', 'Total budget'], ['7 days', 'Campaign window'], ['500', 'Registration target'], ['₹4.00', 'Cost per reg (target)']].map(([v, l]) => (
                <div key={l} style={{ padding: '12px 18px', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, background: 'rgba(255,255,255,.05)', textAlign: 'center', minWidth: 100 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-.04em' }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#7e8eab', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Embedded KPI Strip (Shown when in Admin Dashboard) ───── */}
      {embedded && (
        <div className="plan-embedded-section">
          <div className="plan-hero-metrics" style={{ marginTop: 0 }}>
            {[['₹2,000', 'Total budget'], ['7 days', 'Campaign window'], ['500', 'Target registrations'], ['₹4.00', 'Target cost per reg']].map(([v, l]) => (
              <div key={l} style={{ padding: '14px 18px', border: '1px solid #dfe5f2', borderRadius: 14, background: '#f8fafd', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--navy)', letterSpacing: '-.04em' }}>{v}</div>
                <div style={{ fontSize: 11, color: '#687799', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4, fontWeight: 700 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 1. Audience & JTBD ────────────────────────────── */}
      <section className={embedded ? 'plan-embedded-section' : 'section'}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">1 · Audience & job-to-be-done</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', letterSpacing: '-.04em', margin: '10px 0 18px' }}>Who and why</h2>
          <div className="plan-audience-grid">
            {[
              { title: 'Primary audience', body: 'Final-year B.E./B.Tech students applying for internships or jobs, curious about AI, wanting a project they can explain in interviews. Priority: CSE, IT and AI/Data Science, then ECE and other branches where beginner prerequisites are met.' },
              { title: 'Key friction', body: '"I know AI projects matter, but a full project feels too large, and many workshops are more theory than building." Reduce time risk and uncertainty — not with fear-based employability claims.' },
              { title: 'Reason to register', body: 'One hour. Beginner-friendly prerequisites. A clear example of the thing they\'ll build. A host/mentor preview. A credible next step they can continue afterward.' },
              { title: 'Copy test variants', body: 'A: "Build your first AI project in 60 minutes." vs B: "Leave with a small AI project you can explain in an interview." Run in comparable permitted communities, compare valid registrations per unique click.' },
            ].map((item) => (
              <div key={item.title} className="card" style={{ padding: '18px 20px' }}>
                <h4 style={{ fontSize: 14, fontWeight: 900, marginBottom: 8, letterSpacing: '-.02em', color: 'var(--navy)' }}>{item.title}</h4>
                <p style={{ fontSize: 13, color: '#667087', lineHeight: 1.6, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Distribution Channels ──────────────────────── */}
      <section className={embedded ? 'plan-embedded-section' : 'section section-alt'}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">2 · Distribution channels</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', letterSpacing: '-.04em', margin: '10px 0 20px' }}>Four sources. Named targets. Not twenty ideas.</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sources.map((s, i) => (
              <div key={s.label} className="card plan-source-card">
                <div className="plan-source-header">
                  <div className="plan-source-num">0{i + 1}</div>
                  <div className="plan-source-meta">
                    <div className="plan-source-title">{s.label}</div>
                    <div className="plan-source-desc">{s.desc}</div>
                  </div>
                  <div className="plan-source-stat">
                    <span className="plan-source-target" style={{ color: s.color }}>{s.target}</span>
                    <span className="plan-source-pct">{s.pct}% of 500</span>
                  </div>
                </div>
                <div className="progress-track" style={{ marginTop: 10 }}>
                  <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="notice" style={{ marginTop: 18 }}>
            <strong>De-duplication rule:</strong> Count each unique student email once. Preserve first-touch attribution and referral chains in MongoDB.
            Target cost per registration at 500: <strong>₹2,000 ÷ 500 = ₹4.00</strong> (budget math, not a market benchmark).
          </div>
        </div>
      </section>

      {/* ── 3. Budget Breakdown ───────────────────────────── */}
      <section className={embedded ? 'plan-embedded-section' : 'section'}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">3 · Budget breakdown (₹2,000 total)</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', letterSpacing: '-.04em', margin: '10px 0 20px' }}>Where every rupee goes</h2>

          <div className="plan-budget-grid">
            {budget.map((b) => (
              <div key={b.item} className={`plan-budget-card ${b.item.includes('Total') ? 'plan-budget-total' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{b.item}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: b.item.includes('Total') ? 'var(--lime)' : 'var(--navy)', whiteSpace: 'nowrap' }}>{b.amount}</div>
                </div>
                <div style={{ fontSize: 12, color: b.item.includes('Total') ? '#b8c5de' : '#667087', lineHeight: 1.55 }}>{b.note}</div>
              </div>
            ))}
          </div>

          <div className="notice" style={{ marginTop: 16 }}>
            If the organiser cannot administer prizes fairly, move that ₹1,000 into verified project-completion awards or remove incentives.
            The campaign must never depend on bribing sign-ups. Budget must be approved against actual rules before launch.
          </div>
        </div>
      </section>

      {/* ── 4. 3 Growth Experiments ───────────────────────── */}
      <section className={embedded ? 'plan-embedded-section' : 'section section-alt'}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">4 · Strategic Growth Tests</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', letterSpacing: '-.04em', margin: '10px 0 8px' }}>3 High-Impact Growth Experiments</h2>
          <p style={{ color: '#667087', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Structured hypothesis testing to validate messaging, viral loops, and captain distribution velocity before scaling outreach.
          </p>

          <div className="plan-tests-grid">
            {growthTests.map((t) => (
              <div key={t.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span className="pill pill-blue" style={{ fontSize: 10 }}>{t.category}</span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#8b97b5' }}>TEST {t.id}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: 'var(--navy)' }}>{t.title}</h3>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#596a8a', letterSpacing: '.06em', marginBottom: 4 }}>Hypothesis</div>
                    <p style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.55, margin: 0 }}>{t.hypothesis}</p>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#596a8a', letterSpacing: '.06em', marginBottom: 4 }}>What I Would Test</div>
                    <p style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.55, margin: 0 }}>{t.test}</p>
                  </div>
                </div>

                <div style={{ background: '#f5f7fc', borderRadius: 10, padding: '10px 12px', marginTop: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy)', letterSpacing: '.06em', marginBottom: 2 }}>Target Metric</div>
                  <p style={{ fontSize: 11, color: '#2d3748', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>{t.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Deliberately Rejected (2+2 Framework) ──────── */}
      <section className={embedded ? 'plan-embedded-section' : 'section'}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">5 · Deliberate Rejections (2+2 Framework)</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', letterSpacing: '-.04em', margin: '10px 0 8px' }}>What AI suggested that was rejected & why</h2>
          <p style={{ color: '#667087', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            2 Marketing decisions + 2 Technical architecture decisions where human growth judgment and ethics overrode AI recommendations.
          </p>

          <div className="plan-rejections-grid">
            {rejections.map((r, i) => (
              <div key={i} className="card" style={{ padding: '20px', borderLeft: r.type === 'Marketing' ? '4px solid #16a34a' : '4px solid #7c3aed' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className={`pill ${r.type === 'Marketing' ? 'pill-lime' : 'pill-blue'}`} style={{ fontSize: 10 }}>{r.type.toUpperCase()} DECISION</span>
                  <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <XCircle size={13} /> REJECTED
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--navy)', marginBottom: 10 }}>{r.title}</h3>

                <div style={{ background: '#f8fafd', borderRadius: 10, padding: '10px 12px', marginBottom: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: 3 }}>AI Suggested:</div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{r.suggested}</p>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#b91c1c', marginBottom: 3 }}>Why I Rejected It:</div>
                  <p style={{ fontSize: 12, color: '#7f1d1d', margin: 0, lineHeight: 1.55 }}>{r.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. AI + Learning Notes ────────────────────────── */}
      <section className={embedded ? 'plan-embedded-section' : 'section section-dark'}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker" style={{ color: embedded ? '#596a8a' : '#7e8eab' }}>6 · AI Worklog & Engineering Reflection</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', letterSpacing: '-.04em', margin: '10px 0 8px', color: embedded ? 'var(--navy)' : '#fff' }}>Prompt → AI Output → What I Changed</h2>
          <p style={{ color: embedded ? '#667087' : '#9aa7c2', fontSize: 14, marginBottom: 24, lineHeight: 1.65 }}>
            Three practical examples of using AI iteratively to refine growth assumptions and campaign mechanics.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {aiNotes.map((note, i) => (
              <div key={i} style={{ background: embedded ? '#fff' : 'rgba(255,255,255,.05)', border: embedded ? '1px solid #dfe5f2' : '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '20px 22px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(199,255,94,.18)', color: 'var(--navy)', fontWeight: 900, fontSize: 12, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: embedded ? 'var(--navy)' : '#e2e8f0', lineHeight: 1.4 }}>Prompt: {note.prompt}</div>
                </div>
                <div className="plan-ai-note-grid">
                  <div style={{ background: embedded ? '#f8fafd' : 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 14px', border: embedded ? '1px solid #edf2f7' : 'none' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em', color: '#687799', marginBottom: 6 }}>AI suggested</div>
                    <p style={{ fontSize: 12, color: embedded ? '#4a5568' : '#8b97b5', lineHeight: 1.6, margin: 0 }}>{note.suggested}</p>
                  </div>
                  <div style={{ background: embedded ? '#f0fdf4' : 'rgba(199,255,94,.07)', border: embedded ? '1px solid #bbf7d0' : '1px solid rgba(199,255,94,.15)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em', color: embedded ? '#15803d' : 'var(--lime)', marginBottom: 6 }}>What I changed</div>
                    <p style={{ fontSize: 12, color: embedded ? '#166534' : '#c8d5b0', lineHeight: 1.6, margin: 0 }}>{note.changed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. What Was Built (MERN Features) ─────────────── */}
      <section className={embedded ? 'plan-embedded-section' : 'section'}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">7 · Live System Capabilities</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', letterSpacing: '-.04em', margin: '10px 0 18px' }}>Campus Relay — Full-Stack MERN Stack</h2>

          <div className="plan-features-grid">
            {[
              { icon: <ClipboardList size={20} style={{ color: '#174092' }} />, title: 'Registration flow', desc: 'Student form with server-side deduplication by normalised email.' },
              { icon: <Link2 size={20} style={{ color: '#16a34a' }} />, title: 'Referral attribution', desc: 'CR- (student) and CC- (captain) codes with real cross-device attribution in MongoDB.' },
              { icon: <Share2 size={20} style={{ color: '#25D366' }} />, title: '1-Click WhatsApp share', desc: 'Pre-filled share message with personal invite link baked in.' },
              { icon: <BarChart3 size={20} style={{ color: '#7c3aed' }} />, title: 'Organizer dashboard', desc: 'Live KPIs, daily velocity chart, source breakdown, top captains table — from MongoDB.' },
              { icon: <Users size={20} style={{ color: '#b45309' }} />, title: 'Captain management', desc: 'Add / deactivate campus captains. Their CC- codes track registrations.' },
              { icon: <Download size={20} style={{ color: '#0891b2' }} />, title: 'Excel CSV export', desc: 'Full UTF-8 BOM export with attribution fields for post-campaign analysis.' },
            ].map((item) => (
              <div key={item.title} className="card" style={{ padding: '18px 20px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f5f7fc', display: 'grid', placeItems: 'center', marginBottom: 12 }}>
                  {item.icon}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 6, color: 'var(--navy)' }}>{item.title}</h4>
                <p style={{ fontSize: 12, color: '#667087', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="notice" style={{ marginTop: 20 }}>
            <strong>Operational Guardrails:</strong> Strictly opt-in student registrations. No live WhatsApp Business mass-marketing, no scraping, and no fake urgency timers. Fully compliant with campus privacy guidelines.
          </div>
        </div>
      </section>
    </div>
  )
}
