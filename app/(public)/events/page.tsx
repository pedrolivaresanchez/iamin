import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { List, Search, Calendar, MapPin, ArrowRight } from 'lucide-react'
import { EventFilters } from './event-filters'
import { EventCard } from './event-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCurrencySymbol } from '@/lib/currencies'

export const revalidate = 60
const PAGE_SIZE = 12

type SearchParams = Promise<{
  city?: string
  q?: string
  price?: string
  sort?: string
  page?: string
}>

function formatDate(dateString: string) {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const [, year, month, day] = match
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }
  const parsed = new Date(dateString)
  return isNaN(parsed.getTime()) ? dateString : parsed.toDateString()
}

function formatPrice(price: number | null, currency?: string | null) {
  if (price === null || price === undefined || Number(price) <= 0) return 'Free'
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${Number(price).toFixed(2)}`
}

export default async function PublicEventsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const city = params?.city?.trim() || ''
  const queryText = params?.q?.trim() || ''
  const price = params?.price === 'free' || params?.price === 'paid' ? params.price : 'all'
  const sort = params?.sort === 'new' ? 'new' : 'soon'
  const page = Math.max(1, parseInt(params?.page || '1', 10) || 1)

  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let eventsQuery = supabase
    .from('events')
    .select(
      'id,title,description,date,location,price,currency,image_url,slug,max_spots,enabled,password,created_at',
      { count: 'exact' }
    )
    .eq('enabled', true)
    .is('password', null)
    .gte('date', new Date().toISOString())

  if (city) {
    eventsQuery = eventsQuery.ilike('location', `%${city}%`)
  }

  if (queryText) {
    eventsQuery = eventsQuery.or(
      `title.ilike.%${queryText}%,description.ilike.%${queryText}%`
    )
  }

  if (price === 'free') {
    eventsQuery = eventsQuery.lte('price', 0)
  } else if (price === 'paid') {
    eventsQuery = eventsQuery.gt('price', 0)
  }

  const { data: events, count, error } = await eventsQuery
    .order(sort === 'new' ? 'created_at' : 'date', { ascending: sort === 'soon' })
    .range(from, to)

  if (error) {
    console.error('Error fetching public events', error)
  }

  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1

  const buildParams = (overrides: Record<string, string | undefined>) => {
    const qs = new URLSearchParams()
    if (city) qs.set('city', city)
    if (queryText) qs.set('q', queryText)
    if (price) qs.set('price', price)
    if (sort) qs.set('sort', sort)
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined || v === '') {
        qs.delete(k)
      } else {
        qs.set(k, v)
      }
    })
    return qs.toString()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-emerald-500/20 overflow-x-hidden">
      {/* Navbar - exact landing page copy */}
      <div className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center">
        <nav className="w-full max-w-5xl bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 h-14 flex items-center justify-between shadow-2xl shadow-black/50 ring-1 ring-white/5">
          <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🎉</span>
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">iamin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Button asChild size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-full px-5 font-medium h-9 transition-transform hover:scale-105">
              <Link href="/signup">
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-[30%,1fr] gap-8 items-start">
          
          {/* Sticky Filters Sidebar (30%) */}
          <aside className="hidden lg:block sticky top-32 space-y-6">
            <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 shadow-lg">
              <EventFilters />
            </div>
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-8">
            <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6">
              <EventFilters />
            </div>
          </div>

          {/* Events Grid (70%) */}
          <div className="min-h-[500px] space-y-6">
            <div className="flex items-baseline justify-between pb-2 border-b border-white/5">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {count ?? 0} Events Found
                {city && <span className="text-zinc-500 font-normal ml-2 text-lg">in {city}</span>}
              </h1>
            </div>

            <div className="animate-in fade-in duration-500">
              {!events?.length ? (
                <div className="flex flex-col items-center justify-center py-32 px-4 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-zinc-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
                  <p className="text-zinc-400 max-w-md mx-auto mb-6">
                    Adjust your filters to find what you're looking for.
                  </p>
                  <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white">
                    <Link href="/events">Clear filters</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {events.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    asChild
                    className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 disabled:opacity-50 h-10 px-4 rounded-full"
                  >
                    <Link
                      href={`/events?${buildParams({
                        page: String(Math.max(1, page - 1)),
                      })}`}
                    >
                      Previous
                    </Link>
                  </Button>
                  <div className="text-sm font-medium text-zinc-500 px-4">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    asChild
                    className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 disabled:opacity-50 h-10 px-4 rounded-full"
                  >
                    <Link
                      href={`/events?${buildParams({
                        page: String(Math.min(totalPages, page + 1)),
                      })}`}
                    >
                      Next
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
