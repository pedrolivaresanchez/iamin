'use client'

import { useState } from 'react'

export default function SpotifyEmbed({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="rounded-xl overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-800/50 animate-pulse rounded-xl flex items-center gap-3 p-4">
          <div className="w-24 h-24 bg-zinc-700/50 rounded-lg shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-zinc-700/50 rounded w-3/4" />
            <div className="h-3 bg-zinc-700/50 rounded w-1/2" />
            <div className="h-3 bg-zinc-700/50 rounded w-2/3" />
          </div>
        </div>
      )}
      <iframe
        src={url.replace('open.spotify.com/', 'open.spotify.com/embed/')}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}

