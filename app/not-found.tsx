import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-zinc-700/20 via-transparent to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-zinc-600/15 via-transparent to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-r from-amber-900/10 via-transparent to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Floating emojis - subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-[10%] left-[8%] text-2xl opacity-15 animate-blob">🎉</span>
        <span className="absolute top-[20%] right-[12%] text-xl opacity-10 animate-blob animation-delay-2000">✨</span>
        <span className="absolute bottom-[15%] left-[15%] text-2xl opacity-15 animate-blob animation-delay-4000">🎊</span>
        <span className="absolute bottom-[30%] right-[8%] text-xl opacity-10 animate-blob animation-delay-6000">🥳</span>
        <span className="absolute top-[50%] left-[3%] text-xl opacity-10 animate-blob animation-delay-2000">🎈</span>
        <span className="absolute top-[35%] left-[25%] text-lg opacity-8 animate-blob animation-delay-4000">🍾</span>
        <span className="absolute bottom-[45%] right-[20%] text-xl opacity-10 animate-blob">🪩</span>
        <span className="absolute top-[70%] right-[25%] text-lg opacity-8 animate-blob animation-delay-6000">🎶</span>
        <span className="absolute bottom-[60%] left-[30%] text-base opacity-8 animate-blob animation-delay-2000">💫</span>
        <span className="absolute top-[5%] right-[30%] text-xl opacity-10 animate-blob animation-delay-4000">🌟</span>
        <span className="absolute top-[40%] right-[5%] text-2xl opacity-12 animate-blob animation-delay-2000">🍸</span>
        <span className="absolute top-[80%] left-[35%] text-xl opacity-10 animate-blob animation-delay-6000">🕺</span>
        <span className="absolute top-[55%] right-[30%] text-lg opacity-8 animate-blob animation-delay-4000">🥂</span>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 p-6 md:p-10">
        <Link href="/" className="font-bold text-2xl sm:text-3xl text-zinc-100 tracking-tight inline-block">
          🎉 <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">iamin</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="max-w-md text-center">
          <div className="p-10 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div className="text-8xl mb-6">🔍</div>
            <h1 className="text-4xl font-bold text-zinc-100 mb-3">Oops! Lost in space</h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              The page you're looking for doesn't exist or the event may no longer be available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-zinc-200 rounded-xl px-8 h-12 font-medium border border-zinc-700/50 transition-all duration-300">
                <Link href="/">Go Home</Link>
              </Button>
              <Link 
                href="/signup" 
                className="group relative inline-flex items-center justify-center px-8 h-12 font-medium text-zinc-100 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-amber-900/20"
              >
                {/* Base background */}
                <span className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 group-hover:from-zinc-700 group-hover:via-zinc-600 group-hover:to-zinc-700 transition-all duration-500" />
                
                {/* Subtle golden accent line at top */}
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Border */}
                <span className="absolute inset-0 rounded-xl border border-zinc-600/50 group-hover:border-zinc-500/50 transition-colors duration-500" />
                
                {/* Content */}
                <span className="relative flex items-center gap-2">
                  <span className="text-amber-400/80 group-hover:text-amber-300 transition-colors duration-300">✦</span>
                  <span>Create Event</span>
                  <span className="text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all duration-300">→</span>
                </span>
              </Link>
            </div>
            <p className="text-zinc-600 text-sm mt-8">
              If you believe this is a mistake, contact the event organizer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
