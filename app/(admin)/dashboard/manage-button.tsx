'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export default function ManageButton({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    router.push(`/events/${eventId}`)
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      size="sm"
      className="flex-1 bg-zinc-100 text-zinc-900 hover:bg-white"
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2 h-4 w-4" />
          Loading...
        </>
      ) : (
        'Manage'
      )}
    </Button>
  )
}

