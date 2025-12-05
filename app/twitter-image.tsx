import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'iamin - Event Management Made Simple'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0A0A0A 0%, #18181B 50%, #0A0A0A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Gradient orb */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            borderRadius: '100%',
          }}
        />
        
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '72px' }}>🎉</span>
          <span
            style={{
              fontSize: '80px',
              fontWeight: 700,
              background: 'linear-gradient(to right, #ffffff, #a1a1aa)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            iamin
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: '36px',
            color: '#71717a',
            marginTop: '8px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Create events. Share the link. See who&apos;s in.
        </p>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '48px',
          }}
        >
          {['RSVP Tracking', 'Payment Collection', 'Guest Management'].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.05)',
                padding: '12px 24px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ color: '#10b981', fontSize: '20px' }}>✓</span>
              <span style={{ color: '#e4e4e7', fontSize: '20px' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}

