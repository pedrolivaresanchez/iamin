'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

type PaymentMethods = {
  revolut?: string
  paypal?: string
  venmo?: string
  bizum?: string
  cashapp?: string
  other?: string
  bank_account?: {
    bank_name?: string
    account_holder?: string
    iban?: string
    bic?: string
  }
}

const PAYMENT_CONFIG = {
  revolut: { label: 'Revolut', color: '#0075EB', abbr: 'RE', logo: 'https://assets.revolut.com/assets/brand/Revolut-Symbol-Black.svg' },
  paypal: { label: 'PayPal', color: '#003087', abbr: 'PP', logo: 'https://www.paypalobjects.com/webstatic/icon/pp258.png' },
  venmo: { label: 'Venmo', color: '#008CFF', abbr: 'V', logo: '/folder/venmo.svg' },
  bizum: { label: 'Bizum', color: '#05C3C3', abbr: 'B', logo: null },
  cashapp: { label: 'Cash App', color: '#00D632', abbr: '$', logo: null },
  other: { label: 'Other', color: '#525252', abbr: '🔗', logo: null },
  bank_account: { label: 'Bank Transfer', color: '#1a365d', abbr: '🏦', logo: null },
}

function getPaymentUrl(method: string, tag: string, price: number, currency: string, note?: string): string | null {
  const amount = price.toFixed(2)
  const encodedNote = note ? encodeURIComponent(note) : 'Event%20Payment'
  // Revolut expects amount in smallest currency unit (cents/fils)
  const revolutAmount = Math.round(price * 100)
  
  switch (method) {
    case 'revolut':
      return `https://revolut.me/${tag.replace('@', '')}?currency=${currency}&amount=${revolutAmount}&note=${encodedNote}`
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
  isOpen?: boolean
  onClose?: () => void
}

export default function PaymentPopup({ methods, price, currency, currencySymbol, eventTitle, isOpen, onClose }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Support both controlled (isOpen/onClose) and uncontrolled mode
  const open = isOpen !== undefined ? isOpen : internalOpen
  const setOpen = onClose !== undefined ? (v: boolean) => !v && onClose() : setInternalOpen
  
  const activeMethodsCount = Object.entries(methods).filter(([k, v]) => {
    if (k === 'bank_account') {
      const bank = v as PaymentMethods['bank_account']
      return bank?.iban?.trim()
    }
    return typeof v === 'string' && v.trim()
  }).length
  
  if (activeMethodsCount === 0) return null

  // Controlled mode - just show popup
  const isControlled = isOpen !== undefined

  // If only one payment method and NOT in controlled mode, show direct link
  if (!isControlled && activeMethodsCount === 1) {
    const entry = Object.entries(methods).find(([k, v]) => {
      if (k === 'bank_account') {
        const bank = v as PaymentMethods['bank_account']
        return bank?.iban?.trim()
      }
      return typeof v === 'string' && v.trim()
    })!
    const [method, tag] = entry
    
    if (method === 'bank_account') {
      return (
        <button 
          onClick={() => setOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all hover:scale-105 shadow-lg shadow-emerald-900/30"
        >
          Bank Details →
        </button>
      )
    }
    
    const url = getPaymentUrl(method, tag as string, price, currency, eventTitle)
    
    if (method === 'bizum') {
      return (
        <div className="text-right">
          <p className="text-xs text-emerald-500/70 mb-1">Bizum</p>
          <p className="text-emerald-400 font-medium">{tag as string}</p>
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
      {!isControlled && (
        <button 
          onClick={() => setOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all hover:scale-105 shadow-lg shadow-emerald-900/30"
        >
          Pay Now →
        </button>
      )}

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Modal - full width on mobile, max-w-md on desktop */}
          <div className="relative bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl animate-in slide-in-from-bottom sm:fade-in sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
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
                  if (method === 'bank_account') {
                    const bank = tag as PaymentMethods['bank_account']
                    if (!bank?.iban?.trim()) return null
                    
                    const config = PAYMENT_CONFIG.bank_account
                    return (
                      <div
                        key={method}
                        className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ backgroundColor: config.color }}
                          >
                            {config.abbr}
                          </div>
                          <div>
                            <p className="text-zinc-200 font-medium">{config.label}</p>
                            {bank.bank_name && <p className="text-zinc-500 text-sm">{bank.bank_name}</p>}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          {bank.account_holder && (
                            <div className="flex justify-between items-center p-2 bg-zinc-900/50 rounded-lg">
                              <span className="text-zinc-500">Holder</span>
                              <span className="text-zinc-200 font-mono">{bank.account_holder}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center p-2 bg-zinc-900/50 rounded-lg">
                            <span className="text-zinc-500">IBAN</span>
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-200 font-mono text-xs">{bank.iban}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(bank.iban || '')
                                  toast.success('IBAN copied!')
                                }}
                                className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded text-xs transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                          {bank.bic && (
                            <div className="flex justify-between items-center p-2 bg-zinc-900/50 rounded-lg">
                              <span className="text-zinc-500">BIC/SWIFT</span>
                              <span className="text-zinc-200 font-mono">{bank.bic}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }
                  
                  if (typeof tag !== 'string' || !tag?.trim()) return null
                  
                  const config = PAYMENT_CONFIG[method as keyof typeof PAYMENT_CONFIG]
                  const url = getPaymentUrl(method, tag, price, currency, eventTitle)
                  
                  const PaymentIcon = () => (
                    config.logo ? (
                      <div 
                        className="w-12 h-12 rounded-xl overflow-hidden shrink-0 p-2 flex items-center justify-center"
                        style={{ backgroundColor: method === 'bizum' ? '#05C3C3' : '#ffffff' }}
                      >
                        <img src={config.logo} alt={config.label} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ backgroundColor: config.color }}
                      >
                        {config.abbr}
                      </div>
                    )
                  )

                  if (method === 'bizum') {
                    return (
                      <div
                        key={method}
                        className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
                      >
                        <PaymentIcon />
                        <div className="flex-1">
                          <p className="text-zinc-200 font-medium">{config.label}</p>
                          <p className="text-zinc-400 text-sm">Send to: {tag}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(tag)
                            toast.success('Phone number copied!')
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
                      <PaymentIcon />
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
        </div>,
        document.body
      )}
    </>
  )
}

