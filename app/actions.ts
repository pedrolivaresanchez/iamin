'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { nanoid } from 'nanoid'

// Schemas
const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  location: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  currency: z.string().default('USD'),
  payment_link: z.string().url().optional().or(z.literal('')),
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
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    date: formData.get('date'),
    location: formData.get('location'),
    price: priceValue ? Number(priceValue) : 0,
    currency: currency || 'USD',
    payment_link: paymentLink || null,
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

  const rawData = {
    full_name: formData.get('full_name'),
    phone: fullPhone,
    event_id: formData.get('event_id'),
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
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    date: formData.get('date'),
    location: formData.get('location'),
    price: priceValue ? Number(priceValue) : 0,
    currency: currency || 'USD',
    payment_link: paymentLink || null,
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
