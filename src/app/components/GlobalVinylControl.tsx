'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useGlobalAudioPlayer } from './GlobalAudioPlayer'

interface GlobalVinylControlProps {
  className?: string
}

export default function GlobalVinylControl({ className = '' }: GlobalVinylControlProps) {
  const { activeTrack, isPlaying, togglePlayback } = useGlobalAudioPlayer()
  const [dominantColor, setDominantColor] = useState<string>('#1a1a1a')

  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = activeTrack.cover
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 50
      canvas.height = 50
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, 50, 50)
      const data = ctx.getImageData(0, 0, 50, 50).data
      let r = 0, g = 0, b = 0, count = 0
      for (let i = 0; i < data.length; i += 16) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        count++
      }
      r = Math.round(r / count)
      g = Math.round(g / count)
      b = Math.round(b / count)
      setDominantColor(`rgb(${r}, ${g}, ${b})`)
    }
  }, [activeTrack.cover])

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
        title={`${activeTrack.title} — ${activeTrack.artist}`}
      >
          <span
            className="relative block h-full w-full rounded-full"
            style={{
              backgroundImage: "url('https://intheclouds.io/cdn/shop/files/Custom_Vinyl_Record_12inch_Transparent_3024x.png?v=1741182986')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: isPlaying ? 'vinylSpin 3.2s linear infinite' : 'none',
              transformOrigin: 'center center',
            }}
          >
            <span
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: 0,
                borderRadius: '50%',
                background: dominantColor,
                mixBlendMode: 'color',
                opacity: 0.85,
                filter: 'saturate(1.8)',
                zIndex: 1,
              }}
            />
            <span
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: 0,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.22) 0%, transparent 55%)',
                mixBlendMode: 'screen',
                opacity: 0.5,
                zIndex: 3,
              }}
            />
            <span
              className="absolute overflow-hidden rounded-full"
              style={{
                inset: '30%',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <Image
                src={activeTrack.cover}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>
            <span
              className="absolute rounded-full"
              style={{
                inset: '45%',
                backgroundColor: '#eceae6',
                border: '1px solid rgba(0, 0, 0, 0.3)',
                zIndex: 2,
              }}
            />
          </span>
      </button>
    </div>
  )
}
