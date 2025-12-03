import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RegistrationForm from './registration-form'
import AttendeesWall from './attendees-wall'
import AnimatedBackground from './animated-background'
import { Button } from '@/components/ui/button'
import { getCurrencySymbol, getCurrencyFlag } from '@/lib/currencies'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  })
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !event) {
    notFound()
  }

  const { data: attendees } = await supabase
    .from('attendees')
    .select('id, full_name, payment_confirmed')
    .eq('event_id', event.id)
    .order('registered_at', { ascending: false })

  const hasPrice = event.price !== null && event.price !== undefined && Number(event.price) > 0

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Event Details & Registration */}
        <div className="w-full lg:w-[60%] p-6 lg:p-12 overflow-y-auto">
          <div className="max-w-lg mx-auto w-full space-y-8">
            {/* Event Header */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 tracking-tight">
                {event.title}
              </h1>
              {event.description && (
                <p className="text-zinc-400 mt-3 text-base leading-snug">{event.description}</p>
              )}
            </div>

            {/* Date & Location Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                <span>📅</span>
                <span className="text-zinc-200 font-medium">{formatDate(event.date)}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">{formatTime(event.date)}</span>
              </div>
              {event.location && (
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50 hover:border-zinc-600/50 transition-colors group"
                >
                  <span>📍</span>
                  <span className="text-zinc-200 font-medium group-hover:text-white">{event.location}</span>
                  <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Payment Section */}
            {hasPrice && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCurrencyFlag(event.currency)}</span>
                    <p className="font-bold text-emerald-400 text-xl">
                      {getCurrencySymbol(event.currency)}{Number(event.price).toFixed(2)}
                    </p>
                    <span className="text-sm text-emerald-500/70">{event.currency || 'USD'}</span>
                  </div>
                  {event.payment_link && (
                    <a 
                      href={event.payment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all hover:scale-105 shadow-lg shadow-emerald-900/30"
                    >
                      Pay Now →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Registration Form */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-zinc-100 mb-1">Join this event</h2>
              <p className="text-sm text-zinc-500 mb-6">Fill in your details to register</p>
              <RegistrationForm event={{
                  id: event.id,
                  title: event.title,
                  description: event.description,
                  date: event.date,
                  location: event.location,
                }} />
            </div>

            {/* Footer CTA */}
            <div className="mt-auto pt-8 border-t border-zinc-800/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                  <p className="text-zinc-500 text-sm">
                    Powered by <span className="font-semibold text-zinc-300">🎉 IamIn</span>
                  </p>
                  <p className="text-zinc-600 text-xs mt-0.5">
                    Create events & track RSVPs in seconds
                  </p>
                </div>
                <Button size="sm" asChild className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 rounded-lg px-4 text-sm font-medium transition-all">
                  <Link href="/signup">Create Your Own Event →</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Wall of Attendees */}
        <div className="w-full lg:w-[40%] bg-zinc-900/30 backdrop-blur-sm border-l border-zinc-800/50 p-6 lg:p-8">
          <div className="h-full lg:sticky lg:top-8">
            <AttendeesWall 
              eventId={event.id} 
              initialAttendees={attendees?.map(a => ({
                id: a.id,
                full_name: a.full_name,
                payment_confirmed: a.payment_confirmed
              })) || []} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
