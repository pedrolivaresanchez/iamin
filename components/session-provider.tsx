'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Refresh session on mount
    const refreshSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.auth.refreshSession()
      }
    }
    refreshSession()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login')
      } else if (event === 'TOKEN_REFRESHED') {
        router.refresh()
      }
    })

    // Refresh session every 30 minutes to keep it alive
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.auth.refreshSession()
      }
    }, 30 * 60 * 1000) // 30 minutes

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [supabase, router])

  return <>{children}</>
}
