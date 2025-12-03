import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-40 bg-zinc-800" />
          <Skeleton className="h-4 w-56 mt-2 bg-zinc-800" />
        </div>
        <Skeleton className="h-10 w-32 bg-zinc-800" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-zinc-800 bg-zinc-900 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <Skeleton className="h-6 w-3/4 bg-zinc-800" />
                <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
              </div>
              <Skeleton className="h-4 w-full mt-2 bg-zinc-800" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full bg-zinc-800" />
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-800" />
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-zinc-800 mt-auto gap-2">
              <Skeleton className="h-9 flex-1 bg-zinc-800" />
              <Skeleton className="h-9 w-9 bg-zinc-800" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

