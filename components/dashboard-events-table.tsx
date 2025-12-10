'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CopyLinkButton from '@/app/(admin)/dashboard/copy-link-button'
import ManageButton from '@/app/(admin)/dashboard/manage-button'
import DeleteEventButton from '@/app/(admin)/dashboard/delete-event-button'

type Event = {
  id: string
  title: string
  slug: string
  date: string
  location: string | null
  image_url: string | null
  password: string | null
  enabled: boolean
  created_at: string
}

type Props = {
  events: Event[]
  attendeeCounts: Record<string, number>
}

function formatDate(dateString: string): string {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const [, year, month, day] = match
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }
  return dateString
}

function formatTime(dateString: string): string {
  const match = dateString.match(/T(\d{2}):(\d{2})/)
  if (match) {
    const hour = parseInt(match[1])
    const minute = match[2]
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour < 12 ? 'AM' : 'PM'
    return `${h12}:${minute} ${ampm}`
  }
  return ''
}

export default function DashboardEventsTable({ events, attendeeCounts }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [enabledFilter, setEnabledFilter] = useState<'all' | 'enabled' | 'disabled'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      const searchLower = search.toLowerCase()
      const matchesSearch = !search || 
        event.title.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower)

      // Status filter (past/upcoming)
      const match = event.date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
      const eventDate = match 
        ? new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), parseInt(match[4]), parseInt(match[5]))
        : new Date(event.date)
      const isPast = eventDate < new Date()
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'past' && isPast) ||
        (statusFilter === 'upcoming' && !isPast)

      // Enabled filter
      const matchesEnabled = 
        enabledFilter === 'all' ||
        (enabledFilter === 'enabled' && event.enabled !== false) ||
        (enabledFilter === 'disabled' && event.enabled === false)

      return matchesSearch && matchesStatus && matchesEnabled
    })
  }, [events, search, statusFilter, enabledFilter])

  const GridView = () => (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredEvents.map((event) => {
        const attendeeCount = attendeeCounts[event.id] || 0
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
            {/* Event Image */}
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
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-zinc-100 font-semibold leading-tight line-clamp-1">
                  {event.title}
                </h3>
                <DeleteEventButton eventId={event.id} eventTitle={event.title} />
              </div>

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

              <div className="h-5 mt-2">
                {event.location && (
                  <p className="text-xs text-zinc-500 line-clamp-1">{event.location}</p>
                )}
              </div>

              <div className="flex gap-2 pt-3 mt-auto border-t border-zinc-800">
                <ManageButton eventId={event.id} />
                <CopyLinkButton slug={event.slug} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  const TableView = () => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-800/50 border-b border-zinc-700">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Event</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Date & Time</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Location</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Guests</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredEvents.map((event) => {
              const attendeeCount = attendeeCounts[event.id] || 0
              const match = event.date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
              const eventDate = match 
                ? new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), parseInt(match[4]), parseInt(match[5]))
                : new Date(event.date)
              const isPast = eventDate < new Date()

              return (
                <tr key={event.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden">
                        {event.image_url ? (
                          <Image 
                            src={event.image_url} 
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xl">
                            🎉
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-100 truncate">{event.title}</p>
                        <div className="flex gap-1 mt-1">
                          {event.password && (
                            <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500 px-1.5 py-0">
                              Private
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-zinc-300">{formatDate(event.date)}</p>
                    <p className="text-xs text-zinc-500">{formatTime(event.date)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-zinc-400 truncate max-w-xs">
                      {event.location || '-'}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="secondary" className={`text-xs ${attendeeCount > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                      {attendeeCount}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {isPast && (
                        <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-600 w-fit">
                          Past
                        </Badge>
                      )}
                      {event.enabled === false && (
                        <Badge variant="secondary" className="text-xs bg-red-500/10 text-red-400 border-red-500/20 w-fit">
                          Disabled
                        </Badge>
                      )}
                      {!isPast && event.enabled !== false && (
                        <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-fit">
                          Active
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1 justify-end">
                      <ManageButton eventId={event.id} />
                      <CopyLinkButton slug={event.slug} />
                      <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-[150px] bg-zinc-900 border-zinc-800 text-zinc-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>

        <Select value={enabledFilter} onValueChange={(v) => setEnabledFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-[150px] bg-zinc-900 border-zinc-800 text-zinc-300">
            <SelectValue placeholder="Enabled" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 px-3"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
            </svg>
          </Button>
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="h-8 px-3"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
        </p>
      </div>

      {/* Events */}
      {filteredEvents.length > 0 ? (
        viewMode === 'grid' ? <GridView /> : <TableView />
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-zinc-400 mb-2">No events found</p>
          <p className="text-zinc-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
