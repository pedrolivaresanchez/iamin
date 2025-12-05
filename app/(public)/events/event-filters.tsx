'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'

export function EventFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      if (name !== 'page') {
        params.set('page', '1')
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = (term: string) => {
    startTransition(() => {
      router.push(`/events?${createQueryString('q', term)}`)
    })
  }

  const handleCity = (term: string) => {
    startTransition(() => {
      router.push(`/events?${createQueryString('city', term)}`)
    })
  }

  const handlePrice = (value: string) => {
    startTransition(() => {
      router.push(`/events?${createQueryString('price', value)}`)
    })
  }

  const handleSort = (value: string) => {
    startTransition(() => {
      router.push(`/events?${createQueryString('sort', value)}`)
    })
  }

  const currentPrice = searchParams.get('price') || 'all'
  const currentSort = searchParams.get('sort') || 'soon'
  const currentCity = searchParams.get('city') || ''
  const currentQ = searchParams.get('q') || ''

  return (
    <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-5 space-y-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-white border-b border-white/5 pb-4">
        <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
        Filter Events
      </div>

      {/* Search */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Search</label>
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
          <Input
            placeholder="Event name..."
            defaultValue={currentQ}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-9 bg-zinc-900 border-zinc-800 text-sm focus:border-zinc-700 focus:ring-0 transition-all rounded-lg"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">City</label>
        <div className="relative group">
          <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
          <Input
            placeholder="Where?"
            defaultValue={currentCity}
            onChange={(e) => handleCity(e.target.value)}
            className="pl-9 h-9 bg-zinc-900 border-zinc-800 text-sm focus:border-zinc-700 focus:ring-0 transition-all rounded-lg"
          />
        </div>
      </div>

      {/* Price */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Price</label>
        <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          {['all', 'free', 'paid'].map((price) => (
            <button
              key={price}
              onClick={() => handlePrice(price)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                currentPrice === price
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {price.charAt(0).toUpperCase() + price.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Sort by</label>
        <select
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
          className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-all appearance-none cursor-pointer hover:text-white"
        >
          <option value="soon">Date: Soonest first</option>
          <option value="new">Added: Newest first</option>
        </select>
      </div>

      {isPending && (
        <div className="pt-2">
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-600 animate-progress w-1/3 rounded-full" />
          </div>
        </div>
      )}
    </div>
  )
}
