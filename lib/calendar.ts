export type CalendarEvent = {
  title: string
  description?: string
  location?: string
  startDate: string // ISO date string like "2025-12-04T16:00:00"
  endDate: string
}

// Parse ISO date string directly without timezone conversion
// Input: "2025-12-04T16:00:00" -> Output: "20251204T160000"
function formatDateDirect(dateString: string): string {
  return dateString.replace(/[-:]/g, '').slice(0, 15)
}

// Format current timestamp for ICS DTSTAMP (needs to be UTC)
function formatNowForIcs(): string {
  const now = new Date()
  return now.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
}

// Add hours to an ISO date string
export function addHoursToDate(dateString: string, hours: number): string {
  const date = new Date(dateString)
  date.setHours(date.getHours() + hours)
  return date.toISOString().slice(0, 19)
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDateDirect(event.startDate)}/${formatDateDirect(event.endDate)}`,
    details: event.description || '',
    location: event.location || '',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function generateIcsFile(event: CalendarEvent): string {
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@iamin.app`
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//iamin//Event//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatNowForIcs()}`,
    `DTSTART:${formatDateDirect(event.startDate)}`,
    `DTEND:${formatDateDirect(event.endDate)}`,
    `SUMMARY:${event.title.replace(/[,;\\]/g, '\\$&')}`,
    `DESCRIPTION:${(event.description || '').replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')}`,
    `LOCATION:${(event.location || '').replace(/[,;\\]/g, '\\$&')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return icsContent
}

export function downloadIcsFile(event: CalendarEvent): void {
  const icsContent = generateIcsFile(event)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
