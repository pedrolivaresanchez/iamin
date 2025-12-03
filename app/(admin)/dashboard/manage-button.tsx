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
      onClick={handleClick}
      disabled={isLoading}
      size="sm"
      className="flex-1"
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

