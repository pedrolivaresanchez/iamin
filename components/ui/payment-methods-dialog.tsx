'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export type PaymentMethods = {
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

const PAYMENT_OPTIONS = [
  { key: 'revolut', label: 'Revolut', prefix: '@', placeholder: 'yourtag', color: 'bg-[#0075EB]' },
  { key: 'paypal', label: 'PayPal', prefix: '@', placeholder: 'username', color: 'bg-[#003087]' },
  { key: 'venmo', label: 'Venmo', prefix: '@', placeholder: 'username', color: 'bg-[#3D95CE]' },
  { key: 'bizum', label: 'Bizum', prefix: '+34', placeholder: 'phone number', color: 'bg-[#00C3B3]' },
  { key: 'cashapp', label: 'Cash App', prefix: '$', placeholder: 'cashtag', color: 'bg-[#00D632]' },
  { key: 'other', label: 'Other Link', prefix: '', placeholder: 'https://...', color: 'bg-zinc-600' },
] as const

const BANK_FIELDS = [
  { key: 'bank_name', label: 'Bank Name', placeholder: 'e.g. Chase, BBVA...' },
  { key: 'account_holder', label: 'Account Holder', placeholder: 'Full name' },
  { key: 'iban', label: 'IBAN / Account Number', placeholder: 'ES12 3456 7890...' },
  { key: 'bic', label: 'BIC/SWIFT (optional)', placeholder: 'XXXXESXX' },
] as const

type Props = {
  value: PaymentMethods
  onChange: (methods: PaymentMethods) => void
}

export function PaymentMethodsDialog({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [methods, setMethods] = useState<PaymentMethods>(value || {})

  useEffect(() => {
    setMethods(value || {})
  }, [value])

  const handleSave = () => {
    onChange(methods)
    setOpen(false)
  }

  const activeCount = Object.entries(methods).filter(([k, v]) => {
    if (k === 'bank_account') {
      const bank = v as PaymentMethods['bank_account']
      return bank?.iban?.trim()
    }
    return typeof v === 'string' && v.trim()
  }).length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full h-11 justify-between border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Payment Methods
          </span>
          {activeCount > 0 && (
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Payment Methods
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-zinc-500 -mt-2">
          Add your payment usernames. Links are generated automatically with the event price.
        </p>
        
        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {PAYMENT_OPTIONS.map((option) => (
            <div key={option.key} className="flex items-center gap-3">
              <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center shrink-0`}>
                <span className="text-white text-xs font-bold">
                  {option.label.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <Label className="text-zinc-400 text-xs">{option.label}</Label>
                <div className="flex mt-1">
                  {option.prefix && (
                    <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-zinc-700 bg-zinc-800/50 text-zinc-500 text-sm">
                      {option.prefix}
                    </span>
                  )}
                  <Input
                    type={option.key === 'other' ? 'url' : 'text'}
                    value={(methods[option.key as keyof PaymentMethods] as string) || ''}
                    onChange={(e) => setMethods({ ...methods, [option.key]: e.target.value })}
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 h-9 ${option.prefix ? 'rounded-l-none' : ''}`}
                    placeholder={option.placeholder}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Bank Account Section */}
          <div className="pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#1a365d] rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <Label className="text-zinc-300 font-medium">Bank Account</Label>
            </div>
            <div className="space-y-3 pl-13">
              {BANK_FIELDS.map((field) => (
                <div key={field.key}>
                  <Label className="text-zinc-500 text-xs">{field.label}</Label>
                  <Input
                    type="text"
                    value={methods.bank_account?.[field.key as keyof NonNullable<PaymentMethods['bank_account']>] || ''}
                    onChange={(e) => setMethods({
                      ...methods,
                      bank_account: {
                        ...methods.bank_account,
                        [field.key]: e.target.value
                      }
                    })}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 mt-1"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Save Methods
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hidden inputs for form submission
export function PaymentMethodsInputs({ methods }: { methods: PaymentMethods }) {
  return (
    <>
      <input type="hidden" name="payment_revolut" value={methods.revolut || ''} />
      <input type="hidden" name="payment_paypal" value={methods.paypal || ''} />
      <input type="hidden" name="payment_venmo" value={methods.venmo || ''} />
      <input type="hidden" name="payment_bizum" value={methods.bizum || ''} />
      <input type="hidden" name="payment_cashapp" value={methods.cashapp || ''} />
      <input type="hidden" name="payment_other" value={methods.other || ''} />
      <input type="hidden" name="payment_bank_name" value={methods.bank_account?.bank_name || ''} />
      <input type="hidden" name="payment_bank_holder" value={methods.bank_account?.account_holder || ''} />
      <input type="hidden" name="payment_bank_iban" value={methods.bank_account?.iban || ''} />
      <input type="hidden" name="payment_bank_bic" value={methods.bank_account?.bic || ''} />
    </>
  )
}

// Generate payment URL from method and tag
export function getPaymentUrl(method: string, tag: string, price?: number, currency?: string): string {
  const amount = price ? Number(price).toFixed(2) : ''
  const curr = currency || 'USD'
  
  switch (method) {
    case 'revolut':
      return `https://revolut.me/${tag}${amount ? `?amount=${amount}&currency=${curr}` : ''}`
    case 'paypal':
      return `https://paypal.me/${tag}${amount ? `/${amount}${curr}` : ''}`
    case 'venmo':
      return `https://venmo.com/${tag}${amount ? `?txn=pay&amount=${amount}` : ''}`
    case 'bizum':
      return `bizum://${tag}` // Bizum doesn't have web links, just show number
    case 'cashapp':
      return `https://cash.app/$${tag}${amount ? `/${amount}` : ''}`
    case 'other':
      return tag // Already a full URL
    default:
      return tag
  }
}

