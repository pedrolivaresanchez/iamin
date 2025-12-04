'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const fullUrl = `${window.location.origin}/e/${slug}`
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = fullUrl
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy link')
    }
  }

  return (
    <Button
      type="button"
      onClick={copyToClipboard}
      variant="outline"
      size="sm"
      className={`flex-1 min-w-[100px] border-zinc-700 transition-all ${
        copied 
          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
          : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'
      }`}
    >
      {copied ? '✓ Copied!' : '🔗 Copy'}
    </Button>
  )
}
