'use server'

import { Resend } from 'resend'
import { createClient as createServiceClient } from '@supabase/supabase-js'
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
  enabled: z.boolean().default(true),
})

const registerAttendeeSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  phone: z.string().min(5, 'Phone number is required'),
  event_id: z.string().uuid('Invalid event ID'),
})

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

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
  const enabledValue = formData.get('enabled')
  
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
  const enabledValueUpdate = formData.get('enabled')
  
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
    enabled: enabledValue === 'false' ? false : true,
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
    .select('max_spots, price, title, slug, created_by')
    .eq('id', eventId)
    .single()

  const isPaidEvent = event?.price !== null && event?.price !== undefined && Number(event.price) > 0

  if (event?.max_spots) {
    const { count } = await supabase
      .from('attendees')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('payment_confirmed', true)

    const attendeeCount = count ?? 0

    if (attendeeCount >= event.max_spots) {
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

  const { error } = await supabase
    .from('attendees')
    .insert({ ...parsed.data, payment_confirmed: isPaidEvent ? false : true })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You are already registered for this event' }
    }
    return { error: error.message }
  }

  const organizerEmail = event?.created_by ? await getOrganizerEmail(event.created_by) : null
  console.log('[EMAIL DEBUG] resend:', !!resend, 'organizerEmail:', organizerEmail, 'created_by:', event?.created_by)

  if (resend && organizerEmail) {
    const eventLink = `${getBaseUrl()}/events/${eventId}`
    const baseUrl = getBaseUrl()
    const personEmojis = ['😎', '🥳', '🤩', '🙌', '✨', '🔥', '💃', '🕺', '🎊', '🪩', '👑', '⭐', '🌟', '💫', '🦄', '🐙', '🦋', '🌈', '🍾', '🥂']
    const randomEmoji = personEmojis[Math.floor(Math.random() * personEmojis.length)]
    try {
      const result = await resend.emails.send({
        from: `iamin 🎉 <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: organizerEmail,
        subject: `🎉 New attendee for ${event?.title ?? 'your event'}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background: linear-gradient(145deg, #18181b 0%, #09090b 100%); border-radius: 24px; border: 1px solid #27272a; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #27272a;">
              <div style="font-size: 32px; margin-bottom: 8px;">🎉</div>
              <div style="font-size: 24px; font-weight: 700; color: #fafafa; letter-spacing: -0.5px;">iamin</div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <!-- New Attendee Badge -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; font-size: 12px; font-weight: 600; padding: 6px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                  New Registration
                </span>
              </div>

              <!-- Main Message -->
              <h1 style="color: #fafafa; font-size: 22px; font-weight: 600; text-align: center; margin: 0 0 8px; line-height: 1.3;">
                Someone just joined your event!
              </h1>
              <p style="color: #71717a; font-size: 14px; text-align: center; margin: 0 0 28px;">
                ${event?.title ?? 'Your event'}
              </p>

              <!-- Attendee Card -->
              <div style="background: #27272a; border-radius: 16px; padding: 20px; margin-bottom: 28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="48" style="vertical-align: top;">
                      <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 20px; line-height: 48px; text-align: center; display: block; width: 100%;">${randomEmoji}</span>
                      </div>
                    </td>
                    <td style="padding-left: 16px; vertical-align: middle;">
                      <div style="color: #fafafa; font-size: 16px; font-weight: 600; margin-bottom: 4px;">
                        ${parsed.data.full_name}
                      </div>
                      <div style="color: #a1a1aa; font-size: 14px;">
                        ${parsed.data.phone}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center;">
                <a href="${eventLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                  View All Attendees →
                </a>
              </div>

              <p style="color: #52525b; font-size: 13px; text-align: center; margin: 24px 0 0;">
                Mark them as joined when they arrive at your event
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #27272a; text-align: center;">
              <p style="color: #52525b; font-size: 12px; margin: 0;">
                Powered by <a href="${baseUrl}" style="color: #71717a; text-decoration: none; font-weight: 500;">iamin</a> · Create events & track RSVPs
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      })
      console.log('[EMAIL DEBUG] send result:', result)
    } catch (emailError) {
      console.error('Failed to send organizer email', emailError)
    }
  } else {
    console.log('[EMAIL DEBUG] skipped - resend:', !!resend, 'email:', organizerEmail)
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

function getBaseUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (explicitUrl) return explicitUrl.replace(/\/$/, '')

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`

  return 'http://localhost:3000'
}

async function getOrganizerEmail(userId: string) {
  if (!supabaseServiceRoleKey) return null

  try {
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseServiceRoleKey
    )

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (error) {
      console.error('Failed to fetch organizer email', error)
      return null
    }

    return data?.user?.email ?? null
  } catch (error) {
    console.error('Service role client error', error)
    return null
  }
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
  const enabledValueUpdate = formData.get('enabled')
  
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
    enabled: enabledValueUpdate === 'false' ? false : true,
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
