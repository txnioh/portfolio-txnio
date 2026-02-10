'use client'

import Image from 'next/image'
import { useGlobalAudioPlayer } from './GlobalAudioPlayer'

interface GlobalVinylControlProps {
  className?: string
}

export default function GlobalVinylControl({ className = '' }: GlobalVinylControlProps) {
  const { isPlaying, togglePlayback } = useGlobalAudioPlayer()

  return (
    <div className={`fixed top-4 right-4 md:top-6 md:right-6 z-[80] ${className}`}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          togglePlayback()
        }}
        className="h-14 w-14 md:h-16 md:w-16"
        aria-label={isPlaying ? 'Pause track' : 'Play track'}
        title="takashi yoshimatsu's - birds are still"
      >
        <span
          className="relative block h-full w-full rounded-full"
          style={{
            background: 'radial-gradient(circle at center, #0a0a0a 0 22%, #161616 22% 100%)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            animation: isPlaying ? 'vinylSpin 3.2s linear infinite' : 'none',
            transformOrigin: 'center center',
          }}
        >
          <span
            className="absolute overflow-hidden rounded-full"
            style={{
              inset: '19%',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Image
              src="/yoshimatsu.png"
              alt="Yoshimatsu Memo Flora"
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
          <span
            className="absolute rounded-full"
            style={{
              inset: '11%',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              inset: '5%',
              border: '1px solid rgba(255, 255, 255, 0.09)',
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              inset: '45%',
              backgroundColor: '#eceae6',
              border: '1px solid rgba(0, 0, 0, 0.3)',
            }}
          />
        </span>
      </button>
    </div>
  )
}
