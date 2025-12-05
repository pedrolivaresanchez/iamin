import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public routes - no auth needed
  if (
    path === '/' ||
    path === '/login' ||
    path === '/signup' ||
    path === '/events' ||
    path.startsWith('/e/') ||
    path.startsWith('/auth/')
  ) {
    const { supabase, supabaseResponse } = createClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    // Redirect logged users away from auth pages
    if ((path === '/login' || path === '/signup') && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return supabaseResponse
  }

  // Protected routes - need auth
  const { supabase, supabaseResponse } = createClient(request)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
