import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function NewEventLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 bg-zinc-800" />
        <Skeleton className="h-4 w-64 mt-2 bg-zinc-800" />
      </div>
      
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-zinc-800" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-zinc-800" />
            <Skeleton className="h-10 w-full bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-zinc-800" />
            <Skeleton className="h-24 w-full bg-zinc-800" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-zinc-800" />
              <Skeleton className="h-10 w-full bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-zinc-800" />
              <Skeleton className="h-10 w-full bg-zinc-800" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-zinc-800" />
            <Skeleton className="h-10 w-full bg-zinc-800" />
          </div>
          <Skeleton className="h-10 w-full bg-zinc-800 mt-4" />
        </CardContent>
      </Card>
    </div>
  )
}

