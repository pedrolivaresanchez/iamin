'use client'

import { registerAttendee, type ActionState } from '@/app/actions'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { CountryCodePicker } from '@/components/ui/country-code-picker'
import { generateGoogleCalendarUrl, downloadIcsFile, addHoursToDate } from '@/lib/calendar'
import PaymentPopup from './payment-popup'
import confetti from 'canvas-confetti'

type EventDetails = {
  id: string
  title: string
  description?: string | null
  date: string
  location?: string | null
}

type PaymentDetails = {
  price: number
  currency: string
  currencySymbol: string
  methods?: Record<string, unknown>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full h-12 text-base font-medium bg-zinc-100 text-zinc-900 hover:bg-white transition-all hover:scale-[1.02]"
    >
      {pending ? (
        <>
          <Spinner className="mr-2" />
          Registering...
        </>
      ) : (
        "Count me in! 🎉"
      )}
    </Button>
  )
}

export default function RegistrationForm({ event, payment }: { event: EventDetails; payment?: PaymentDetails }) {
  const [state, formAction] = useActionState<ActionState, FormData>(registerAttendee, {})
  const formRef = useRef<HTMLFormElement>(null)
  const hasTriggeredConfetti = useRef(false)
  const router = useRouter()
  const [countryCode, setCountryCode] = useState('+971')

  useEffect(() => {
    if (state.success && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true
      
      router.refresh()
      
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [state.success, router])

  const handleAddToGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl({
      title: event.title,
      description: event.description || undefined,
      location: event.location || undefined,
      startDate: event.date,
      endDate: addHoursToDate(event.date, 3),
    })
    window.open(url, '_blank')
  }

  const handleDownloadIcs = () => {
    downloadIcsFile({
      title: event.title,
      description: event.description || undefined,
      location: event.location || undefined,
      startDate: event.date,
      endDate: addHoursToDate(event.date, 3),
    })
  }

  if (state.success) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-4 animate-bounce">🎊</div>
        <h3 className="font-bold text-2xl text-zinc-100">You&apos;re on the list!</h3>
        <p className="text-zinc-400 mt-2 mb-6">Can&apos;t wait to see you there</p>
        
        {/* Payment Section - shown only after registration */}
        {payment && payment.methods && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/30">
            <p className="text-xs text-emerald-500/70 uppercase tracking-wide font-medium mb-3">Complete Your Payment</p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <p className="font-bold text-emerald-400 text-2xl">
                {payment.currencySymbol}{payment.price.toFixed(2)}
              </p>
              <span className="text-sm text-emerald-500/70">{payment.currency}</span>
            </div>
            <PaymentPopup 
              methods={payment.methods as Parameters<typeof PaymentPopup>[0]['methods']}
              price={payment.price}
              currency={payment.currency}
              currencySymbol={payment.currencySymbol}
              eventTitle={event.title}
            />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-zinc-500 text-sm mb-3">Add to your calendar</p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleAddToGoogleCalendar}
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-lg"
            >
              📅 Google
            </Button>
            <Button
              onClick={handleDownloadIcs}
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-lg"
            >
              📱 Apple / Other
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="event_id" value={event.id} />
      
      {state.error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-zinc-400 text-sm">Your name</Label>
        <Input
          type="text"
          id="full_name"
          name="full_name"
          required
          className="h-12 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 rounded-xl placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-zinc-600"
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-zinc-400 text-sm">Phone number</Label>
        <div className="flex gap-2">
          <CountryCodePicker 
            value={countryCode} 
            onChange={setCountryCode}
            name="country_code"
          />
          <Input
            type="tel"
            id="phone"
            name="phone"
            required
            className="flex-1 h-12 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 rounded-xl placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-zinc-600"
            placeholder="50 123 4567"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
