'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type WaitlistEntry = {
  id: string
  full_name: string
  phone: string
  message: string | null
  created_at: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function WaitlistTable({ waitlist }: { waitlist: WaitlistEntry[] }) {
  const [search, setSearch] = useState('')

  const filteredWaitlist = waitlist.filter(entry => {
    const searchLower = search.toLowerCase()
    return !search || 
      entry.full_name.toLowerCase().includes(searchLower) ||
      entry.phone.toLowerCase().includes(searchLower)
  })

  if (waitlist.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl">
        <span className="text-2xl mb-2 block">📋</span>
        <p className="text-zinc-400 text-sm">No waitlist entries yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          type="text"
          placeholder="Search waitlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-9"
        />
      </div>

      <p className="text-sm text-zinc-500">
        {filteredWaitlist.length} {filteredWaitlist.length === 1 ? 'person' : 'people'} on waitlist
      </p>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400 font-medium">Name</TableHead>
              <TableHead className="text-zinc-400 font-medium">Phone</TableHead>
              <TableHead className="text-zinc-400 font-medium">Message</TableHead>
              <TableHead className="text-zinc-400 font-medium">Requested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWaitlist.map((entry) => (
              <TableRow key={entry.id} className="border-zinc-800/50">
                <TableCell>
                  <span className="font-medium text-zinc-100">{entry.full_name}</span>
                </TableCell>
                <TableCell>
                  <a 
                    href={`tel:${entry.phone}`}
                    className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    {entry.phone}
                  </a>
                </TableCell>
                <TableCell>
                  {entry.message ? (
                    <span className="text-sm text-zinc-400 line-clamp-2">{entry.message}</span>
                  ) : (
                    <span className="text-xs text-zinc-600 italic">No message</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-zinc-500">{formatDate(entry.created_at)}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
