'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { Dictionary } from '../i18n'

const TOTAL_FRAMES = 336

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const ia = img.naturalWidth / img.naturalHeight
  const ca = w / h
  let sx: number, sy: number, sw: number, sh: number
  if (ia > ca) {
    sh = img.naturalHeight; sw = sh * ca; sx = (img.naturalWidth - sw) / 2; sy = 0
  } else {
    sw = img.naturalWidth; sh = sw / ca; sx = 0; sy = (img.naturalHeight - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
}

// Switch canvas/overlay to fixed (during animation)
function pinFixed(el: HTMLElement) {
  el.style.position = 'fixed'
  el.style.top = '0'
  el.style.bottom = 'auto'
  el.style.left = '0'
}

// Switch canvas/overlay to absolute at bottom of hero (animation complete)
function pinAbsolute(el: HTMLElement) {
  el.style.position = 'absolute'
  el.style.top = 'auto'
  el.style.bottom = '0'
  el.style.left = '0'
}

export default function HeroSection({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const [loadProgress, setLoadProgress] = useState(0)
  const [allLoaded, setAllLoaded] = useState(false)

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = framesRef.current[index]
    if (!img?.complete || !img.naturalWidth) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawCover(ctx, img, canvas.width, canvas.height)
  }, [])

  // Scroll listener — drives all visual state via direct DOM mutation
  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!section || !canvas || !overlay) return

    const handleScroll = () => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight   // 400vh
      const vh = window.innerHeight
      const scrollY = window.scrollY

      // The animation runs while canvas is fixed: sectionTop → switchPoint
      // switchPoint = when the viewport bottom meets the section bottom
      const switchPoint = sectionTop + sectionHeight - vh

      if (scrollY >= switchPoint) {
        // Animation done: freeze canvas at absolute bottom of hero so it
        // naturally scrolls off as the section exits the viewport
        pinAbsolute(canvas)
        pinAbsolute(overlay)
        drawFrame(TOTAL_FRAMES - 1)
        return
      }

      // In animation range: keep canvas pinned to viewport
      pinFixed(canvas)
      pinFixed(overlay)

      const progress = Math.max(0, (scrollY - sectionTop) / (switchPoint - sectionTop))

      // Text fades out between 0–30%
      if (textRef.current) {
        textRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.3))
      }

      // Golden rule slides in between 45–72%
      if (lineRef.current) {
        const lp = Math.max(0, Math.min(1, (progress - 0.45) / 0.27))
        lineRef.current.style.transform = `scaleX(${lp})`
      }

      // Scroll hint fades by 5%
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.05))
      }

      drawFrame(Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // sync state on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [drawFrame])

  // Preload frames + resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Dark fill prevents white flash before first frame
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#080808'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
    setSize()

    const handleResize = () => {
      setSize()
      const section = sectionRef.current
      if (!section) return
      const vh = window.innerHeight
      const switchPoint = section.offsetTop + section.offsetHeight - vh
      const p = Math.max(0, Math.min(1, (window.scrollY - section.offsetTop) / (switchPoint - section.offsetTop)))
      drawFrame(Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES - 1))
    }
    window.addEventListener('resize', handleResize)

    const frames = new Array<HTMLImageElement>(TOTAL_FRAMES)
    framesRef.current = frames
    let loaded = 0

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/frames/frame_${String(i + 1).padStart(4, '0')}.jpg`
      frames[i] = img
      const fi = i
      const done = () => {
        loaded++
        if (fi === 0) drawFrame(0)
        if (loaded % 20 === 0 || loaded === TOTAL_FRAMES) setLoadProgress(loaded / TOTAL_FRAMES)
        if (loaded === TOTAL_FRAMES) setAllLoaded(true)
      }
      img.onload = done
      img.onerror = done
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [drawFrame])

  const isFa = locale === 'fa'

  return (
    <section
      ref={sectionRef}
      style={{ height: '400vh', position: 'relative' }}
    >
      {/* Canvas child — starts fixed, switches to absolute once animation is done */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
      />

      {/* Overlay child — tint + all UI, mirrors canvas positioning */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {/* Dark tint for text contrast */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Loading bar along bottom edge */}
        {!allLoaded && (
          <div
            className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10"
            style={{ zIndex: 20 }}
          >
            <div
              className="h-full bg-[#C9A84C] transition-[width] duration-150"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
        )}

        {/* Golden rule */}
        <div
          ref={lineRef}
          className="absolute top-[60%] inset-x-0 h-px bg-[#C9A84C]/60"
          style={{
            transform: 'scaleX(0)',
            transformOrigin: isFa ? 'right' : 'left',
          }}
        />

        {/* Hero text */}
        <div
          ref={textRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <p
            className="text-[#C9A84C] tracking-[0.35em] text-xs uppercase mb-6"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {dict.hero.eyebrow}
          </p>
          <h1
            className="text-6xl md:text-8xl font-light text-white leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {dict.hero.title}
          </h1>
          <p
            className="text-[#888888] mt-6 text-lg md:text-xl max-w-md"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {dict.hero.subtitle}
          </p>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="text-white/40 text-[10px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <svg
              width="14"
              height="22"
              viewBox="0 0 14 22"
              fill="none"
              className="text-white/30"
            >
              <path
                d="M7 1L7 21M7 21L1 15M7 21L13 15"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
