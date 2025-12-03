'use client'

import { createEvent, type ActionState } from '@/app/actions'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Spinner } from '@/components/ui/spinner'
import { LocationInput } from '@/components/ui/location-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Spinner className="mr-2" />
          Creating...
        </>
      ) : (
        'Create Event'
      )}
    </Button>
  )
}

export default function NewEventPage() {
  const [state, formAction] = useActionState<ActionState, FormData>(createEvent, {})

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-medium text-zinc-100 mb-6">Create New Event</h1>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-100">Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-300">Event Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                required
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                placeholder="Summer Party 2025"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none"
                placeholder="Tell people what your event is about..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Date & Time</Label>
              <DateTimePicker name="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-zinc-300">Location</Label>
              <LocationInput
                name="location"
                placeholder="Search for a location..."
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-zinc-300">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Currency</Label>
                <Select name="currency" defaultValue="USD">
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {CURRENCIES.map((currency) => (
                      <SelectItem 
                        key={currency.code} 
                        value={currency.code}
                        className="text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100"
                      >
                        {currency.symbol} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-zinc-500 -mt-4">Leave price at 0 for free events</p>

            <div className="space-y-2">
              <Label htmlFor="payment_link" className="text-zinc-300">Payment Link (optional)</Label>
              <Input
                type="url"
                id="payment_link"
                name="payment_link"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                placeholder="https://paypal.me/... or https://revolut.me/..."
              />
              <p className="text-xs text-zinc-500">Stripe, PayPal, Revolut, or any payment link</p>
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
