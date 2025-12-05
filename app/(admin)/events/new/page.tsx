'use client'

import { createEvent, type ActionState } from '@/app/actions'
import { useActionState, useState, useRef, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Spinner } from '@/components/ui/spinner'
import { LocationInput } from '@/components/ui/location-input'
import { PaymentMethodsDialog, PaymentMethodsInputs, type PaymentMethods } from '@/components/ui/payment-methods-dialog'
import Image from 'next/image'
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

const STEPS = [
  { id: 1, name: 'Basics' },
  { id: 2, name: 'Details' },
  { id: 3, name: 'Settings' },
]

type EventData = {
  title: string
  description: string
  image: string | null
  date: Date | null
  location: string
  hostName: string
  price: string
  currency: string
  maxSpots: string
  password: string
  spotifyUrl: string
  paymentMethods: PaymentMethods
  enabled: boolean
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium"
    >
      {pending ? (
        <>
          <Spinner className="mr-2" />
          Creating your event...
        </>
      ) : (
        '🎉 Create Event'
      )}
    </Button>
  )
}

function formatPreviewDate(date: Date | null): string {
  if (!date) return 'Tomorrow'
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function formatPreviewTime(date: Date | null): string {
  if (!date) return ''
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase()
}

// Live Preview Component
function EventPreview({ data }: { data: EventData }) {
  const currencySymbol = CURRENCIES.find(c => c.code === data.currency)?.symbol || '$'
  
  return (
    <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden">
      {/* Preview Content */}
      <div className="p-5 space-y-4">
        {/* Image */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800/80">
          {data.image ? (
            <Image src={data.image} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-700">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Title & Host */}
        <div>
          <h3 className="text-xl font-bold text-zinc-100 leading-tight">
            {data.title || <span className="text-zinc-600">Your Event Title</span>}
          </h3>
          {data.hostName && (
            <p className="text-zinc-500 text-sm mt-1.5">
              Hosted by <span className="text-zinc-300">{data.hostName}</span>
            </p>
          )}
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">{data.description}</p>
        )}

        {/* Date & Location */}
        <div className="space-y-1.5 pt-2 text-sm">
          <p className="text-zinc-300">
            {formatPreviewDate(data.date)}
            {data.date && <span className="text-zinc-500 ml-2">{formatPreviewTime(data.date)}</span>}
          </p>
          {data.location && (
            <p className="text-zinc-400 truncate">{data.location}</p>
          )}
        </div>

        {/* Price & Spots */}
        <div className="flex items-center gap-2 pt-2">
          {Number(data.price) > 0 ? (
            <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm font-semibold">
              {currencySymbol}{data.price}
            </span>
          ) : (
            <span className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-xl text-sm font-medium">
              Free
            </span>
          )}
          {data.maxSpots && (
            <span className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-xl text-sm">
              {data.maxSpots} spots
            </span>
          )}
          {data.password && (
            <span className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-xl text-sm">
              🔒
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewEventPage() {
  const [state, formAction] = useActionState<ActionState, FormData>(createEvent, {})
  const [step, setStep] = useState(1)
  // Default to tomorrow at 7pm
  const getDefaultDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(19, 0, 0, 0)
    return d
  }

  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: '',
    image: null,
    date: getDefaultDate(),
    location: '',
    hostName: '',
    price: '0',
    currency: 'USD',
    maxSpots: '',
    password: '',
    spotifyUrl: '',
    paymentMethods: {},
  enabled: true,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEventData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setEventData(prev => ({ ...prev, image: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const updateField = (field: keyof EventData, value: string | Date | null | PaymentMethods) => {
    setEventData(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    if (step === 1) return eventData.title.trim().length > 0
    return true
  }

  const nextStep = () => {
    if (step < 3 && canProceed()) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-x-hidden">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-1 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-1.5">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
                step === s.id
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : step > s.id
                  ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 cursor-pointer'
                  : 'text-zinc-600 cursor-default'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === s.id 
                  ? 'bg-zinc-100 text-zinc-900' 
                  : step > s.id 
                  ? 'bg-zinc-700 text-zinc-300' 
                  : 'bg-zinc-800 text-zinc-600'
              }`}>{s.id}</span>
              <span className="font-medium hidden sm:inline">{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <form ref={formRef} action={formAction} className="space-y-6">
              {state.error && (
                <Alert variant="destructive">
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              {/* Hidden inputs for form submission */}
              <input type="hidden" name="title" value={eventData.title} />
              <input type="hidden" name="description" value={eventData.description} />
              <input type="hidden" name="location" value={eventData.location} />
              <input type="hidden" name="host_name" value={eventData.hostName} />
              <input type="hidden" name="price" value={eventData.price} />
              <input type="hidden" name="currency" value={eventData.currency} />
              <input type="hidden" name="max_spots" value={eventData.maxSpots} />
              <input type="hidden" name="password" value={eventData.password} />
              <input type="hidden" name="spotify_url" value={eventData.spotifyUrl} />
              <input type="hidden" name="enabled" value={eventData.enabled ? 'true' : 'false'} />
              <PaymentMethodsInputs methods={eventData.paymentMethods} />

              {/* Step 1: Basics */}
              <div className={step === 1 ? 'block' : 'hidden'}>
                <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-hidden">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-100 mb-1">Let&apos;s start with the basics</h2>
                    <p className="text-sm text-zinc-500">What&apos;s your event about?</p>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Cover Image</Label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-full aspect-video rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all cursor-pointer overflow-hidden group"
                    >
                      {eventData.image ? (
                        <>
                          <Image
                            src={eventData.image}
                            alt="Event preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Change image</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage()
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 group-hover:text-zinc-400 transition-colors">
                          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium">Click to upload cover image</span>
                          <span className="text-xs text-zinc-600 mt-1">Recommended: 16:9 ratio</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-zinc-300">Event Title *</Label>
                    <Input
                      type="text"
                      id="title"
                      value={eventData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className="h-12 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl text-lg truncate"
                      placeholder="Summer Beach Party 🏖️"
                      maxLength={100}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-zinc-300">Description</Label>
                    <Textarea
                      id="description"
                      value={eventData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={3}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl resize-none max-h-32 overflow-y-auto"
                      placeholder="Tell people what to expect at your event..."
                      maxLength={1000}
                    />
                  </div>

                  {/* Host Name */}
                  <div className="space-y-2">
                    <Label htmlFor="host_name" className="text-zinc-300">Your Name</Label>
                    <Input
                      type="text"
                      id="host_name"
                      value={eventData.hostName}
                      onChange={(e) => updateField('hostName', e.target.value)}
                      className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl truncate"
                      placeholder="John Doe"
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Details */}
              <div className={step === 2 ? 'block' : 'hidden'}>
                <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-hidden">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-100 mb-1">When and where?</h2>
                    <p className="text-sm text-zinc-500">Set the date, time, and location</p>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Date & Time *</Label>
                    <DateTimePicker name="date" />
                  </div>

                  {/* Location */}
                  <div className="space-y-2 overflow-hidden">
                    <Label htmlFor="location" className="text-zinc-300">Location</Label>
                    <LocationInput
                      name="location_search"
                      value={eventData.location}
                      onChange={(value) => updateField('location', value)}
                      placeholder="Search for a venue..."
                      className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl truncate"
                    />
                  </div>

                  {/* Spotify */}
                  <div className="space-y-2 overflow-hidden">
                    <Label htmlFor="spotify_url" className="text-zinc-300">Spotify Playlist</Label>
                    <Input
                      type="url"
                      id="spotify_url"
                      value={eventData.spotifyUrl}
                      onChange={(e) => updateField('spotifyUrl', e.target.value)}
                      className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl truncate"
                      placeholder="https://open.spotify.com/playlist/..."
                    />
                    <p className="text-xs text-zinc-600">Share your party playlist with guests</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Settings */}
              <div className={step === 3 ? 'block' : 'hidden'}>
                <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-hidden">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-100 mb-1">Final settings</h2>
                    <p className="text-sm text-zinc-500">Pricing, capacity, and access</p>
                  </div>

                  {/* Price & Currency */}
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Ticket Price</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={eventData.price}
                        onChange={(e) => updateField('price', e.target.value)}
                        min="0"
                        step="0.01"
                        className="flex-1 h-12 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
                        placeholder="0.00"
                      />
                      <Select value={eventData.currency} onValueChange={(v) => updateField('currency', v)}>
                        <SelectTrigger className="w-28 h-12 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl">
                          <SelectValue />
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
                    <p className="text-xs text-zinc-600">Leave at 0 for free events</p>
                  </div>

                  {/* Payment Methods */}
                  {Number(eventData.price) > 0 && (
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Payment Methods</Label>
                      <PaymentMethodsDialog 
                        value={eventData.paymentMethods} 
                        onChange={(methods) => updateField('paymentMethods', methods)} 
                      />
                    </div>
                  )}

                  {/* Max Spots */}
                  <div className="space-y-2">
                    <Label htmlFor="max_spots" className="text-zinc-300">Capacity Limit</Label>
                    <Input
                      type="number"
                      id="max_spots"
                      value={eventData.maxSpots}
                      onChange={(e) => updateField('maxSpots', e.target.value)}
                      min="1"
                      className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
                      placeholder="Unlimited"
                    />
                    <p className="text-xs text-zinc-600">Leave empty for unlimited spots</p>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-300">Event Password</Label>
                    <Input
                      type="text"
                      id="password"
                      value={eventData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="h-11 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-xl"
                      placeholder="Leave empty for public access"
                    />
                    <p className="text-xs text-zinc-600">Only people with the password can view and register</p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl"
                  >
                    ← Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex-1 h-12 bg-zinc-100 text-zinc-900 hover:bg-white rounded-xl font-medium disabled:opacity-50"
                  >
                    Continue →
                  </Button>
                ) : (
                  <div className="flex-1">
                    <SubmitButton />
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Preview Section - hidden on mobile */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-6 lg:self-start">
            <EventPreview data={eventData} />
          </div>
        </div>
      </div>
    </div>
  )
}
