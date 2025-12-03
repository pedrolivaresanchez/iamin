import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import RegistrationForm from './registration-form'
import AttendeesWall from './attendees-wall'
import AnimatedBackground from './animated-background'
import { Button } from '@/components/ui/button'
import { getCurrencySymbol, getCurrencyFlag } from '@/lib/currencies'
import PaymentPopup from './payment-popup'
import SpotifyEmbed from './spotify-embed'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase()
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
  const totalAttendees = attendees?.length || 0
  const hasMaxSpots = event.max_spots !== null && event.max_spots !== undefined && event.max_spots > 0
  const spotsLeft = hasMaxSpots ? event.max_spots - totalAttendees : null
  const isFull = hasMaxSpots && spotsLeft !== null && spotsLeft <= 0

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <AnimatedBackground />

      {/* Logo - Desktop (top left, fixed) */}
      <Link 
        href="/" 
        className="hidden sm:flex fixed top-6 left-6 z-50 px-4 py-2 rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 hover:border-zinc-600/50 hover:from-zinc-800 hover:to-zinc-900 transition-all shadow-lg shadow-black/20"
      >
        <span className="font-bold text-xl text-zinc-100 tracking-tight">
          🎉 <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">iamin</span>
        </span>
      </Link>

      {/* Logo - Mobile (top right, fixed) */}
      <Link 
        href="/" 
        className="sm:hidden fixed top-4 right-4 z-50 px-4 py-2 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 hover:bg-zinc-800 transition-all shadow-lg"
      >
        <span className="font-bold text-base text-zinc-100 tracking-tight">
          🎉 <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">iamin</span>
        </span>
      </Link>

      <div className="relative flex flex-col lg:flex-row lg:h-screen">
        {/* Left Side - Event Details & Registration */}
        <div className="w-full lg:w-[60%] p-6 pt-6 sm:pt-16 lg:p-12 lg:pt-16 lg:overflow-y-auto lg:h-screen">
          <div className="max-w-lg mx-auto w-full space-y-8">
            {/* Event Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {event.image_url && (
                <div className="relative w-36 h-36 sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden shadow-xl shadow-black/40 ring-1 ring-zinc-800/50">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-100 tracking-tight">
                {event.title}
              </h1>
              {event.host_name && (
                <p className="text-zinc-500 text-sm mt-2">
                  Hosted by <span className="text-zinc-300">{event.host_name}</span>
                </p>
              )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="text-zinc-400 text-sm leading-relaxed prose prose-sm prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:text-zinc-200 prose-strong:text-zinc-200 prose-a:text-emerald-400 max-w-none">
                <ReactMarkdown>{event.description}</ReactMarkdown>
              </div>
            )}

            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-zinc-200 font-medium">{formatDate(event.date)}</p>
                <p className="text-zinc-500 text-sm mt-0.5">{formatTime(event.date)}</p>
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
                  <p className="text-zinc-200 font-medium group-hover:text-white transition-colors">{event.location}</p>
                  <p className="text-zinc-500 text-sm mt-0.5 group-hover:text-zinc-400 transition-colors flex items-center gap-1">
                    View on Maps
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </p>
                </div>
              </a>
            )}


            {/* Spots Info */}
            {hasMaxSpots && (
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${isFull ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'} border flex items-center justify-center shrink-0`}>
                  <svg className={`w-5 h-5 ${isFull ? 'text-red-400' : 'text-amber-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className={`font-medium ${isFull ? 'text-red-400' : 'text-zinc-200'}`}>
                    {isFull ? 'Event Full' : `${spotsLeft} spots left`}
                  </p>
                  <p className="text-zinc-500 text-sm mt-0.5">{totalAttendees} / {event.max_spots} registered</p>
                </div>
              </div>
            )}

            {/* Payment Section */}
            {hasPrice && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/30">
                <p className="text-xs text-emerald-500/70 uppercase tracking-wide font-medium mb-2">Event Price</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCurrencyFlag(event.currency)}</span>
                    <p className="font-bold text-emerald-400 text-2xl">
                      {getCurrencySymbol(event.currency)}{Number(event.price).toFixed(2)}
                    </p>
                    <span className="text-sm text-emerald-500/70">{event.currency || 'USD'}</span>
                  </div>
                  {event.payment_methods && (
                    <PaymentPopup 
                      methods={event.payment_methods}
                      price={Number(event.price)}
                      currency={event.currency || 'USD'}
                      currencySymbol={getCurrencySymbol(event.currency)}
                      eventTitle={event.title}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Spotify Playlist */}
            {event.spotify_url && (
              <SpotifyEmbed url={event.spotify_url} />
            )}

            {/* Registration Form */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 lg:p-8">
              {isFull ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">😢</div>
                  <h2 className="text-xl font-semibold text-zinc-100 mb-1">Event Full</h2>
                  <p className="text-sm text-zinc-500">All spots have been taken</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-zinc-100 mb-1">Join this event</h2>
                  <p className="text-sm text-zinc-500 mb-6">Fill in your details to register</p>
                  <RegistrationForm event={{
                      id: event.id,
                      title: event.title,
                      description: event.description,
                      date: event.date,
                      location: event.location,
                    }} />
                </>
              )}
            </div>

            {/* Footer CTA - Desktop only */}
            <div className="hidden lg:block mt-auto pt-8 border-t border-zinc-800/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                  <p className="text-zinc-500 text-sm">
                    Powered by <span className="font-semibold text-zinc-300">🎉 iamin</span>
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
        <div className="w-full lg:w-[40%] lg:h-screen lg:overflow-y-auto bg-zinc-900/30 backdrop-blur-sm border-l border-zinc-800/50 p-6 pb-12 lg:p-8 lg:pb-16">
          <div className="h-full">
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
