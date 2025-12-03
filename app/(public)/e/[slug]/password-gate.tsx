'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  eventTitle: string
  eventPassword: string
  children: React.ReactNode
}

export default function PasswordGate({ eventTitle, eventPassword, children }: Props) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`event-unlocked-${eventPassword}`)
      return stored === 'true'
    }
    return false
  })
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === eventPassword) {
      setIsUnlocked(true)
      sessionStorage.setItem(`event-unlocked-${eventPassword}`, 'true')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Private Event</h1>
          <p className="text-zinc-500 text-sm">
            Enter the password to view <span className="text-zinc-300">{eventTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}
          
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="Enter event password"
            className="h-12 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 rounded-xl text-center text-lg tracking-widest placeholder:text-zinc-600 placeholder:tracking-normal"
            autoFocus
          />
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-zinc-100 text-zinc-900 hover:bg-white rounded-xl font-medium"
          >
            Unlock Event
          </Button>
        </form>

        <p className="text-zinc-600 text-xs text-center mt-6">
          Ask the host for the password
        </p>
      </div>
    </div>
  )
}

