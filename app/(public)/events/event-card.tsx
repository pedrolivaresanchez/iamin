'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCurrencySymbol } from '@/lib/currencies'

interface EventCardProps {
  event: {
    id: string
    title: string
    description?: string | null
    date: string
    location?: string | null
    price?: number | null
    currency?: string | null
    image_url?: string | null
    slug: string
  }
  onMapClickUrl?: string
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatPrice(price?: number | null, currency?: string | null) {
  if (price === null || price === undefined || Number(price) <= 0) return 'Free'
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${Number(price).toFixed(2)}`
}

export function EventCard({ event, onMapClickUrl }: EventCardProps) {
  return (
    <div className="group relative bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant="secondary" 
            className="bg-black/60 backdrop-blur-md border-white/10 text-white px-3 py-1 font-medium"
          >
            {formatPrice(event.price, event.currency)}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calendar className="w-3 h-3" />
            {formatDate(event.date)}
          </div>
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {event.title}
          </h3>
        </div>

        {event.description && (
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-grow">
            {event.description}
          </p>
        )}

        <div className="space-y-3 mt-auto border-t border-white/5 pt-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(event.date)}
            </div>
            {event.location && (
              <div className="flex items-center gap-1.5 max-w-[60%]">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 text-xs h-9"
            >
              <Link href={`/e/${event.slug}`}>Details</Link>
            </Button>
            {onMapClickUrl ? (
              <Button 
                asChild
                size="sm" 
                className="w-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 text-xs h-9"
              >
                <Link href={onMapClickUrl}>
                  Map View
                </Link>
              </Button>
            ) : (
              <Button 
                asChild
                size="sm" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 shadow-lg shadow-emerald-900/20"
              >
                <Link href={`/e/${event.slug}`}>
                  Register <ArrowRight className="w-3 h-3 ml-1.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


