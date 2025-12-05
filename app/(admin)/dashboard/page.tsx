import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CopyLinkButton from './copy-link-button'
import ManageButton from './manage-button'
import CreateEventButton from './create-event-button'
import DeleteEventButton from './delete-event-button'

function formatDate(dateString: string): string {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const [, year, month, day] = match
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }
  return dateString
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('created_by', user?.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
  }

  // Fetch attendee counts for each event
  const eventIds = events?.map(e => e.id) || []
  const { data: attendeeCounts } = await supabase
    .from('attendees')
    .select('event_id')
    .in('event_id', eventIds)

  const countMap = attendeeCounts?.reduce((acc, curr) => {
    acc[curr.event_id] = (acc[curr.event_id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div>
      <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-medium text-zinc-100">Your Events</h1>
          <p className="text-zinc-500 text-sm sm:text-base mt-1">Manage and track your events</p>
        </div>
        <div className="hidden sm:block">
          <CreateEventButton />
        </div>
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const attendeeCount = countMap[event.id] || 0
            const match = event.date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
            const eventDate = match 
              ? new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), parseInt(match[4]), parseInt(match[5]))
              : new Date(event.date)
            const isPast = eventDate < new Date()
            
            return (
              <div 
                key={event.id} 
                className="bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-colors group overflow-hidden flex flex-col"
              >
                {/* Event Image - consistent height */}
                <div className="relative h-36 w-full shrink-0">
                  {event.image_url ? (
                    <>
                      <Image 
                        src={event.image_url} 
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <span className="text-4xl opacity-30">🎉</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Title & Actions */}
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-zinc-100 font-semibold leading-tight line-clamp-1">
                      {event.title}
                    </h3>
                    <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Badge variant="secondary" className={`text-xs ${isPast ? 'bg-zinc-800 text-zinc-500' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'}`}>
                      {formatDate(event.date)}
                    </Badge>
                    <Badge variant="secondary" className={`text-xs ${attendeeCount > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                      {attendeeCount} {attendeeCount === 1 ? 'guest' : 'guests'}
                    </Badge>
                    {isPast && (
                      <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-600">
                        Past
                      </Badge>
                    )}
                    {event.password && (
                      <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500">
                        Private
                      </Badge>
                    )}
                    {event.enabled === false && (
                      <Badge variant="secondary" className="text-xs bg-red-500/10 text-red-400 border-red-500/20">
                        Disabled
                      </Badge>
                    )}
                  </div>

                  {/* Location - fixed height area */}
                  <div className="h-5 mt-2">
                    {event.location && (
                      <p className="text-xs text-zinc-500 line-clamp-1">{event.location}</p>
                    )}
                  </div>

                  {/* Actions - pushed to bottom */}
                  <div className="flex gap-2 pt-3 mt-auto border-t border-zinc-800">
                    <ManageButton eventId={event.id} />
                    <CopyLinkButton slug={event.slug} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-5xl mb-4">🎉</div>
          <p className="text-zinc-400 mb-2">No events yet</p>
          <p className="text-zinc-500 text-sm mb-6">Create your first event to get started</p>
          <Button asChild>
            <Link href="/events/new">Create your first event →</Link>
          </Button>
        </div>
      )}

      {/* Mobile FAB */}
      <Link 
        href="/events/new"
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center shadow-lg shadow-black/30 hover:bg-white transition-all active:scale-95 text-2xl"
      >
        +
      </Link>
    </div>
  )
}
