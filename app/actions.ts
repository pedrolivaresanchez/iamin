'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { nanoid } from 'nanoid'

// Schemas
const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  date: z.string().min(1, 'Date is required'),
  location: z.string().nullable().optional(),
  host_name: z.string().nullable().optional(),
  price: z.coerce.number().min(0).optional(),
  currency: z.string().default('USD'),
  payment_methods: z.object({
    revolut: z.string().optional(),
    paypal: z.string().optional(),
    venmo: z.string().optional(),
    bizum: z.string().optional(),
    cashapp: z.string().optional(),
    other: z.string().optional(),
    bank_account: z.object({
      bank_name: z.string().optional(),
      account_holder: z.string().optional(),
      iban: z.string().optional(),
      bic: z.string().optional(),
    }).optional(),
  }).nullable().optional(),
  image_url: z.string().nullable().optional(),
  spotify_url: z.string().nullable().optional(),
  max_spots: z.coerce.number().min(0).nullable().optional(),
  password: z.string().nullable().optional(),
})

const registerAttendeeSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  phone: z.string().min(5, 'Phone number is required'),
  event_id: z.string().uuid('Invalid event ID'),
})

// Types
export type ActionState = {
  error?: string
  success?: boolean
}

// Create Event
export async function createEvent(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const priceValue = formData.get('price')
  const paymentLink = formData.get('payment_link') as string
  const currency = formData.get('currency') as string
  const imageFile = formData.get('image') as File | null
  
  let imageUrl: string | null = null
  
  // Upload image if provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${nanoid(12)}.${fileExt}`
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('event-images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
      })
    
    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` }
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName)
    
    imageUrl = publicUrl
  }
  
  const spotifyUrl = formData.get('spotify_url') as string
  const maxSpotsValue = formData.get('max_spots')
  
  // Collect payment methods
  const bankAccount = {
    bank_name: formData.get('payment_bank_name') as string || undefined,
    account_holder: formData.get('payment_bank_holder') as string || undefined,
    iban: formData.get('payment_bank_iban') as string || undefined,
    bic: formData.get('payment_bank_bic') as string || undefined,
  }
  // Clean empty bank values
  Object.keys(bankAccount).forEach(key => {
    if (!bankAccount[key as keyof typeof bankAccount]?.trim()) {
      delete bankAccount[key as keyof typeof bankAccount]
    }
  })
  
  const paymentMethods: Record<string, unknown> = {
    revolut: formData.get('payment_revolut') as string || undefined,
    paypal: formData.get('payment_paypal') as string || undefined,
    venmo: formData.get('payment_venmo') as string || undefined,
    bizum: formData.get('payment_bizum') as string || undefined,
    cashapp: formData.get('payment_cashapp') as string || undefined,
    other: formData.get('payment_other') as string || undefined,
  }
  // Clean empty values
  Object.keys(paymentMethods).forEach(key => {
    const val = paymentMethods[key]
    if (typeof val === 'string' && !val.trim()) {
      delete paymentMethods[key]
    }
  })
  // Add bank account if has IBAN
  if (bankAccount.iban?.trim()) {
    paymentMethods.bank_account = bankAccount
  }
  
  const hostName = formData.get('host_name') as string
  
  const passwordValue = formData.get('password') as string
  
  const titleValue = formData.get('title') as string
  const descriptionValue = formData.get('description') as string
  const dateValue = formData.get('date') as string
  const locationValue = formData.get('location') as string

  const rawData = {
    title: titleValue || '',
    description: descriptionValue || '',
    date: dateValue || '',
    location: locationValue || '',
    host_name: hostName || null,
    price: priceValue ? Number(priceValue) : 0,
    currency: currency || 'USD',
    payment_methods: Object.keys(paymentMethods).length > 0 ? paymentMethods : null,
    image_url: imageUrl,
    spotify_url: spotifyUrl || null,
    max_spots: maxSpotsValue ? Number(maxSpotsValue) : null,
    password: passwordValue?.trim() || null,
  }

  const parsed = createEventSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Auto-generate unique slug (12 chars = ~4.7 sextillion combinations)
  const slug = nanoid(12)

  const { error } = await supabase.from('events').insert({
    ...parsed.data,
    slug,
    created_by: user.id,
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'This slug is already taken' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// Register Attendee
export async function registerAttendee(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const countryCode = formData.get('country_code') as string
  const phoneNumber = formData.get('phone') as string
  const fullPhone = `${countryCode}${phoneNumber}`
  const eventId = formData.get('event_id') as string

  // Check if event is full
  const { data: event } = await supabase
    .from('events')
    .select('max_spots')
    .eq('id', eventId)
    .single()

  if (event?.max_spots) {
    const { count } = await supabase
      .from('attendees')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)

    if (count !== null && count >= event.max_spots) {
      return { error: 'Sorry, this event is full' }
    }
  }

  const rawData = {
    full_name: formData.get('full_name'),
    phone: fullPhone,
    event_id: eventId,
  }

  const parsed = registerAttendeeSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from('attendees').insert(parsed.data)

  if (error) {
    if (error.code === '23505') {
      return { error: 'You are already registered for this event' }
    }
    return { error: error.message }
  }

  revalidatePath(`/e`)
  return { success: true }
}

// Delete Attendee
export async function deleteAttendee(attendeeId: string, eventId?: string): Promise<ActionState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // First verify the attendee exists and belongs to user's event
  const { data: attendee } = await supabase
    .from('attendees')
    .select('id, event_id, events!inner(created_by)')
    .eq('id', attendeeId)
    .single()

  if (!attendee) {
    return { error: 'Attendee not found' }
  }

  // Use service role or direct delete
  const { error, count } = await supabase
    .from('attendees')
    .delete({ count: 'exact' })
    .eq('id', attendeeId)

  if (error) {
    console.error('Delete error:', error)
    return { error: error.message }
  }

  if (count === 0) {
    return { error: 'Failed to delete - check RLS policies' }
  }

  revalidatePath('/events', 'layout')
  if (eventId) {
    revalidatePath(`/events/${eventId}`)
  }
  return { success: true }
}

// Delete Event
export async function deleteEvent(eventId: string): Promise<ActionState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Delete attendees first
  await supabase
    .from('attendees')
    .delete()
    .eq('event_id', eventId)

  // Delete the event
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('created_by', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

// Update Attendee
export async function updateAttendee(attendeeId: string, data: { full_name: string; phone: string }, eventId?: string): Promise<ActionState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('attendees')
    .update({ full_name: data.full_name, phone: data.phone })
    .eq('id', attendeeId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/events', 'layout')
  if (eventId) {
    revalidatePath(`/events/${eventId}`)
  }
  return { success: true }
}

// Update Event
export async function updateEvent(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const eventId = formData.get('event_id') as string
  const priceValue = formData.get('price')
  const paymentLink = formData.get('payment_link') as string
  const currency = formData.get('currency') as string
  const imageFile = formData.get('image') as File | null
  const existingImageUrl = formData.get('existing_image_url') as string | null
  
  let imageUrl: string | null = existingImageUrl || null
  
  // Upload new image if provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${nanoid(12)}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
      })
    
    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` }
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName)
    
    imageUrl = publicUrl
  }
  
  const spotifyUrl = formData.get('spotify_url') as string
  const maxSpotsValue = formData.get('max_spots')
  
  // Collect payment methods
  const bankAccountUpdate = {
    bank_name: formData.get('payment_bank_name') as string || undefined,
    account_holder: formData.get('payment_bank_holder') as string || undefined,
    iban: formData.get('payment_bank_iban') as string || undefined,
    bic: formData.get('payment_bank_bic') as string || undefined,
  }
  // Clean empty bank values
  Object.keys(bankAccountUpdate).forEach(key => {
    if (!bankAccountUpdate[key as keyof typeof bankAccountUpdate]?.trim()) {
      delete bankAccountUpdate[key as keyof typeof bankAccountUpdate]
    }
  })
  
  const paymentMethodsUpdate: Record<string, unknown> = {
    revolut: formData.get('payment_revolut') as string || undefined,
    paypal: formData.get('payment_paypal') as string || undefined,
    venmo: formData.get('payment_venmo') as string || undefined,
    bizum: formData.get('payment_bizum') as string || undefined,
    cashapp: formData.get('payment_cashapp') as string || undefined,
    other: formData.get('payment_other') as string || undefined,
  }
  // Clean empty values
  Object.keys(paymentMethodsUpdate).forEach(key => {
    const val = paymentMethodsUpdate[key]
    if (typeof val === 'string' && !val.trim()) {
      delete paymentMethodsUpdate[key]
    }
  })
  // Add bank account if has IBAN
  if (bankAccountUpdate.iban?.trim()) {
    paymentMethodsUpdate.bank_account = bankAccountUpdate
  }
  
  const hostName = formData.get('host_name') as string
  const passwordValueUpdate = formData.get('password') as string
  const titleValueUpdate = formData.get('title') as string
  const descriptionValueUpdate = formData.get('description') as string
  const dateValueUpdate = formData.get('date') as string
  const locationValueUpdate = formData.get('location') as string
  
  const rawData = {
    title: titleValueUpdate || '',
    description: descriptionValueUpdate || '',
    date: dateValueUpdate || '',
    location: locationValueUpdate || '',
    host_name: hostName || null,
    price: priceValue ? Number(priceValue) : 0,
    currency: currency || 'USD',
    payment_methods: Object.keys(paymentMethodsUpdate).length > 0 ? paymentMethodsUpdate : null,
    image_url: imageUrl,
    spotify_url: spotifyUrl || null,
    max_spots: maxSpotsValue ? Number(maxSpotsValue) : null,
    password: passwordValueUpdate?.trim() || null,
  }

  const parsed = createEventSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase
    .from('events')
    .update(parsed.data)
    .eq('id', eventId)
    .eq('created_by', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/events/${eventId}`)
  return { success: true }
}

// Update Attendee Payment Status
export async function updateAttendeePaymentStatus(attendeeId: string, paid: boolean): Promise<ActionState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('attendees')
    .update({ payment_confirmed: paid })
    .eq('id', attendeeId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/events')
  return { success: true }
}

// Login
export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

// Signup
export async function signup(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

// Signout
export async function signout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
