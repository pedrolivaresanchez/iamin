'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import ShareButton from './share-button'
import Link from 'next/link'

type Attendee = {
  id: string
  full_name: string
  payment_confirmed: boolean
}

const FUN_EMOJIS = [
  '🥳', '🎉', '🚀', '🍾', '✨', '🔥', '💃', '🕺', '🎊', '🌟', 
  '⚡', '🎯', '🎪', '🎸', '🎤', '🎧', '🎨', '🎭', '🎬', '🎮',
  '🏆', '🎁', '💎', '🌈', '🦄', '🐉', '🦋', '🌸', '🍀', '🌴'
]

const WITTY_UNPAID = [
  "Wallet's warming up 😅",
  "Money incoming! 💸",
  "Saving for snacks 🍿",
  "Piggy bank raid 🐷",
  "Counting coins... 🪙",
  "Asking mom for cash 📞",
  "Selling old socks 🧦",
  "Checking couch cushions 🛋️",
  "Crypto crashed again 📉",
  "Card declined era 💳",
  "Waiting for payday 📅",
  "Budget vibes only 💅",
  "Venmo pending... ⏳",
  "Bank app loading 🔄",
  "Rich in spirit 🙏",
  "Trust fund pending 👑",
  "Will pay in hugs 🤗",
  "IOU energy 📝",
  "Manifesting funds ✨",
  "Broke but make it fashion 💁",
  "Payment plot twist 🎬",
  "Financially quirky 🦋",
  "Sugar daddy MIA 🍬",
  "Rent came first 🏠",
  "Avocado toast victim 🥑",
  "Student loan survivor 🎓",
  "Coffee > payments ☕",
  "Netflix ate my money 📺",
  "Uber Eats trauma 🍔",
  "Wine fund depleted 🍷",
  "Gym membership regret 🏋️",
  "Plant parent expenses 🪴",
  "Cat demanded treats 🐱",
  "Dog needed sweater 🐕",
  "Spotify wrapped me 🎵",
  "Amazon cart attack 📦",
  "Sale shopping casualty 🛍️",
  "Brunch bankruptcy 🥞",
  "Oat milk premium 🥛",
  "Therapy session funds 🧠",
]

function getUniqueEmoji(usedEmojis: Set<string>): string {
  const available = FUN_EMOJIS.filter(e => !usedEmojis.has(e))
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)]
  }
  return FUN_EMOJIS[Math.floor(Math.random() * FUN_EMOJIS.length)]
}

function getWittyPhrase(id: string): string {
  const index = id.charCodeAt(0) % WITTY_UNPAID.length
  return WITTY_UNPAID[index]
}

export default function AttendeesWall({ 
  eventId, 
  initialAttendees,
}: { 
  eventId: string
  initialAttendees: Attendee[]
}) {
  const [attendees, setAttendees] = useState(initialAttendees)
  const [emojiMap, setEmojiMap] = useState<Record<string, string>>({})

  useEffect(() => {
    const initialEmojis: Record<string, string> = {}
    const usedEmojis = new Set<string>()
    initialAttendees.forEach(a => {
      const emoji = getUniqueEmoji(usedEmojis)
      initialEmojis[a.id] = emoji
      usedEmojis.add(emoji)
    })
    setEmojiMap(initialEmojis)
    setAttendees(initialAttendees)
  }, [initialAttendees])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`attendees-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'attendees',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const newAttendee = payload.new as Attendee
          setAttendees((current) => [newAttendee, ...current])
          setEmojiMap((current) => {
            const usedEmojis = new Set(Object.values(current))
            return {
              ...current,
              [newAttendee.id]: getUniqueEmoji(usedEmojis)
            }
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'attendees',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const updatedAttendee = payload.new as Attendee
          setAttendees((current) =>
            current.map((a) => (a.id === updatedAttendee.id ? updatedAttendee : a))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center">
              <span className="animate-pulse">🎉</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Who&apos;s coming</h2>
              <p className="text-sm text-zinc-500">
                {attendees.length > 0 
                  ? `${attendees.length} ${attendees.length === 1 ? 'person' : 'people'} registered`
                  : 'Be the first to join!'
                }
              </p>
            </div>
          </div>
          <ShareButton />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {attendees.length > 0 ? (
          attendees.map((attendee, index) => (
            <div
              key={attendee.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                {emojiMap[attendee.id] || '🎉'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-200 truncate">
                  {attendee.full_name}
                </p>
                {!attendee.payment_confirmed && (
                  <p className="text-xs text-amber-500/70 truncate">
                    {getWittyPhrase(attendee.id)}
                  </p>
                )}
              </div>
              {attendee.payment_confirmed ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Paid ✓
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                  Not Paid
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👋</div>
            <p className="text-zinc-400 font-medium">No one here yet</p>
            <p className="text-zinc-600 text-sm mt-1">Be the first to register!</p>
          </div>
        )}
      </div>

      {/* Powered by - Mobile only */}
      <div className="lg:hidden mt-6 pt-6 border-t border-zinc-800/50 text-center">
        <p className="text-zinc-500 text-sm">Powered by <span className="text-zinc-300 font-medium">🎉 IamIn</span></p>
        <p className="text-zinc-600 text-xs mt-1">Create events & track RSVPs in seconds</p>
        <Link 
          href="/signup"
          className="inline-block mt-3 px-4 py-2 text-sm font-medium text-zinc-900 bg-zinc-100 hover:bg-white rounded-lg transition-colors"
        >
          Create Your Own Event →
        </Link>
      </div>
    </div>
  )
}
