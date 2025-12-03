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
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

function formatEventTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  })
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
  const paidCount = attendees?.filter(a => a.payment_confirmed).length || 0
  const unpaidCount = totalRegistered - paidCount

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
            price: event.price,
            currency: event.currency,
            payment_link: event.payment_link,
          }} />
        </div>
      </div>

      {/* Event Info */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100">{event.title}</h1>
        {event.description && (
          <p className="text-zinc-500 mt-2 max-w-2xl text-sm leading-snug">{event.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 py-1 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm">
            📅 {formatEventDate(event.date)}
          </Badge>
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 py-1 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm">
            🕐 {formatEventTime(event.date)}
          </Badge>
          {event.price && Number(event.price) > 0 && (
            <Badge variant="secondary" className="bg-emerald-950 text-emerald-400 border-emerald-900 py-1 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm">
              {getCurrencyFlag(event.currency)} {getCurrencySymbol(event.currency)}{Number(event.price).toFixed(2)} {event.currency || 'USD'}
            </Badge>
          )}
        </div>
        {event.location && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 py-1.5 px-3 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors text-xs sm:text-sm"
          >
            📍 <span className="line-clamp-1">{event.location}</span>
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-3 sm:p-5">
            <p className="text-2xl sm:text-3xl font-bold text-zinc-100">{totalRegistered}</p>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 sm:mt-1">Total Guests</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-emerald-950/20 border-emerald-900/30">
          <CardContent className="p-3 sm:p-5">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{paidCount}</p>
            <p className="text-xs sm:text-sm text-emerald-500/70 mt-0.5 sm:mt-1">Paid</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-red-950/20 border-red-900/30">
          <CardContent className="p-3 sm:p-5">
            <p className="text-2xl sm:text-3xl font-bold text-red-400">{unpaidCount}</p>
            <p className="text-xs sm:text-sm text-red-500/70 mt-0.5 sm:mt-1">Not Paid</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-3 sm:p-5">
            <p className="text-2xl sm:text-3xl font-bold text-zinc-100">
              {totalRegistered > 0 ? Math.round((paidCount / totalRegistered) * 100) : 0}%
            </p>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 sm:mt-1">Payment Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendees Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Chart - Hidden on mobile, shown as small card */}
        <Card className="border-zinc-800 bg-zinc-900 hidden sm:block">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentChart paidCount={paidCount} unpaidCount={unpaidCount} />
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-500">Paid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-zinc-500">Not Paid</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendees Table */}
        <Card className="border-zinc-800 bg-zinc-900 lg:col-span-3">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg text-zinc-100">Guest List</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {attendees && attendees.length > 0 ? (
              <AttendeeTable attendees={attendees} eventId={event.id} />
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
    </div>
  )
}
