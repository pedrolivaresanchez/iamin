'use client'

import { updateEvent, type ActionState } from '@/app/actions'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Spinner } from '@/components/ui/spinner'
import { LocationInput } from '@/components/ui/location-input'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

type Event = {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  price: number | null
  currency: string | null
  payment_link: string | null
}

export default function EditEventDialog({ event }: { event: Event }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await updateEvent({}, formData)
      if (result.error) {
        setError(result.error)
      } else {
        toast.success('Event updated successfully!')
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          Edit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input type="hidden" name="event_id" value={event.id} />
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-300">Event Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={event.title}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-300">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={event.description || ''}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Date & Time</Label>
            <DateTimePicker name="date" defaultValue={event.date} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-zinc-300">Location</Label>
            <LocationInput
              name="location"
              defaultValue={event.location || ''}
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
                defaultValue={event.price || 0}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Currency</Label>
              <Select name="currency" defaultValue={event.currency || 'USD'}>
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
                      {currency.symbol} {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_link" className="text-zinc-300">Payment Link</Label>
            <Input
              type="url"
              id="payment_link"
              name="payment_link"
              defaultValue={event.payment_link || ''}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              placeholder="https://paypal.me/..."
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
