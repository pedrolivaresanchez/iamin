import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CreateEventButton from './create-event-button'
import DashboardEventsTable from '@/components/dashboard-events-table'

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
        <DashboardEventsTable events={events} attendeeCounts={countMap} />
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
