'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { Dictionary } from '../i18n'

const TOTAL_FRAMES = 89
const BATCH_SIZE = 20

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  focusY: number = 0.5, // 0 = بالای عکس, 0.5 = وسط, 1 = پایین عکس
  focusX: number = 0.5  // 0 = چپ عکس, 0.5 = وسط, 1 = راست عکس
) {
  const ia = img.naturalWidth / img.naturalHeight
  const ca = w / h
  let sx: number, sy: number, sw: number, sh: number
  if (ia > ca) {
    sh = img.naturalHeight
    sw = sh * ca
    sx = (img.naturalWidth - sw) * focusX
    sy = 0
  } else {
    sw = img.naturalWidth
    sh = sw / ca
    sx = 0
    sy = (img.naturalHeight - sh) * focusY
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
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const [loadProgress, setLoadProgress] = useState(0)
  const [allLoaded, setAllLoaded] = useState(false)

  const targetFrameRef = useRef(0)
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const sectionMetrics = useRef({ top: 0, height: 0 })

  // Force page to start scrolled to top on refresh, instead of browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = framesRef.current[index]
    if (!img?.complete || !img.naturalWidth) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const isMobileOrTablet = window.innerWidth < 1024
    const focusY = isMobileOrTablet ? 0.2 : 0.5
    const focusX = 0.24 // عدد کمتر از 0.5 یعنی بیشتر به سمت چپ تصویر
    drawCover(ctx, img, canvas.width, canvas.height, focusY, focusX)
  }, [])

  // rAF loop lerps currentFrame → targetFrame and renders; scroll handler only sets targetFrame
  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!section || !canvas || !overlay) return

    const tick = () => {
      const target = targetFrameRef.current
      const current = currentFrameRef.current
      const diff = target - current
      if (Math.abs(diff) > 0.5) {
        currentFrameRef.current = current + diff * 0.08
        drawFrame(Math.round(currentFrameRef.current))
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const updateMetrics = () => {
      sectionMetrics.current = {
        top: section.offsetTop,
        height: section.offsetHeight,
      }
    }
    updateMetrics()

    const handleScroll = () => {
      const sectionTop = sectionMetrics.current.top
      const sectionHeight = sectionMetrics.current.height
      const vh = window.innerHeight
      const scrollY = window.scrollY
      const switchPoint = sectionTop + sectionHeight - vh

      if (scrollY >= switchPoint) {
        pinAbsolute(canvas)
        pinAbsolute(overlay)
        targetFrameRef.current = TOTAL_FRAMES - 1
        return
      }

      pinFixed(canvas)
      pinFixed(overlay)

      const progress = Math.max(0, (scrollY - sectionTop) / (switchPoint - sectionTop))

      if (textRef.current) {
        textRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.3))
      }
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.05))
      }

      targetFrameRef.current = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [drawFrame])

  // Preload frames + resize
  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    const overlay = overlayRef.current
    if (!canvas || !section || !overlay) return

    const lastSize = { width: window.innerWidth, height: window.innerHeight }

    const setSize = () => {
      const vh = window.innerHeight
      canvas.width = window.innerWidth
      canvas.height = vh
      // Lock the on-screen height to a fixed px value instead of CSS 100vh,
      // which otherwise visually stretches/shrinks as the mobile browser's
      // address bar shows and hides while scrolling.
      canvas.style.height = `${vh}px`
      overlay.style.height = `${vh}px`
      section.style.height = `${vh * 4}px`
      // Dark fill prevents white flash before first frame
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#080808'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
    setSize()

    const handleResize = () => {
      const widthChanged = Math.abs(window.innerWidth - lastSize.width) > 5
      // Mobile browsers toggle their address bar while scrolling, which fires
      // 'resize' with only a small height delta (~50–150px). Ignore that so
      // the hero canvas doesn't keep resizing/flickering while the user scrolls.
      const heightChangedSignificantly = Math.abs(window.innerHeight - lastSize.height) > 150
      if (!widthChanged && !heightChangedSignificantly) return

      lastSize.width = window.innerWidth
      lastSize.height = window.innerHeight

      setSize()
      sectionMetrics.current = { top: section.offsetTop, height: section.offsetHeight }
      const vh = window.innerHeight
      const switchPoint = section.offsetTop + section.offsetHeight - vh
      const p = Math.max(0, Math.min(1, (window.scrollY - section.offsetTop) / (switchPoint - section.offsetTop)))
      drawFrame(Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES - 1))
    }
    window.addEventListener('resize', handleResize)

    const frames = new Array<HTMLImageElement>(TOTAL_FRAMES)
    framesRef.current = frames
    let loaded = 0

    function loadBatch(start: number) {
      const end = Math.min(start + BATCH_SIZE, TOTAL_FRAMES)
      let batchDone = 0
      const batchTotal = end - start

      for (let i = start; i < end; i++) {
        const img = new Image()
        img.src = `/frames/frame_${String(i + 1).padStart(3, '0')}.jpg`
        frames[i] = img

        const done = () => {
          loaded++
          batchDone++
          if (i === 0) drawFrame(0)
          if (loaded % 20 === 0 || loaded === TOTAL_FRAMES) setLoadProgress(loaded / TOTAL_FRAMES)
          if (loaded === TOTAL_FRAMES) setAllLoaded(true)
          if (batchDone === batchTotal && end < TOTAL_FRAMES) loadBatch(end)
        }
        img.onload = done
        img.onerror = done
      }
    }

    loadBatch(0)

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
          willChange: 'transform',
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
        {/* Loading bar along bottom edge */}
        {!allLoaded && (
          <div
            className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10"
            style={{ zIndex: 20 }}
          >
            <div
              className="h-full bg-[#3F3E7A] transition-[width] duration-150"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
        )}

        {/* Hero text */}
        <div
          ref={textRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          {/* Dark vignette behind the text so it stays readable over any frame */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, transparent 80%)',
            }}
          />
          <p
            className="relative text-[#3F3E7A] tracking-[0.35em] text-xs uppercase mb-6"
            style={{ fontFamily: 'var(--font-inter)', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
          >
            {dict.hero.eyebrow}
          </p>
          <h1
            className="relative text-4xl md:text-7xl font-light text-white leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}
          >
            {dict.hero.title}
          </h1>
          <p
            className="relative text-white/80 mt-6 text-sm md:text-lg max-w-md"
            style={{ fontFamily: 'var(--font-inter)', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
          >
            {dict.hero.subtitle}
          </p>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
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