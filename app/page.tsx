import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Calendar, Globe, Lock, Music, MessageSquare, Share2, Zap, ArrowRight, Sparkles, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-emerald-500/20 overflow-x-hidden">
      {/* Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center">
        <nav className="w-full max-w-5xl bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 h-14 flex items-center justify-between shadow-2xl shadow-black/50 ring-1 ring-white/5">
          <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🎉</span>
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">iamin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Button asChild size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-full px-5 font-medium h-9 transition-transform hover:scale-105">
              <Link href="/signup">
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      <main>
        {/* Modern Animated Hero */}
        <section className="relative pt-40 pb-20 sm:pt-52 sm:pb-32 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/10 rounded-[100%] blur-[120px] opacity-50 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[400px] bg-blue-500/5 rounded-[100%] blur-[100px] opacity-30" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            
            {/* Animated Particles/Stars */}
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-twinkle" />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-twinkle delay-1000" />
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-twinkle delay-2000" />

            {/* Floating emojis - desktop only */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
              <span className="absolute top-[8%] left-[5%] text-5xl opacity-50 animate-blob">🎉</span>
              <span className="absolute top-[12%] right-[8%] text-4xl opacity-45 animate-blob animation-delay-2000">✨</span>
              <span className="absolute bottom-[10%] left-[10%] text-5xl opacity-50 animate-blob animation-delay-4000">🎊</span>
              <span className="absolute bottom-[20%] right-[5%] text-4xl opacity-45 animate-blob animation-delay-6000">🥳</span>
              <span className="absolute top-[35%] left-[3%] text-3xl opacity-40 animate-blob animation-delay-2000">🎈</span>
              <span className="absolute top-[25%] left-[18%] text-3xl opacity-35 animate-blob animation-delay-4000">🍾</span>
              <span className="absolute bottom-[35%] right-[12%] text-3xl opacity-40 animate-blob">🪩</span>
              <span className="absolute top-[60%] right-[18%] text-3xl opacity-35 animate-blob animation-delay-6000">🎶</span>
              <span className="absolute bottom-[50%] left-[22%] text-2xl opacity-30 animate-blob animation-delay-2000">💫</span>
              <span className="absolute top-[5%] right-[22%] text-3xl opacity-40 animate-blob animation-delay-4000">🌟</span>
              <span className="absolute top-[18%] left-[35%] text-3xl opacity-45 animate-blob animation-delay-6000">🎁</span>
              <span className="absolute bottom-[5%] right-[28%] text-3xl opacity-40 animate-blob">🎀</span>
              <span className="absolute top-[45%] right-[3%] text-4xl opacity-45 animate-blob animation-delay-2000">🍸</span>
              <span className="absolute bottom-[65%] left-[3%] text-3xl opacity-35 animate-blob animation-delay-4000">🎤</span>
              <span className="absolute top-[75%] left-[25%] text-3xl opacity-40 animate-blob animation-delay-6000">🕺</span>
              <span className="absolute top-[3%] left-[12%] text-3xl opacity-35 animate-blob">💃</span>
              <span className="absolute bottom-[3%] left-[32%] text-3xl opacity-45 animate-blob animation-delay-2000">🎵</span>
              <span className="absolute top-[50%] right-[25%] text-3xl opacity-30 animate-blob animation-delay-4000">🥂</span>
              <span className="absolute bottom-[28%] left-[2%] text-3xl opacity-40 animate-blob animation-delay-6000">🎧</span>
              <span className="absolute top-[22%] left-[2%] text-3xl opacity-35 animate-blob">🌈</span>
            </div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-8 animate-fade-in-up backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">The new standard for event hosting</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl sm:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100">
              <span className="block text-zinc-100">Host better events.</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent pb-2">
                Collecting money included.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Create stunning event pages, track RSVPs in real-time, and collect payments instantly. No apps to download. No accounts required for guests.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
              <Button asChild size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 text-base font-semibold shadow-xl shadow-white/5 transition-all hover:scale-105 hover:shadow-white/10">
                <Link href="/signup">
                  Start for free <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-base font-medium backdrop-blur-sm transition-all hover:border-white/20">
                <Link href="#features">
                  See how it works
                </Link>
              </Button>
            </div>

            {/* Social Proof / Logos */}
            <div className="mt-20 sm:mt-24 animate-fade-in-up delay-500 border-t border-white/5 pt-10 max-w-3xl mx-auto">
              <p className="text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">Integrated with</p>
              <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
                {/* Spotify - Official Logo */}
                <div className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity">
                  <img src="https://cdn.simpleicons.org/spotify/1DB954" alt="Spotify" className="h-8 w-8" />
                  <span className="text-[#1DB954] font-semibold text-lg">Spotify</span>
                </div>
                
                {/* PayPal - Official Logo */}
                <div className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity">
                  <img src="https://cdn.simpleicons.org/paypal/00457C" alt="PayPal" className="h-7 w-7" />
                  <span className="text-[#00457C] font-semibold text-lg">PayPal</span>
                </div>

                {/* Revolut - Official Logo */}
                <div className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity">
                  <img src="https://cdn.simpleicons.org/revolut/white" alt="Revolut" className="h-7 w-7" />
                  <span className="text-white font-semibold text-lg">Revolut</span>
                </div>

                {/* Venmo - Official Logo */}
                <div className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity">
                  <img src="https://cdn.simpleicons.org/venmo/008CFF" alt="Venmo" className="h-7 w-7" />
                  <span className="text-[#008CFF] font-semibold text-lg">Venmo</span>
                </div>

                {/* Google Calendar - Official Logo */}
                <div className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity">
                  <img src="https://cdn.simpleicons.org/googlecalendar" alt="Google Calendar" className="h-7 w-7" />
                  <span className="text-white font-semibold text-lg">Calendar</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 1: Seamless across devices */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 pt-10">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-medium tracking-wide uppercase text-xs mb-2 block">Works everywhere</span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">One link.<br/> Every device.</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Share a single link that works beautifully on phones, tablets, and desktops. Your guests just tap and RSVP.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile Card */}
            <div className="bg-[#0F0F0F] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">For Your Guests</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">Instant access from any phone. No app downloads, no sign-ups. Just tap the link and RSVP in seconds.</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-zinc-300">One-tap RSVP</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-zinc-300">Pay via Revolut, PayPal, Venmo</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-zinc-300">Add to calendar instantly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Card */}
            <div className="bg-[#0F0F0F] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">💻</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">For You (The Host)</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">Powerful dashboard to manage everything. Track RSVPs, see who paid, and edit your event anytime.</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-400">✓</span>
                    <span className="text-zinc-300">Real-time guest list</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-400">✓</span>
                    <span className="text-zinc-300">Payment tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-400">✓</span>
                    <span className="text-zinc-300">Edit event details anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Guest Management */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <span className="text-blue-400 font-medium tracking-wide uppercase text-xs mb-2 block">Guest Management</span>
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">Keep every party <br/> moving forward</h2>
              
              <div className="space-y-6 mt-8">
                <FeatureListItem title="Real-time RSVPs" desc="Watch your guest list grow live as people register." />
                <FeatureListItem title="Smart Sharing" desc="One link for everything. Share on WhatsApp, Insta, or text." />
                <FeatureListItem title="Export Data" desc="Download your guest list to CSV anytime." />
              </div>
              
              <div className="mt-10">
                 <Button variant="link" asChild className="pl-0 text-white text-lg hover:text-zinc-300 transition-colors group">
                   <Link href="/signup">Try iamin free <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></Link>
                 </Button>
              </div>
            </div>

            {/* Interactive Component */}
            <div className="bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 relative shadow-2xl overflow-hidden group hover:border-white/10 transition-colors">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <Users className="w-64 h-64" />
               </div>
               
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Guest List</h3>
                      <p className="text-zinc-500 mt-1">24 attending • 4 unpaid</p>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full h-9 text-xs border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:text-white transition-colors">
                      <Share2 className="w-3.5 h-3.5 mr-2" /> Share
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <MockAttendeeRow emoji="💃" name="Sarah Jenkins" status="paid" delay={0} />
                    <MockAttendeeRow emoji="🎸" name="Mike Chen" status="paid" delay={100} />
                    <MockAttendeeRow emoji="😅" name="Alex Thompson" status="unpaid" subtitle="Wallet's warming up..." delay={200} />
                    <MockAttendeeRow emoji="🥑" name="Jessica Lee" status="unpaid" subtitle="Avocado toast victim" delay={300} />
                    <MockAttendeeRow emoji="🚀" name="David Miller" status="paid" delay={400} />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Feature 3: Financial Management */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Interactive Component */}
            <div className="order-2 lg:order-1 bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 relative shadow-2xl overflow-hidden group hover:border-white/10 transition-colors">
               <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700" />
               
               <div className="relative z-10 space-y-8">
                  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5">
                    <p className="text-zinc-500 text-sm mb-2 font-medium tracking-wide">Total Revenue</p>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-5xl font-bold text-white tracking-tight">$1,250</h3>
                      <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                     <PaymentRow name="Revolut" amount="$450.00" bg="bg-zinc-800" logo="https://cdn.simpleicons.org/revolut/white" />
                     <PaymentRow name="PayPal" amount="$320.00" bg="bg-[#00457C]" logo="https://cdn.simpleicons.org/paypal/white" />
                     <PaymentRow name="Venmo" amount="$280.00" bg="bg-[#008CFF]" logo="https://cdn.simpleicons.org/venmo/white" />
                     <PaymentRow name="Cash" amount="$200.00" bg="bg-emerald-600" letter="$" />
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <span className="text-emerald-400 font-medium tracking-wide uppercase text-xs mb-2 block">Financial Management</span>
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">Track income, get paid, <br/> stress less</h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Collect payments via your favorite apps. We don't touch your money — it goes straight to you. Zero fees from us.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                 <div>
                   <h4 className="font-bold text-white mb-2 text-lg">Zero Fees</h4>
                   <p className="text-sm text-zinc-400 leading-relaxed">We don't charge a percentage. Keep 100% of what you earn from ticket sales.</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-white mb-2 text-lg">Any Method</h4>
                   <p className="text-sm text-zinc-400 leading-relaxed">Accept Cash, Bank Transfer, Revolut, PayPal, or Venmo directly.</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-white mb-2 text-lg">Payment Tracking</h4>
                   <p className="text-sm text-zinc-400 leading-relaxed">Mark payments as verified manually or let attendees self-report.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews (Mock) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
           <div className="bg-[#0F0F0F] border border-white/5 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
             
             <div className="relative z-10 max-w-4xl mx-auto">
               <div className="flex justify-center gap-1 mb-8">
                 {[1,2,3,4,5].map(i => <div key={i} className="text-amber-400">★</div>)}
               </div>
               <h3 className="text-2xl sm:text-4xl font-medium leading-relaxed mb-10 text-zinc-200">
                 "We used to manage parties in WhatsApp groups and spreadsheets. iamin is a game changer. It's clean, fast, and my friends actually love using it."
               </h3>
               <div>
                 <p className="font-bold text-white text-lg">Alex Rivera</p>
                 <p className="text-zinc-500">Host of "Summer Rooftop Series"</p>
               </div>
             </div>
           </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-white rounded-[3rem] p-12 sm:p-24 text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-zinc-100" />
             <div className="relative z-10 max-w-3xl mx-auto text-zinc-950">
               <h2 className="text-4xl sm:text-7xl font-bold mb-8 tracking-tight">
                 Ready to host?
               </h2>
               <p className="text-zinc-600 text-xl mb-12 max-w-xl mx-auto">Create your first event in seconds. No credit card required.</p>
               <Button asChild size="lg" className="h-16 px-12 rounded-full bg-black text-white hover:bg-zinc-800 text-lg font-semibold shadow-2xl hover:scale-105 transition-transform">
                 <Link href="/signup">
                   Get Started for Free
                 </Link>
               </Button>
             </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-20 pb-12 bg-[#050505]">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
               <div className="max-w-sm">
                 <Link href="/" className="font-bold text-xl flex items-center gap-2 mb-6">
                   <span className="text-2xl">🎉</span>
                   <span className="text-white">iamin</span>
                 </Link>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   Events made beautifully simple. The all-in-one platform for modern hosts.
                 </p>
               </div>
               <div>
                 <h4 className="font-bold mb-6 text-white">Product</h4>
                 <ul className="space-y-4 text-sm text-zinc-400">
                   <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                   <li><Link href="/login" className="hover:text-white transition-colors">Log in</Link></li>
                   <li><Link href="/signup" className="hover:text-white transition-colors">Sign up</Link></li>
                 </ul>
               </div>
             </div>
             <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
               <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} iamin. All rights reserved.</p>
               <div className="flex gap-8 text-zinc-500">
                 <Link href="#" className="hover:text-white transition-colors"><span className="sr-only">Twitter</span>Twitter</Link>
                 <Link href="#" className="hover:text-white transition-colors"><span className="sr-only">Instagram</span>Instagram</Link>
               </div>
             </div>
           </div>
        </footer>
      </main>
    </div>
  )
}

function FeatureListItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-5 group">
      <div className="w-8 h-8 rounded-full bg-zinc-800/50 border border-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-colors">
        <Check className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
      </div>
      <div>
        <h4 className="font-bold text-white text-lg mb-1">{title}</h4>
        <p className="text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function GridFeature({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="p-8 rounded-3xl bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 group">
      <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6 text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  )
}

function MockAttendeeRow({ emoji, name, status, subtitle, delay, compact }: { emoji: string, name: string, status: 'paid' | 'unpaid', subtitle?: string, delay: number, compact?: boolean }) {
  return (
    <div 
      className={`flex items-center gap-3 ${compact ? 'p-2.5' : 'p-4'} rounded-2xl bg-zinc-800/30 border border-zinc-800/50 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`${compact ? 'w-9 h-9 text-sm' : 'w-12 h-12 text-xl'} rounded-full bg-zinc-800 flex items-center justify-center shadow-inner`}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-zinc-200 truncate ${compact ? 'text-xs' : 'text-base'}`}>{name}</p>
        {status === 'unpaid' && subtitle && !compact && (
          <p className="text-xs text-amber-500/70 truncate mt-0.5">{subtitle}</p>
        )}
      </div>
      {status === 'paid' ? (
        <span className={`text-xs ${compact ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold tracking-wide uppercase`}>
          {compact ? '✓' : 'Paid'}
        </span>
      ) : (
        <span className={`text-xs ${compact ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 font-bold tracking-wide uppercase`}>
          {compact ? 'Wait' : 'Pending'}
        </span>
      )}
    </div>
  )
}

function PaymentRow({ name, amount, bg, logo, letter }: { name: string, amount: string, bg: string, logo?: string, letter?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/50 border border-white/5 hover:bg-zinc-900 transition-colors group">
      <div className="flex items-center gap-4">
         <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
           {logo ? (
             <img src={logo} alt={name} className="w-5 h-5" />
           ) : (
             <span className="text-white font-bold text-sm">{letter}</span>
           )}
         </div>
         <span className="font-medium text-zinc-200">{name}</span>
      </div>
      <span className="text-zinc-400 font-mono font-medium tracking-tight">{amount}</span>
    </div>
  )
}
