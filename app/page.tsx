import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-100 mb-3">
            <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">iamin</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-md mx-auto">
            Create events. Share the link. See who&apos;s in.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="rounded-xl px-8 bg-zinc-100 text-zinc-900 hover:bg-white hover:scale-105 transition-all">
            <Link href="/signup">
              Get Started Free
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl px-8 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Link href="/login">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
