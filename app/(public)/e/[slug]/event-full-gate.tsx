'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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

export default function EventFullGate() {
  const [stage, setStage] = useState<'initial' | 'pleading' | 'rejected' | 'slot-machine'>('initial')
  const [message, setMessage] = useState('')
  const [randomMessage, setRandomMessage] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [slots, setSlots] = useState(['🎉', '🎊', '🎈'])
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    setRandomMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)])
  }, [])

  const handlePlead = () => {
    setStage('pleading')
  }

  const handleSubmitPlead = () => {
    setStage('rejected')
    setAttempts(attempts + 1)
    if (attempts >= 2) {
      // After 3 attempts, show slot machine
      setTimeout(() => setStage('slot-machine'), 2000)
    }
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
        <div className="text-4xl mb-3">🤷</div>
        <h2 className="text-xl font-semibold text-zinc-100">
          {attempts >= 2 ? approvalMessages[Math.floor(Math.random() * approvalMessages.length)] : rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)]}
        </h2>
        <p className="text-sm text-zinc-400 px-4">
          {attempts >= 2 
            ? "Actually, wait... let's see if luck is on your side..." 
            : "But feel free to try again! Or check back later 😉"}
        </p>
        {attempts < 2 && (
          <Button
            onClick={() => setStage('pleading')}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Try Again 🙏
          </Button>
        )}
      </div>
    )
  }

  if (stage === 'pleading') {
    return (
      <div className="py-6 space-y-4">
        <div className="text-4xl mb-3 text-center">🎤</div>
        <h2 className="text-xl font-semibold text-zinc-100 text-center">Pitch Yourself!</h2>
        <p className="text-sm text-zinc-400 text-center px-4">
          The event manager is listening... Give us your best reason why you deserve a spot!
        </p>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I bring good vibes and amazing dance moves... 💃"
          className="min-h-32 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 rounded-xl placeholder:text-zinc-600"
        />
        
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
            disabled={!message.trim()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Submit 🚀
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-6 space-y-4">
      <div className="text-4xl mb-3">🔒</div>
      <h2 className="text-xl font-semibold text-zinc-100">{randomMessage}</h2>
      <p className="text-sm text-zinc-400 px-4">
        All {' '}<span className="font-semibold text-zinc-300">spots are taken</span>, but you can try to convince the event manager...
      </p>
      
      <div className="flex flex-col gap-2 pt-2">
        <Button
          onClick={handlePlead}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
        >
          Talk to the Manager 🎭
        </Button>
        <Button
          variant="outline"
          className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 text-xs"
          onClick={() => window.location.reload()}
        >
          Check Again Later ⏰
        </Button>
      </div>
    </div>
  )
}
