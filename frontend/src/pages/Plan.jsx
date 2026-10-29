import {
  Lock,
  ClipboardList,
  Link2,
  Share2,
  BarChart3,
  Users,
  Download,
} from 'lucide-react'

const budget = [
  { item: 'Build / demo awards (4 × ₹250)', amount: '₹1,000', note: 'Paid after workshop attendance + submitted build. Only if permitted by organiser.' },
  { item: 'Captain connectivity reimbursements (6 × ₹100)', amount: '₹600', note: 'Against proof of permitted placements — not per-registration commissions.' },
  { item: 'Contingency', amount: '₹400', note: 'Reserve for essential data / printing / operational needs. Release only if required.' },
  { item: 'Total', amount: '₹2,000', note: 'Use free static hosting, Google Forms / Sheets and built-in WhatsApp share links.' },
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

export default function Plan() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--navy)', color: '#fff', padding: 'clamp(48px,7vw,88px) clamp(20px,5vw,76px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(199,255,94,.07) 0%, transparent 70%)', right: -50, top: -100, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 820, position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: '#fff', borderColor: 'rgba(255,255,255,.2)', marginBottom: 14 }}>
            <Lock size={12} style={{ marginRight: 6 }} /> ORGANIZER & EVALUATOR BRIEF · INTERNAL GROWTH STRATEGY
          </div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-.055em', lineHeight: .98, margin: '14px 0 18px', fontWeight: 900 }}>
            Campus Relay —<br /><em style={{ fontStyle: 'normal', color: 'var(--lime)' }}>the strategy behind the build.</em>
          </h1>
          <p style={{ color: '#b3bdd4', fontSize: 16, lineHeight: 1.7, maxWidth: 640 }}>
            Get 500 final-year engineering students to register for a free AI workshop in 7 days,
            with a ₹2,000 budget. This is the full thinking behind how.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {[['₹2,000', 'Total budget'], ['7 days', 'Campaign window'], ['500', 'Registration target'], ['₹4', 'Cost per reg (target)']].map(([v, l]) => (
              <div key={l} style={{ padding: '12px 18px', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, background: 'rgba(255,255,255,.05)', textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-.04em' }}>{v}</div>
                <div style={{ fontSize: 10, color: '#7e8eab', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Audience & insight ────────────────────────────── */}
      <section className="section">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">1 · Audience & job-to-be-done</div>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', letterSpacing: '-.04em', margin: '12px 0 18px' }}>Who and why</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {[
              { title: 'Primary audience', body: 'Final-year B.E./B.Tech students applying for internships or jobs, curious about AI, wanting a project they can explain in interviews. Priority: CSE, IT and AI/Data Science, then ECE and other branches where beginner prerequisites are met.' },
              { title: 'Key friction', body: '"I know AI projects matter, but a full project feels too large, and many workshops are more theory than building." Reduce time risk and uncertainty — not with fear-based employability claims.' },
              { title: 'Reason to register', body: 'One hour. Beginner-friendly prerequisites. A clear example of the thing they\'ll build. A host/mentor preview. A credible next step they can continue afterward.' },
              { title: 'Copy test variants', body: 'A: "Build your first AI project in 60 minutes." vs B: "Leave with a small AI project you can explain in an interview." Run in comparable permitted communities, compare valid registrations per unique click.' },
            ].map((item) => (
              <div key={item.title} className="card" style={{ padding: '20px 22px' }}>
                <h4 style={{ fontSize: 14, fontWeight: 900, marginBottom: 8, letterSpacing: '-.02em' }}>{item.title}</h4>
                <p style={{ fontSize: 13, color: '#667087', lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Distribution channels ─────────────────────────── */}
      <section className="section section-alt">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">2 · Distribution channels</div>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', letterSpacing: '-.04em', margin: '12px 0 24px' }}>Four sources. Named targets. Not twenty ideas.</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sources.map((s, i) => (
              <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 22px' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#3a4a70', width: 32, textAlign: 'center' }}>0{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: '#8b97b5', marginBottom: 10 }}>{s.desc}</div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-.05em', color: s.color }}>{s.target}</div>
                  <div style={{ fontSize: 10, color: '#8b97b5', textTransform: 'uppercase' }}>{s.pct}% of 500</div>
                </div>
              </div>
            ))}
          </div>

          <div className="notice" style={{ marginTop: 20 }}>
            <strong>De-duplication:</strong> count a unique registration once. Preserve first-touch and referral attribution. Don't overwrite the original source.
            Target cost per registration at 500: <strong>₹2,000 ÷ 500 = ₹4.00</strong> (budget math, not a market benchmark).
          </div>
        </div>
      </section>

      {/* ── Budget ────────────────────────────────────────── */}
      <section className="section">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">3 · Budget breakdown (₹2,000 total)</div>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', letterSpacing: '-.04em', margin: '12px 0 24px' }}>Where every rupee goes</h2>

          <div className="data-table-wrap">
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Allocation</th>
                  <th>Purpose / guardrail</th>
                </tr>
              </thead>
              <tbody>
                {budget.map((row) => (
                  <tr key={row.item}>
                    <td style={{ fontWeight: row.item === 'Total' ? 900 : 600 }}>{row.item}</td>
                    <td style={{ fontWeight: 900, color: row.item === 'Total' ? 'var(--navy)' : 'inherit' }}>{row.amount}</td>
                    <td style={{ fontSize: 12, color: '#667087' }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="notice" style={{ marginTop: 16 }}>
            If the organiser cannot administer prizes fairly, move that ₹1,000 into verified project-completion awards or remove incentives.
            The campaign should not depend on bribing sign-ups. Budget must be approved against actual rules before launch.
          </div>
        </div>
      </section>

      {/* ── AI + Learning notes ───────────────────────────── */}
      <section className="section section-dark">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker" style={{ color: '#596a8a' }}>4 · AI + learning notes</div>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', letterSpacing: '-.04em', margin: '12px 0 8px', color: '#fff' }}>What AI suggested — and what changed</h2>
          <p style={{ color: '#7e8eab', fontSize: 14, marginBottom: 28, lineHeight: 1.65 }}>
            Honest examples of where AI was useful, and where my own judgment overrode the suggestion.
            Edit these to match prompts you actually used.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {aiNotes.map((note, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 18, padding: '22px 24px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(199,255,94,.12)', color: 'var(--lime)', fontWeight: 900, fontSize: 12, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#d4ddf0', lineHeight: 1.4 }}>Prompt: {note.prompt}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', color: '#596a8a', marginBottom: 8 }}>AI suggested</div>
                    <p style={{ fontSize: 12, color: '#8b97b5', lineHeight: 1.6, margin: 0 }}>{note.suggested}</p>
                  </div>
                  <div style={{ background: 'rgba(199,255,94,.07)', border: '1px solid rgba(199,255,94,.15)', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--lime)', marginBottom: 8, opacity: .8 }}>What I changed</div>
                    <p style={{ fontSize: 12, color: '#c8d5b0', lineHeight: 1.6, margin: 0 }}>{note.changed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What the build does ───────────────────────────── */}
      <section className="section">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="kicker">5 · What was built</div>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', letterSpacing: '-.04em', margin: '12px 0 18px' }}>Campus Relay — MERN stack, fully wired</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { icon: <ClipboardList size={20} style={{ color: '#174092' }} />, title: 'Registration flow', desc: 'Student form with server-side deduplication by normalised email.' },
              { icon: <Link2 size={20} style={{ color: '#16a34a' }} />, title: 'Referral codes', desc: 'CR- (student) and CC- (captain) codes with real cross-device attribution in MongoDB.' },
              { icon: <Share2 size={20} style={{ color: '#25D366' }} />, title: 'WhatsApp share', desc: 'Pre-filled share message with personal invite link baked in.' },
              { icon: <BarChart3 size={20} style={{ color: '#7c3aed' }} />, title: 'Operator dashboard', desc: 'Live KPIs, daily chart, source breakdown, top captains table — all from the DB.' },
              { icon: <Users size={20} style={{ color: '#b45309' }} />, title: 'Captain management', desc: 'Add / deactivate campus captains. Their CC- codes track registrations.' },
              { icon: <Download size={20} style={{ color: '#0891b2' }} />, title: 'CSV export', desc: 'Full UTF-8 BOM export with attribution fields for post-campaign analysis.' },
            ].map((item) => (
              <div key={item.title} className="card" style={{ padding: '20px' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f5f7fc', display: 'grid', placeItems: 'center', marginBottom: 12 }}>
                  {item.icon}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{item.title}</h4>
                <p style={{ fontSize: 12, color: '#667087', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="notice" style={{ marginTop: 20 }}>
            <strong>What is not connected:</strong> live WhatsApp Business API, payment gateway for awards, NxtWave internal systems,
            or any production email service. A deployed version needs a privacy notice, server-side consent handling, and a defined
            data-retention policy before real student data is collected.
          </div>
        </div>
      </section>
    </>
  )
}
