/**
 * Generates calendar links and ICS downloads for the NxtWave AI Workshop
 */

function getUpcomingSaturday() {
  const d = new Date()
  const day = d.getDay() // 0 = Sun, 6 = Sat
  const daysUntilSaturday = (6 - day + 7) % 7 || 7
  const nextSat = new Date(d)
  nextSat.setDate(d.getDate() + daysUntilSaturday)
  return nextSat
}

function formatDateToUtc(date, hour, minute) {
  const d = new Date(date)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function getGoogleCalendarUrl(passId = '') {
  const sat = getUpcomingSaturday()
  // 7:00 PM IST is 13:30 UTC, 8:00 PM IST is 14:30 UTC
  const year = sat.getFullYear()
  const month = String(sat.getMonth() + 1).padStart(2, '0')
  const dateStr = String(sat.getDate()).padStart(2, '0')

  const startUtc = `${year}${month}${dateStr}T133000Z`
  const endUtc = `${year}${month}${dateStr}T143000Z`

  const title = encodeURIComponent('NxtWave: Build Your First AI Project in 60 Minutes')
  const desc = encodeURIComponent(
    `Join NxtWave's live 60-minute practical masterclass: "Build Your First AI Project in 60 Minutes".\n\n` +
    (passId ? `Your Pass ID: ${passId}\n\n` : '') +
    `What we will do:\n` +
    `• Code a working AI web app from scratch\n` +
    `• Deploy it to a live public cloud URL\n` +
    `• Receive an official NxtWave Certificate of Completion\n\n` +
    `Prerequisites: Beginner-friendly. No prior ML or Python experience needed.\n` +
    `Joining Link: Check your registered email or open https://campus-relay.vercel.app\n\n` +
    `Organized by NxtWave.`
  )
  const loc = encodeURIComponent('Online Live Interactive Coding Lab')

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${desc}&location=${loc}`
}

export function getOutlookCalendarUrl(passId = '') {
  const sat = getUpcomingSaturday()
  const year = sat.getFullYear()
  const month = String(sat.getMonth() + 1).padStart(2, '0')
  const dateStr = String(sat.getDate()).padStart(2, '0')

  const startUtc = `${year}-${month}-${dateStr}T13:30:00Z`
  const endUtc = `${year}-${month}-${dateStr}T14:30:00Z`

  const subject = encodeURIComponent('NxtWave: Build Your First AI Project in 60 Minutes')
  const body = encodeURIComponent(
    `Live 60-minute practical lab by NxtWave. Build and deploy a real AI project from scratch.\n` +
    (passId ? `Pass ID: ${passId}\n` : '') +
    `Online Live Session.`
  )
  const location = encodeURIComponent('Online Live Interactive Coding Lab')

  return `https://outlook.live.com/calendar/0/action/compose?subject=${subject}&startdt=${startUtc}&enddt=${endUtc}&body=${body}&location=${location}`
}

export function downloadIcsFile(passId = '') {
  const sat = getUpcomingSaturday()
  const year = sat.getFullYear()
  const month = String(sat.getMonth() + 1).padStart(2, '0')
  const dateStr = String(sat.getDate()).padStart(2, '0')

  const startUtc = `${year}${month}${dateStr}T133000Z`
  const endUtc = `${year}${month}${dateStr}T143000Z`

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NxtWave//Campus Relay AI Masterclass//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:nxtwave-ai-workshop-${year}${month}${dateStr}@campusrelay.nxtwave`,
    `DTSTAMP:${formatDateToUtc(new Date(), 0, 0)}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    'SUMMARY:NxtWave: Build Your First AI Project in 60 Minutes',
    `DESCRIPTION:Free live 60-minute masterclass empowering students to code and deploy their first AI project. ${passId ? 'Pass: ' + passId : ''}`,
    'LOCATION:Online Live Interactive Coding Lab',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: NxtWave AI Workshop starts in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'NxtWave-AI-Workshop.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
