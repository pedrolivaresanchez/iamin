'use client'

import { useState } from 'react'

type PaymentMethods = {
  revolut?: string
  paypal?: string
  venmo?: string
  bizum?: string
  cashapp?: string
  other?: string
}

const PAYMENT_CONFIG = {
  revolut: { label: 'Revolut', color: '#0075EB', abbr: 'RE' },
  paypal: { label: 'PayPal', color: '#003087', abbr: 'PP' },
  venmo: { label: 'Venmo', color: '#3D95CE', abbr: 'VE' },
  bizum: { label: 'Bizum', color: '#00C3B3', abbr: 'BI' },
  cashapp: { label: 'Cash App', color: '#00D632', abbr: 'CA' },
  other: { label: 'Other', color: '#525252', abbr: '🔗' },
}

function getPaymentUrl(method: string, tag: string, price: number, currency: string, note?: string): string | null {
  const amount = price.toFixed(2)
  const encodedNote = note ? encodeURIComponent(note) : 'Event%20Payment'
  
  switch (method) {
    case 'revolut':
      return `https://revolut.me/${tag.replace('@', '')}?currency=${currency}&amount=${price}&note=${encodedNote}`
    case 'paypal':
      return `https://paypal.me/${tag.replace('@', '')}/${amount}${currency}`
    case 'venmo':
      return `https://venmo.com/${tag.replace('@', '')}?txn=pay&amount=${amount}&note=Event%20Payment`
    case 'cashapp':
      return `https://cash.app/$${tag.replace('$', '')}/${amount}`
    case 'bizum':
      return null // Bizum is phone-based, no web URL
    case 'other':
      return tag // Already a full URL
    default:
      return null
  }
}

type Props = {
  methods: PaymentMethods
  price: number
  currency: string
  currencySymbol: string
  eventTitle?: string
}

export default function PaymentPopup({ methods, price, currency, currencySymbol, eventTitle }: Props) {
  const [open, setOpen] = useState(false)
  
  const activeMethodsCount = Object.entries(methods).filter(([_, v]) => v?.trim()).length
  
  if (activeMethodsCount === 0) return null

  // If only one payment method, just show direct link
  if (activeMethodsCount === 1) {
    const [method, tag] = Object.entries(methods).find(([_, v]) => v?.trim())!
    const url = getPaymentUrl(method, tag!, price, currency, eventTitle)
    
    if (method === 'bizum') {
      return (
        <div className="text-right">
          <p className="text-xs text-emerald-500/70 mb-1">Bizum</p>
          <p className="text-emerald-400 font-medium">{tag}</p>
        </div>
      )
    }
    
    return (
      <a 
        href={url!}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all hover:scale-105 shadow-lg shadow-emerald-900/30"
      >
        Pay Now →
      </a>
    )
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all hover:scale-105 shadow-lg shadow-emerald-900/30"
      >
        Pay Now →
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">Choose Payment Method</h3>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    Amount: {currencySymbol}{price.toFixed(2)} {currency}
                  </p>
                </div>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                {Object.entries(methods).map(([method, tag]) => {
                  if (!tag?.trim()) return null
                  
                  const config = PAYMENT_CONFIG[method as keyof typeof PAYMENT_CONFIG]
                  const url = getPaymentUrl(method, tag, price, currency, eventTitle)
                  
                  if (method === 'bizum') {
                    return (
                      <div
                        key={method}
                        className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ backgroundColor: config.color }}
                        >
                          {config.abbr}
                        </div>
                        <div className="flex-1">
                          <p className="text-zinc-200 font-medium">{config.label}</p>
                          <p className="text-zinc-400 text-sm">Send to: {tag}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(tag)
                          }}
                          className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg text-sm transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    )
                  }
                  
                  return (
                    <a
                      key={method}
                      href={url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600 transition-colors group"
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ backgroundColor: config.color }}
                      >
                        {config.abbr}
                      </div>
                      <div className="flex-1">
                        <p className="text-zinc-200 font-medium">{config.label}</p>
                        <p className="text-zinc-500 text-sm">@{tag.replace('@', '').replace('$', '')}</p>
                      </div>
                      <svg className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )
                })}
              </div>

              <p className="text-xs text-zinc-600 text-center mt-4">
                Links open in a new tab. Amount may need manual entry.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

