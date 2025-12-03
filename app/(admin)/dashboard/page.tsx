import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CopyLinkButton from './copy-link-button'
import ManageButton from './manage-button'
import CreateEventButton from './create-event-button'

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
            const isPast = new Date(event.date) < new Date()
            
            return (
              <Card 
                key={event.id} 
                className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800/50 transition-colors group flex flex-col overflow-hidden"
              >
                <CardHeader className="pb-3 px-5 pt-5">
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-zinc-100 text-lg leading-tight">
                      {event.title}
                    </CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`shrink-0 text-sm ${
                        attendeeCount > 0 
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-900' 
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {attendeeCount} {attendeeCount === 1 ? 'guest' : 'guests'}
                    </Badge>
                  </div>
                  {event.description && (
                    <CardDescription className="text-zinc-500 line-clamp-2 mt-2 text-sm">
                      {event.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pb-4 px-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <span>📅</span>
                      <span className={isPast ? 'text-zinc-500' : ''}>{new Date(event.date).toLocaleDateString()}</span>
                      {isPast && <span className="text-zinc-600">(Past)</span>}
                    </div>
                    {event.location && (
                      <div className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="shrink-0">📍</span>
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-3 px-5 pb-5 border-t border-zinc-800 mt-auto gap-2">
                  <ManageButton eventId={event.id} />
                  <CopyLinkButton slug={event.slug} />
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-5xl mb-4">🎉</div>
            <p className="text-zinc-400 mb-2">No events yet</p>
            <p className="text-zinc-500 text-sm mb-6">Create your first event to get started</p>
            <Button asChild>
              <Link href="/events/new">Create your first event →</Link>
            </Button>
          </CardContent>
        </Card>
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
