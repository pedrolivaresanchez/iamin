'use client'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-blob animation-delay-4000" />
      <div className="absolute bottom-0 right-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl animate-blob animation-delay-6000" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Subtle moving gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-950/5 to-transparent animate-gradient-shift" />
    </div>
  )
}

