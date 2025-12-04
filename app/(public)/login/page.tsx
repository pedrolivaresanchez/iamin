'use client'

import { login, type ActionState } from '@/app/actions'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { createClient } from '@/utils/supabase/client'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full h-11 bg-zinc-100 text-zinc-900 hover:bg-white font-medium rounded-lg"
    >
      {pending ? (
        <>
          <Spinner className="mr-2" />
          Signing in...
        </>
      ) : (
        'Sign In'
      )}
    </Button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState<ActionState, FormData>(login, {})
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-zinc-950 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/30 via-transparent to-transparent rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/30 via-transparent to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-r from-fuchsia-500/20 via-transparent to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Floating emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-[10%] left-[8%] text-3xl opacity-40 animate-blob">🎉</span>
          <span className="absolute top-[20%] right-[12%] text-2xl opacity-35 animate-blob animation-delay-2000">✨</span>
          <span className="absolute bottom-[15%] left-[15%] text-3xl opacity-40 animate-blob animation-delay-4000">🎊</span>
          <span className="absolute bottom-[30%] right-[8%] text-2xl opacity-35 animate-blob animation-delay-6000">🥳</span>
          <span className="absolute top-[50%] left-[3%] text-2xl opacity-30 animate-blob animation-delay-2000">🎈</span>
          <span className="absolute top-[35%] left-[25%] text-xl opacity-25 animate-blob animation-delay-4000">🍾</span>
          <span className="absolute bottom-[45%] right-[20%] text-2xl opacity-30 animate-blob">🪩</span>
          <span className="absolute top-[70%] right-[25%] text-xl opacity-25 animate-blob animation-delay-6000">🎶</span>
          <span className="absolute bottom-[60%] left-[30%] text-lg opacity-20 animate-blob animation-delay-2000">💫</span>
          <span className="absolute top-[5%] right-[30%] text-2xl opacity-30 animate-blob animation-delay-4000">🌟</span>
          <span className="absolute top-[15%] left-[40%] text-2xl opacity-35 animate-blob animation-delay-6000">🎁</span>
          <span className="absolute bottom-[8%] right-[35%] text-xl opacity-30 animate-blob">🎀</span>
          <span className="absolute top-[40%] right-[5%] text-3xl opacity-35 animate-blob animation-delay-2000">🍸</span>
          <span className="absolute bottom-[70%] left-[5%] text-xl opacity-25 animate-blob animation-delay-4000">🎤</span>
          <span className="absolute top-[80%] left-[35%] text-2xl opacity-30 animate-blob animation-delay-6000">🕺</span>
          <span className="absolute top-[3%] left-[20%] text-xl opacity-25 animate-blob">💃</span>
          <span className="absolute bottom-[5%] left-[40%] text-2xl opacity-35 animate-blob animation-delay-2000">🎵</span>
          <span className="absolute top-[55%] right-[30%] text-xl opacity-20 animate-blob animation-delay-4000">🥂</span>
          <span className="absolute bottom-[25%] left-[3%] text-2xl opacity-30 animate-blob animation-delay-6000">🎧</span>
          <span className="absolute top-[25%] left-[2%] text-xl opacity-25 animate-blob">🌈</span>
        </div>
        <div className="flex justify-center gap-2 md:justify-start relative z-10">
          <Link href="/" className="font-bold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
            🎉 <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">iamin</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center relative z-10">
          <div className="w-full max-w-sm">
            <div className="p-8 rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-700/30 shadow-xl shadow-black/20 backdrop-blur-sm">
            <form action={formAction} className="flex flex-col gap-5">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold text-zinc-100">Welcome back</h1>
                <p className="text-zinc-500 text-sm mt-1">
                  Sign in to your account
                </p>
              </div>
              
              {state.error && (
                <Alert variant="destructive">
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full h-11 bg-zinc-900 border-zinc-700 text-zinc-100 hover:bg-zinc-800 rounded-lg disabled:opacity-70"
              >
                {isGoogleLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-zinc-900 px-2 text-zinc-500">or</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm text-zinc-400">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="you@example.com" 
                    required 
                    className="h-11 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm text-zinc-400">
                    Password
                  </label>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    required 
                    className="h-11 bg-zinc-900 border-zinc-800 text-zinc-100 rounded-lg"
                  />
                </div>
              </div>

              <SubmitButton />

              <p className="text-center text-sm text-zinc-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-zinc-300 hover:text-zinc-100 underline underline-offset-4">
                  Sign up
                </Link>
              </p>
            </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop"
          alt="Party celebration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-white/90 text-xl font-medium">&quot;The easiest way to organize events with friends&quot;</p>
          <p className="text-white/60 text-sm mt-2">Join thousands of happy event organizers</p>
        </div>
      </div>
    </div>
  )
}
