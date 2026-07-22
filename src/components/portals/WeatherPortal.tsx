'use client'
import React, { useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import PortalGlow from './PortalGlow'

export type PortalType = 'manual' | 'iot' | 'intelligence' | 'district' | 'place'
export type PortalStatus = 'idle' | 'hover' | 'loading' | 'active' | 'error'

interface WeatherPortalProps {
  type: PortalType
  title: string
  subtitle: string
  status?: PortalStatus
  onClick?: () => void
  description?: string
}

const PORTAL_COLORS: Record<PortalType, string> = {
  manual: '#6b7fa3',      // muted dusty blue — warm on cream
  iot: '#5a8a6a',         // muted sage green — earthy, not loud
  intelligence: '#c49a3c', // warm antique gold — matches amber theme
  district: '#b8855a',    // warm copper — district overview
  place: '#7a9a7a',       // muted sage — specific location
}

// Premium SVG icons themed to each mode and the cream/amber palette
function ManualIcon({ color }: { color: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Precision dial / barometer — manual adjustment */}
      <circle cx="12" cy="12" r="9" opacity="0.35" />
      <circle cx="12" cy="12" r="1.5" fill={color} stroke="none" />
      {/* tick marks */}
      <line x1="12" y1="3.5" x2="12" y2="5.5" />
      <line x1="20.5" y1="12" x2="18.5" y2="12" />
      <line x1="3.5" y1="12" x2="5.5" y2="12" />
      <line x1="12" y1="20.5" x2="12" y2="18.5" />
      {/* needle pointing upper-right */}
      <line x1="12" y1="12" x2="16.5" y2="7.5" strokeWidth="2" />
    </svg>
  )
}

function IoTIcon({ color }: { color: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Radio broadcast waves — live sensor signal */}
      <circle cx="12" cy="19" r="1.5" fill={color} stroke="none" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" opacity="0.7" />
      <path d="M5 12a10 10 0 0 1 14 0" opacity="0.5" />
      <path d="M1.5 8.5a15 15 0 0 1 21 0" opacity="0.3" />
    </svg>
  )
}

function IntelligenceIcon({ color }: { color: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      {/* Four-pointed sparkle star — insight / intelligence */}
      <path
        d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
        fill={color} opacity="0.85"
      />
      {/* small accent stars */}
      <path d="M19.5 4 L20.1 5.9 L22 6.5 L20.1 7.1 L19.5 9 L18.9 7.1 L17 6.5 L18.9 5.9 Z"
        fill={color} opacity="0.55" />
      <path d="M4.5 16 L5 17.5 L6.5 18 L5 18.5 L4.5 20 L4 18.5 L2.5 18 L4 17.5 Z"
        fill={color} opacity="0.4" />
    </svg>
  )
}

function DistrictIcon({ color }: { color: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" opacity="0.7" />
      <rect x="14" y="3" width="7" height="7" rx="1" opacity="0.5" />
      <rect x="3" y="14" width="7" height="7" rx="1" opacity="0.5" />
      <rect x="14" y="14" width="7" height="7" rx="1" opacity="0.7" />
      <line x1="6.5" y1="10" x2="6.5" y2="14" opacity="0.35" />
      <line x1="17.5" y1="10" x2="17.5" y2="14" opacity="0.35" />
      <line x1="10" y1="6.5" x2="14" y2="6.5" opacity="0.35" />
      <line x1="10" y1="17.5" x2="14" y2="17.5" opacity="0.35" />
    </svg>
  )
}

function PlaceIcon({ color }: { color: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z" opacity="0.7" />
      <circle cx="12" cy="10" r="3" fill={color} stroke="none" opacity="0.6" />
    </svg>
  )
}

const PORTAL_ICONS: Record<PortalType, (c: string) => React.ReactNode> = {
  manual:       (c) => <ManualIcon color={c} />,
  iot:          (c) => <IoTIcon color={c} />,
  intelligence: (c) => <IntelligenceIcon color={c} />,
  district:     (c) => <DistrictIcon color={c} />,
  place:        (c) => <PlaceIcon color={c} />,
}

export default function WeatherPortal({
  type, title, subtitle, status = 'idle', onClick, description,
}: WeatherPortalProps) {
  const [hovered, setHovered] = useState(false)
  const color = PORTAL_COLORS[type]
  const GOLD = 'rgba(205, 148, 30, 0.13)'

  const buttonRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 150, damping: 20 })
  const springY = useSpring(my, { stiffness: 150, damping: 20 })

  const tiltRotateX = useTransform(springY, [-0.5, 0.5], ['17.5deg', '-17.5deg'])
  const tiltRotateY = useTransform(springX, [-0.5, 0.5], ['-17.5deg', '17.5deg'])

  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)`

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(xPct)
    my.set(yPct)
  }, [mx, my])

  const handleMouseLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
  }, [mx, my])

  const floatAnim = useMemo(() => {
    const idx = ['manual', 'iot', 'intelligence', 'district', 'place'].indexOf(type)
    return idx  // used as CSS class index
  }, [type])

  const statusLabel = status === 'loading' ? 'Processing…'
    : status === 'active' ? 'Live'
    : status === 'error'  ? 'Unavailable'
    : ''

  return (
    <>
      {/* Full-viewport amber overlay — portal ensures true 100vw×100vh coverage */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={`glow-${type}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
              transition={{ duration: 0.8, ease: [0.25, 0, 0.35, 1] }}
              style={{
                position: 'fixed', inset: 0,
                background: GOLD,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      {/*
        Perspective wrapper — required for rotateX/rotateY to be visible.
        The card tilts toward the cursor via mouse-tracking springs.
      */}
      <div style={{ perspective: '1100px', perspectiveOrigin: '50% 40%' }}>
        <motion.button
          ref={buttonRef as React.Ref<HTMLButtonElement>}
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setHovered(false); handleMouseLeave() }}
          className="relative flex flex-col items-center justify-center text-center outline-none"
          style={{
            width: 320,
            minHeight: 400,
            borderRadius: 28,
            background: 'rgba(252, 246, 237, 0.97)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${color}30`,
            cursor: onClick ? 'pointer' : 'default',
            position: 'relative',
            zIndex: 20,
            transformStyle: 'preserve-3d',
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            boxShadow: `rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px`,
          }}
          initial={{ scale: 1, opacity: 0, filter: 'blur(8px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          whileHover={{
            scale: 1.05,
            y: -14,
            transition: { duration: 0.2 },
          }}
          transition={{
            opacity:   { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            filter:    { duration: 0.8 },
            scale:     { duration: 0.2 },
            y:         { duration: 0.3, ease: 'easeOut' },
            boxShadow: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.975 }}
        >
          <PortalGlow color={color} className={hovered ? 'opacity-100' : 'opacity-0'} />

          {/* Glare overlay — follows cursor, blends with card surface */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 rounded-[inherit]"
            style={{
              background: glareBackground,
              opacity: 0,
              mixBlendMode: 'overlay' as const,
            }}
            animate={{ opacity: hovered ? 0.6 : 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Float wrapper — plain div with CSS animation (runs on GPU, no JS jank) */}
          <div className={`card-float-${floatAnim} relative z-10 flex flex-col items-center px-8 py-10 w-full`}>

            {/* Icon — always visible, scales on hover */}
            <motion.div
              className="flex items-center justify-center"
              style={{
                width: 68, height: 68,
                borderRadius: '50%',
                background: `${color}10`,
                border: `1px solid ${color}28`,
              }}
              animate={{
                scale: hovered ? 1.08 : 1,
                y:     hovered ? -10  : 0,
                boxShadow: hovered
                  ? `0 0 28px ${color}30`
                  : `0 0 0px transparent`,
              }}
              transition={{
                scale:     { duration: hovered ? 0.5  : 0.2, ease: hovered ? [0.16,1,0.3,1] : 'easeOut' },
                y:         { duration: hovered ? 0.7  : 0.3, ease: hovered ? [0.16,1,0.3,1] : 'easeOut' },
                boxShadow: { duration: hovered ? 0.5  : 0.2 },
              }}
            >
              {PORTAL_ICONS[type](color)}
            </motion.div>

            {/* Title — slides up on hover */}
            <motion.h3
              animate={{ y: hovered ? -10 : 0 }}
              transition={{ duration: hovered ? 0.7 : 0.3, ease: hovered ? [0.16,1,0.3,1] : 'easeOut' }}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 28,
                fontWeight: 400,
                color: '#3a1e08',
                letterSpacing: '-0.02em',
                marginTop: 22,
                marginBottom: 6,
                lineHeight: 1.15,
                textAlign: 'center',
              }}
            >
              {title}
            </motion.h3>

            {/* Subtitle — slides up on hover */}
            <motion.p
              animate={{ y: hovered ? -10 : 0 }}
              transition={{ duration: hovered ? 0.7 : 0.3, ease: hovered ? [0.16,1,0.3,1] : 'easeOut' }}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#4a2e10',
                opacity: 0.82,
                textAlign: 'center',
                marginBottom: 0,
              }}
            >
              {subtitle}
            </motion.p>

            {/* Thin divider that widens on hover */}
            <motion.div
              animate={{ width: hovered ? 80 : 32, opacity: hovered ? 0.5 : 0.2 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: 1,
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                marginTop: 18, marginBottom: 0,
                borderRadius: 99,
              }}
            />

            {/*
              Description clip — maxHeight controls the space it occupies.
              When idle: maxHeight=0 → zero space → flex centering puts icon+title at true card center.
              On hover: maxHeight expands → icon/title rise via their own y animation above.
              Content opacity has a 120ms entry delay so it only appears AFTER the clip has opened.
            */}
            <motion.div
              animate={{ maxHeight: hovered ? 260 : 0 }}
              transition={{
                maxHeight: {
                  duration: hovered ? 0.65 : 0.28,
                  ease: hovered ? [0.16, 1, 0.3, 1] : [0.4, 0, 1, 1],
                },
              }}
              style={{ overflow: 'hidden', width: '100%' }}
            >
              {/* Inner content animates opacity+y independently */}
              <motion.div
                animate={{
                  opacity: hovered ? 1 : 0,
                  y:       hovered ? 0 : 10,
                  filter:  hovered ? 'blur(0px)' : 'blur(3px)',
                }}
                transition={{
                  opacity: { duration: hovered ? 0.7 : 0.15, delay: hovered ? 0.12 : 0, ease: hovered ? [0.16,1,0.3,1] : 'easeIn' },
                  y:       { duration: hovered ? 0.7 : 0.15, delay: hovered ? 0.12 : 0, ease: hovered ? [0.16,1,0.3,1] : 'easeIn' },
                  filter:  { duration: hovered ? 0.5 : 0.12, delay: hovered ? 0.1  : 0 },
                }}
                style={{
                  paddingTop: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 18,
                  width: '100%',
                  pointerEvents: hovered ? 'auto' : 'none',
                }}
              >
                {description && (
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: 13.5,
                    fontWeight: 300,
                    color: '#3a1e08',
                    opacity: 0.82,
                    lineHeight: 1.65,
                    maxWidth: 248,
                    textAlign: 'center',
                    margin: '0 auto',
                  }}>
                    {description}
                  </p>
                )}

                {/* CTA */}
                {status !== 'idle' ? (
                  <span style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 14,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color,
                    opacity: 0.85,
                    padding: '7px 16px',
                    borderRadius: 99,
                    background: `${color}10`,
                    border: `1px solid ${color}22`,
                  }}>
                    {statusLabel}
                  </span>
                ) : (
                  <span style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#4a2e10',
                    opacity: 0.7,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                  }}>
                    <span style={{
                      width: 5, height: 5,
                      borderRadius: '50%',
                      background: color,
                      display: 'inline-block',
                      boxShadow: `0 0 6px ${color}`,
                    }} />
                    Click to enter
                  </span>
                )}
              </motion.div>
            </motion.div>


          </div>
        </motion.button>
      </div>
    </>
  )
}
