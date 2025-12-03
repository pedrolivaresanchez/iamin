import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function EventDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-20 bg-zinc-800" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 bg-zinc-800" />
          <Skeleton className="h-9 w-24 bg-zinc-800" />
        </div>
      </div>

      {/* Event Info */}
      <div>
        <Skeleton className="h-10 w-2/3 bg-zinc-800" />
        <Skeleton className="h-5 w-1/2 mt-3 bg-zinc-800" />
        <div className="flex flex-wrap gap-2 mt-4">
          <Skeleton className="h-8 w-44 rounded-full bg-zinc-800" />
          <Skeleton className="h-8 w-24 rounded-full bg-zinc-800" />
          <Skeleton className="h-8 w-32 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-5">
              <Skeleton className="h-9 w-16 bg-zinc-800" />
              <Skeleton className="h-4 w-20 mt-2 bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendees Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-28 bg-zinc-800" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4">
              <Skeleton className="h-32 w-32 rounded-full bg-zinc-800" />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Skeleton className="h-4 w-12 bg-zinc-800" />
              <Skeleton className="h-4 w-16 bg-zinc-800" />
            </div>
          </CardContent>
        </Card>

        {/* Attendees Table */}
        <Card className="border-zinc-800 bg-zinc-900 lg:col-span-3">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-24 bg-zinc-800" />
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              {/* Table Header */}
              <div className="flex gap-4 p-4 bg-zinc-800/50 border-b border-zinc-800">
                <Skeleton className="h-4 w-32 bg-zinc-700" />
                <Skeleton className="h-4 w-24 bg-zinc-700" />
                <Skeleton className="h-4 w-20 bg-zinc-700" />
                <Skeleton className="h-4 w-28 bg-zinc-700 ml-auto" />
              </div>
              {/* Table Rows */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-zinc-800/50 last:border-0">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 bg-zinc-800" />
                    <Skeleton className="h-4 w-28 mt-1 bg-zinc-800" />
                  </div>
                  <Skeleton className="h-4 w-16 bg-zinc-800" />
                  <Skeleton className="h-6 w-20 rounded-full bg-zinc-800" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24 bg-zinc-800" />
                    <Skeleton className="h-8 w-8 bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

