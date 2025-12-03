'use client'

import { updateEvent, type ActionState } from '@/app/actions'
import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Spinner } from '@/components/ui/spinner'
import { LocationInput } from '@/components/ui/location-input'
import { PaymentMethodsDialog, PaymentMethodsInputs, type PaymentMethods } from '@/components/ui/payment-methods-dialog'
import { toast } from 'sonner'
import Image from 'next/image'
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

const TABS = [
  { id: 'basics', label: 'Basics' },
  { id: 'details', label: 'Details' },
  { id: 'settings', label: 'Settings' },
]

type Event = {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  host_name: string | null
  price: number | null
  currency: string | null
  payment_methods: PaymentMethods | null
  image_url: string | null
  spotify_url: string | null
  max_spots: number | null
  password: string | null
}

export default function EditEventDialog({ event }: { event: Event }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('basics')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [imagePreview, setImagePreview] = useState<string | null>(event.image_url)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>(event.payment_methods || {})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await updateEvent({}, formData)
      if (result.error) {
        setError(result.error)
      } else {
        toast.success('Event updated!')
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
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-xl p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-lg">Edit Event</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-zinc-100 text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <input type="hidden" name="event_id" value={event.id} />
          <input type="hidden" name="existing_image_url" value={imagePreview === event.image_url ? (event.image_url || '') : ''} />
          <PaymentMethodsInputs methods={paymentMethods} />
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basics Tab */}
          <div className={activeTab === 'basics' ? 'space-y-4' : 'hidden'}>
            {/* Image Upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-32 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all cursor-pointer overflow-hidden group"
            >
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm">Change image</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage() }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">Click to upload</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleImageChange} className="hidden" />

            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Title</Label>
              <Input
                type="text"
                name="title"
                required
                defaultValue={event.title}
                className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Description</Label>
              <Textarea
                name="description"
                rows={3}
                defaultValue={event.description || ''}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Host Name</Label>
              <Input
                type="text"
                name="host_name"
                defaultValue={event.host_name || ''}
                className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Details Tab */}
          <div className={activeTab === 'details' ? 'space-y-4' : 'hidden'}>
            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Date & Time</Label>
              <DateTimePicker name="date" defaultValue={event.date} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Location</Label>
              <LocationInput
                name="location"
                defaultValue={event.location || ''}
                placeholder="Search for a location..."
                className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Spotify Playlist</Label>
              <Input
                type="url"
                name="spotify_url"
                defaultValue={event.spotify_url || ''}
                className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
                placeholder="https://open.spotify.com/playlist/..."
              />
            </div>
          </div>

          {/* Settings Tab */}
          <div className={activeTab === 'settings' ? 'space-y-4' : 'hidden'}>
            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Price</Label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  defaultValue={event.price || 0}
                  className="flex-1 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
                />
                <Select name="currency" defaultValue={event.currency || 'USD'}>
                  <SelectTrigger className="w-28 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code} className="text-zinc-100 focus:bg-zinc-700">
                        {c.symbol} {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Payment Methods</Label>
              <PaymentMethodsDialog value={paymentMethods} onChange={setPaymentMethods} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Max Spots</Label>
              <Input
                type="number"
                name="max_spots"
                min="1"
                defaultValue={event.max_spots || ''}
                className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
                placeholder="Unlimited"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400 text-xs">Event Password</Label>
              <Input
                type="text"
                name="password"
                defaultValue={event.password || ''}
                className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
                placeholder="Leave empty for public"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full h-11 mt-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium"
          >
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
