'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export default function BackButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    router.push('/dashboard')
  }

  return (
    <Button 
      onClick={handleClick}
      disabled={isLoading}
      variant="ghost" 
      className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 -ml-4"
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2 h-4 w-4" />
          Loading...
        </>
      ) : (
        '← Back'
      )}
    </Button>
  )
}

