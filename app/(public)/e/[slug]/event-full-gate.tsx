'use client'

import { useState, useEffect, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { CountryCodePicker } from '@/components/ui/country-code-picker'
import { sendEventFullMessage } from '@/app/actions'
import confetti from 'canvas-confetti'

const funnyMessages = [
  "Sorry buddy, we're at max capacity! 🚫",
  "The party's full! But you seem cool... 🤔",
  "All spots taken! Unless... you know someone? 🤷",
  "Event's packed tighter than a can of sardines! 🐟",
  "No room at the inn! But make your case... 📝",
  "We're full! Think you can convince us? 🎭",
]

const rejectionMessages = [
  "Nice try! But still no... 😅",
  "Almost convinced me! But nah 😬",
  "The bouncer said no dice 🎲",
  "Manager reviewed it... still no 🙅",
  "That's a bold move! But no spots 🚪",
  "Appreciate the effort! Check back later 🔄",
]

const approvalMessages = [
  "Wow, you're persistent! Still no spots though... but we admire the hustle! 🏆",
  "That's creative! The manager is impressed but the list is still closed 📋",
  "10/10 for effort! Unfortunately still at capacity 💯",
  "You've got skills! Keep checking back, spots may open up 🔓",
]

export default function EventFullGate({ eventId }: { eventId: string }) {
  const [stage, setStage] = useState<'initial' | 'pleading' | 'rejected' | 'slot-machine'>('initial')
  const [name, setName] = useState('')
  const [countryCode, setCountryCode] = useState('+971')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [randomMessage, setRandomMessage] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [slots, setSlots] = useState(['🎉', '🎊', '🎈'])
  const [attempts, setAttempts] = useState(0)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setRandomMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)])
  }, [])

  const handlePlead = () => {
    setStage('pleading')
  }

  const handleSubmitPlead = () => {
    startTransition(async () => {
      const fullPhone = `${countryCode}${phone}`
      // Send email to organizer
      await sendEventFullMessage(eventId, message, name, fullPhone)
      
      setStage('rejected')
      setAttempts(attempts + 1)
      if (attempts >= 2) {
        // After 3 attempts, show slot machine
        setTimeout(() => setStage('slot-machine'), 2000)
      }
    })
  }

  const spinSlotMachine = () => {
    const emojis = ['🎉', '🎊', '🎈', '🎁', '🎪', '🎭', '🎸', '🎺', '🎮', '🏆', '💎', '⭐']
    
    setSpinning(true)
    let spins = 0
    const interval = setInterval(() => {
      setSlots([
        emojis[Math.floor(Math.random() * emojis.length)],
        emojis[Math.floor(Math.random() * emojis.length)],
        emojis[Math.floor(Math.random() * emojis.length)],
      ])
      spins++
      
      if (spins > 15) {
        clearInterval(interval)
        // Always lose :)
        setSlots(['😢', '🚫', '😭'])
        setSpinning(false)
        
        // But give them confetti for trying
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          })
        }, 500)
      }
    }, 100)
  }

  if (stage === 'slot-machine') {
    return (
      <div className="text-center py-6 space-y-6">
        <div className="text-3xl mb-3">🎰</div>
        <h2 className="text-xl font-semibold text-zinc-100">Alright, Alright...</h2>
        <p className="text-sm text-zinc-400 px-4">
          You're persistent! Try your luck with the magic slot machine. Get three matching and... well, there still aren't spots but you'll feel better! 😄
        </p>
        
        <div className="flex justify-center gap-4 my-8">
          <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center text-4xl border-2 border-zinc-700">
            {slots[0]}
          </div>
          <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center text-4xl border-2 border-zinc-700">
            {slots[1]}
          </div>
          <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center text-4xl border-2 border-zinc-700">
            {slots[2]}
          </div>
        </div>

        <Button
          onClick={spinSlotMachine}
          disabled={spinning}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-8"
        >
          {spinning ? '🎰 Spinning...' : '🎰 Spin!'}
        </Button>

        {!spinning && slots[0] === '😢' && (
          <div className="mt-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
            <p className="text-sm text-zinc-300">
              Nice try! But hey, you got free confetti! 🎊<br />
              <span className="text-zinc-500">Check back later, spots might open up!</span>
            </p>
          </div>
        )}
      </div>
    )
  }

  if (stage === 'rejected') {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-xl font-semibold text-zinc-100">
          You're on the Waitlist!
        </h2>
        <p className="text-sm text-zinc-400 px-4">
          We've notified the event organizer. They'll contact you at <span className="font-medium text-zinc-300">{countryCode}{phone}</span> if a spot opens up!
        </p>
        <p className="text-xs text-zinc-600 px-4">
          Check back later to see if spots become available.
        </p>
      </div>
    )
  }

  if (stage === 'pleading') {
    return (
      <div className="py-6 space-y-4">
        <div className="text-4xl mb-3 text-center">🎤</div>
        <h2 className="text-xl font-semibold text-zinc-100 text-center">Join the Waitlist</h2>
        <p className="text-sm text-zinc-400 text-center px-4">
          The event is full, but you can join the waitlist. Tell us why you'd love to attend!
        </p>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="text-xs text-zinc-500 mb-1.5 block">Your name</label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="h-12 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 rounded-xl placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-zinc-600"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="text-xs text-zinc-500 mb-1.5 block">Phone number</label>
            <div className="flex gap-2">
              <CountryCodePicker 
                value={countryCode} 
                onChange={setCountryCode}
                name="country_code"
              />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="50 123 4567"
                required
                className="flex-1 h-12 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 rounded-xl placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-zinc-600"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="text-xs text-zinc-500 mb-1.5 block">Message (Optional)</label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I'd love to attend because..."
              className="min-h-24 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 rounded-xl placeholder:text-zinc-600"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setStage('initial')}
            variant="outline"
            className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitPlead}
            disabled={!name.trim() || !phone.trim() || isPending}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                Sending...
              </>
            ) : (
              'Join Waitlist'
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-6 space-y-4">
      <div className="text-4xl mb-3">📋</div>
      <h2 className="text-xl font-semibold text-zinc-100">Event Full</h2>
      <p className="text-sm text-zinc-400 px-4">
        All {' '}<span className="font-semibold text-zinc-300">spots are taken</span>, but you can join the waitlist and we'll contact you if a spot opens up.
      </p>
      
      <div className="pt-2">
        <Button
          onClick={handlePlead}
          className="bg-gradient-to-br from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-zinc-100 font-medium border border-zinc-700/50"
        >
          Join Waitlist
        </Button>
      </div>
    </div>
  )
}
