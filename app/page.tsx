import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Calendar, CreditCard, Globe, Lock, Music, Smartphone, Layout, MessageSquare, Share2, Zap, ShieldCheck, ArrowRight, Sparkles, Users } from 'lucide-react'

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
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
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
              <p className="text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">Trusted by modern hosts & integrated with</p>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {/* Spotify */}
                <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.38 9.781-.719 13.44 1.56.54.3.66.84.301 1.261zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                
                {/* PayPal */}
                <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.946 5.05-4.336 6.795-9.077 6.795h-2.13c-.527 0-.96.384-1.039.9l-1.638 7.112a.639.639 0 0 0 .624.737h2.974c.525 0 .963-.385 1.042-.901l.127-.528c.13-.563.624-.961 1.201-.961h1.28c3.603 0 6.197-1.787 6.975-6.258.07-.405.123-.809.154-1.209.528-.485 1.004-1.093 1.334-1.875.502-1.192.519-2.607.073-3.952-.732-2.206-2.985-3.344-6.57-3.344H7.972a.641.641 0 0 0-.632.738l3.726 23.465a.64.64 0 0 0 .633.74h4.623"/>
                </svg>

                {/* Revolut (Simple Text/Logo Representation for now as complex path) */}
                <div className="h-6 flex items-center">
                   <span className="font-black text-2xl tracking-tighter">Revolut</span>
                </div>

                {/* Venmo (V shape) */}
                <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.45 4.06c.37-1.62.88-2.65 2.4-3.04-1.9-.88-4.26 1.27-4.8 3.5L13.3 17.9l-4.46-13.2c-.26-.78-.9-2.92-3.04-3.55 1.87-.53 3.56.85 4.05 2.2l3.4 12.32L19.45 4.06z"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 1: Seamless across devices */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 pt-10">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-medium tracking-wide uppercase text-xs mb-2 block">Seamless across devices</span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Mobile first,<br/> desktop ready</h2>
            <p className="text-zinc-400 text-lg">Your event page looks stunning on every screen size.</p>
          </div>
          
          <div className="bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 sm:p-12 overflow-hidden relative group">
            {/* Glow Effect on Hover */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-10 order-2 lg:order-1">
                 <div className="flex gap-5 items-start">
                   <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center justify-center shrink-0 text-white shadow-inner">
                     <Smartphone className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold mb-2 text-white">Mobile Web App</h3>
                     <p className="text-zinc-400 leading-relaxed">Guests can RSVP, pay, and check details from their phone. No app download needed. Works instantly.</p>
                   </div>
                 </div>
                 <div className="flex gap-5 items-start">
                   <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center justify-center shrink-0 text-white shadow-inner">
                     <Layout className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold mb-2 text-white">Desktop Dashboard</h3>
                     <p className="text-zinc-400 leading-relaxed">Manage your events, track analytics, and edit details from a powerful desktop view.</p>
                   </div>
                 </div>
              </div>

              {/* Interactive Preview Area */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative perspective-[1000px]">
                 <div className="relative z-10 transform transition-transform duration-700 lg:group-hover:rotate-y-[-5deg] lg:group-hover:rotate-x-[5deg]">
                   {/* Mobile Mockup */}
                   <div className="w-[260px] h-[520px] bg-black border-[6px] border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10 relative">
                      {/* Dynamic Island */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />
                      
                      <div className="h-full bg-black overflow-y-auto pt-12 px-5 pb-6 scrollbar-hide">
                        <div className="w-full h-32 bg-zinc-900 rounded-2xl mb-4 overflow-hidden relative group/card">
                           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 transition-transform duration-500 group-hover/card:scale-110" />
                        </div>
                        <h3 className="font-bold text-white text-xl mb-1">Summer Party 🌴</h3>
                        <div className="flex gap-2 mb-6">
                          <Badge variant="secondary" className="h-6 bg-zinc-800 text-zinc-300 border-zinc-700 px-2">Aug 24</Badge>
                          <Badge variant="secondary" className="h-6 bg-zinc-800 text-zinc-300 border-zinc-700 px-2">7:00 PM</Badge>
                        </div>
                        <Button size="sm" className="w-full h-10 text-sm rounded-xl mb-6 bg-white text-black font-semibold hover:bg-zinc-200">I'm In!</Button>
                        <div className="space-y-3">
                           <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Who's going</p>
                           <MockAttendeeRow emoji="😎" name="You" status="paid" compact delay={0} />
                           <MockAttendeeRow emoji="💃" name="Sarah" status="paid" compact delay={100} />
                           <MockAttendeeRow emoji="🎸" name="Mike" status="unpaid" compact delay={200} />
                        </div>
                      </div>
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
                <FeatureListItem title="Instant Notifications" desc="Get notified the moment someone joins or pays." />
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
                     <PaymentRow name="Revolut" amount="$450.00" color="text-blue-400" bg="bg-blue-400/10" letter="R" />
                     <PaymentRow name="PayPal" amount="$320.00" color="text-indigo-400" bg="bg-indigo-400/10" letter="P" />
                     <PaymentRow name="Venmo" amount="$280.00" color="text-sky-400" bg="bg-sky-400/10" letter="V" />
                     <PaymentRow name="Cash" amount="$200.00" color="text-emerald-400" bg="bg-emerald-400/10" letter="$" />
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
                 <div>
                   <h4 className="font-bold text-white mb-2 text-lg">Invoicing</h4>
                   <p className="text-sm text-zinc-400 leading-relaxed">Automatic simple receipts sent to your guests upon registration.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
           <div className="text-center mb-20">
             <span className="text-zinc-500 font-medium tracking-wide uppercase text-xs mb-2 block">Features</span>
             <h2 className="text-3xl sm:text-5xl font-bold mb-4">Built for hosts,<br/> powered by simplicity</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GridFeature title="Smart Notifications" desc="Get notified on RSVPs." icon={<MessageSquare className="w-5 h-5" />} />
              <GridFeature title="Spotify Integration" desc="Collaborative playlists." icon={<Music className="w-5 h-5" />} />
              <GridFeature title="Calendar Sync" desc="Auto-generated .ics files." icon={<Calendar className="w-5 h-5" />} />
              <GridFeature title="Private Events" desc="Password protection." icon={<Lock className="w-5 h-5" />} />
              <GridFeature title="Global Currency" desc="Accept any currency." icon={<Globe className="w-5 h-5" />} />
              <GridFeature title="Custom Themes" desc="Beautiful auto-design." icon={<Zap className="w-5 h-5" />} />
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

        {/* Pricing */}
        <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="text-center mb-20">
            <span className="text-zinc-500 font-medium tracking-wide uppercase text-xs mb-2 block">Pricing</span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Simple plans <br/> for serious fun</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             <PricingCard 
               title="Basic" 
               price="Free" 
               desc="For casual get-togethers."
               features={["Unlimited events", "Unlimited guests", "Basic themes", "All payment methods"]}
               buttonText="Start Free"
               highlighted={false}
             />
             <PricingCard 
               title="Pro" 
               price="$19" 
               period="/year"
               desc="For regular hosts."
               features={["Everything in Basic", "Remove branding", "Priority support", "Custom domain (soon)"]}
               buttonText="Go Pro"
               highlighted={true}
             />
             <PricingCard 
               title="Enterprise" 
               price="Custom" 
               desc="For large organizations."
               features={["Everything in Pro", "Custom contracts", "SLA", "Dedicated support"]}
               buttonText="Contact Sales"
               highlighted={false}
             />
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
             <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
               <div className="col-span-2 md:col-span-1">
                 <Link href="/" className="font-bold text-xl flex items-center gap-2 mb-6">
                   <span className="text-2xl">🎉</span>
                   <span className="text-white">iamin</span>
                 </Link>
                 <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                   Events made beautifully simple. The all-in-one platform for modern hosts.
                 </p>
               </div>
               <div>
                 <h4 className="font-bold mb-6 text-white">Product</h4>
                 <ul className="space-y-4 text-sm text-zinc-400">
                   <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                   <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                   <li><Link href="/login" className="hover:text-white transition-colors">Log in</Link></li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold mb-6 text-white">Company</h4>
                 <ul className="space-y-4 text-sm text-zinc-400">
                   <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                   <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                   <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold mb-6 text-white">Legal</h4>
                 <ul className="space-y-4 text-sm text-zinc-400">
                   <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                   <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
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

function PricingCard({ title, price, period, desc, features, buttonText, highlighted }: { title: string, price: string, period?: string, desc: string, features: string[], buttonText: string, highlighted: boolean }) {
  return (
    <div className={`p-10 rounded-[2.5rem] border flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2 duration-300 ${highlighted ? 'bg-white text-zinc-950 border-white ring-4 ring-white/20' : 'bg-[#0F0F0F] border-white/5 hover:border-white/10'}`}>
      {highlighted && (
        <div className="absolute top-6 right-8 bg-zinc-950 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <h3 className={`text-xl font-bold mb-2 ${highlighted ? 'text-zinc-900' : 'text-white'}`}>{title}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className={`text-5xl font-bold tracking-tight ${highlighted ? 'text-zinc-900' : 'text-white'}`}>{price}</span>
        {period && <span className={`text-sm font-medium ${highlighted ? 'text-zinc-500' : 'text-zinc-500'}`}>{period}</span>}
      </div>
      <p className={`text-sm mb-10 leading-relaxed ${highlighted ? 'text-zinc-600' : 'text-zinc-400'}`}>{desc}</p>
      
      <ul className="space-y-5 mb-10 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-medium">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${highlighted ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-800 text-zinc-400'}`}>
              <Check className="w-3 h-3" />
            </div>
            <span className={highlighted ? 'text-zinc-700' : 'text-zinc-300'}>{f}</span>
          </li>
        ))}
      </ul>
      
      <Button className={`w-full h-14 rounded-2xl font-bold text-base transition-all ${highlighted ? 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-xl' : 'bg-white text-zinc-950 hover:bg-zinc-200'}`}>
        {buttonText}
      </Button>
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

function PaymentRow({ name, amount, color, bg, letter }: { name: string, amount: string, color: string, bg: string, letter: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/50 border border-white/5 hover:bg-zinc-900 transition-colors group">
      <div className="flex items-center gap-4">
         <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color} font-bold text-sm shadow-sm group-hover:scale-110 transition-transform`}>
           {letter}
         </div>
         <span className="font-medium text-zinc-200">{name}</span>
      </div>
      <span className="text-zinc-400 font-mono font-medium tracking-tight">{amount}</span>
    </div>
  )
}
