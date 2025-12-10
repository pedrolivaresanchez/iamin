import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signout } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SessionProvider } from '@/components/session-provider'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-zinc-950">
        <div className="pt-3 px-3 sm:pt-4 sm:px-6 lg:px-8">
          <nav className="max-w-7xl mx-auto border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg shadow-black/20">
            <div className="px-3 sm:px-6">
              <div className="flex justify-between h-14 sm:h-16">
                <div className="flex items-center gap-2 sm:gap-6">
                  <Link href="/dashboard" className="font-bold text-lg sm:text-xl text-zinc-100 tracking-tight">
                    🎉 <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">iamin</span>
                  </Link>
                  <Separator orientation="vertical" className="h-5 sm:h-6 bg-zinc-700/50 hidden sm:block" />
                  <div className="hidden sm:flex gap-1">
                    <Button variant="ghost" size="sm" asChild className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-xl px-4 transition-all">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button size="sm" asChild className="bg-zinc-100 text-zinc-900 hover:bg-white rounded-xl px-4 text-sm font-medium transition-all hover:scale-105">
                      <Link href="/events/new">+ New Event</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center">
                  <form action={signout}>
                    <Button variant="ghost" size="sm" type="submit" className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg sm:rounded-xl px-2 sm:px-4 text-xs sm:text-sm transition-all">
                      Sign Out
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <main className="max-w-7xl mx-auto py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
