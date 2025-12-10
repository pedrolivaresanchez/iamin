import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import AttendeeTable from './attendee-table'
import CopyLinkButton from './copy-link-button'
import PaymentChart from './payment-chart'
import EditEventDialog from './edit-event-dialog'
import BackButton from './back-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrencySymbol, getCurrencyFlag } from '@/lib/currencies'

function formatEventDate(dateString: string): string {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const [, year, month, day] = match
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }
  return dateString
}

function formatEventTime(dateString: string): string {
  const match = dateString.match(/T(\d{2}):(\d{2})/)
  if (match) {
    const hour = parseInt(match[1])
    const minute = match[2]
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour < 12 ? 'AM' : 'PM'
    return `${String(h12).padStart(2, '0')}:${minute} ${ampm}`
  }
  return dateString
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  const { data: attendees } = await supabase
    .from('attendees')
    .select('*')
    .eq('event_id', id)
    .order('registered_at', { ascending: false })

  const totalRegistered = attendees?.length || 0
  const isPaidEvent = Boolean(event.price && Number(event.price) > 0)
  const paidCount = isPaidEvent
    ? attendees?.filter(a => a.payment_confirmed).length || 0
    : totalRegistered
  const unpaidCount = isPaidEvent ? totalRegistered - paidCount : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2">
          <CopyLinkButton slug={event.slug} />
          <EditEventDialog event={{
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            host_name: event.host_name,
            price: event.price,
            currency: event.currency,
            payment_methods: event.payment_methods,
            image_url: event.image_url,
            spotify_url: event.spotify_url,
            max_spots: event.max_spots,
            password: event.password,
            enabled: event.enabled,
          }} />
        </div>
      </div>

      {/* Event Info */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="px-4 sm:px-6 pt-0 pb-4 sm:pt-0 sm:pb-6">
          {/* Stats Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 px-3 py-1.5">
              <span className="font-semibold text-base">{totalRegistered}</span>
              <span className="ml-1.5 text-xs text-zinc-500">Guests</span>
            </Badge>
            {isPaidEvent && (
              <>
                <Badge variant="secondary" className="bg-emerald-950/30 text-emerald-400 border-emerald-900/30 px-3 py-1.5">
                  <span className="font-semibold text-base">{paidCount}</span>
                  <span className="ml-1.5 text-xs text-emerald-500/70">Paid</span>
                </Badge>
                <Badge variant="secondary" className="bg-red-950/30 text-red-400 border-red-900/30 px-3 py-1.5">
                  <span className="font-semibold text-base">{unpaidCount}</span>
                  <span className="ml-1.5 text-xs text-red-500/70">Unpaid</span>
                </Badge>
              </>
            )}
          </div>

          {/* Title and Description */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100 mb-2">{event.title}</h1>
            {event.description && (
              <p className="text-zinc-400 text-sm leading-relaxed">{event.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-zinc-100 font-medium">{formatEventDate(event.date)}</p>
                <p className="text-zinc-500 text-sm mt-0.5">{formatEventTime(event.date)}</p>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 group-hover:bg-rose-500/20 transition-colors">
                  <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-100 font-medium group-hover:text-white transition-colors truncate">{event.location}</p>
                  <p className="text-zinc-500 text-sm mt-0.5 group-hover:text-zinc-400 transition-colors flex items-center gap-1">
                    View on Maps
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </p>
                </div>
              </a>
            )}

            {/* Price */}
            {isPaidEvent && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-zinc-100 font-medium">
                    {getCurrencySymbol(event.currency)}{Number(event.price).toFixed(2)} <span className="text-zinc-500 font-normal">{event.currency || 'USD'}</span>
                  </p>
                  <p className="text-zinc-500 text-sm mt-0.5">Entry fee</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendees Section */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader className="pb-0">
          <CardTitle className="text-base sm:text-lg text-zinc-100">Guest List</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {attendees && attendees.length > 0 ? (
            <AttendeeTable attendees={attendees} eventId={event.id} isPaidEvent={isPaidEvent} />
          ) : (
            <div className="text-center py-12 sm:py-16 border border-dashed border-zinc-800 rounded-xl">
              <span className="text-3xl sm:text-4xl mb-3 block">🎉</span>
              <p className="text-zinc-400 font-medium text-sm sm:text-base">No guests yet</p>
              <p className="text-zinc-600 text-xs sm:text-sm mt-1">Share your event link to start getting registrations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
