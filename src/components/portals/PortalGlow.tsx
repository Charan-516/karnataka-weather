'use client'
import { useRef, useEffect, useCallback } from 'react'

interface PortalGlowProps {
  color: string
  className?: string
}

export default function PortalGlow({ color, className = '' }: PortalGlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0.5, y: 0.5 })
  const rafId = useRef(0)

  const handleMouse = useCallback((e: MouseEvent) => {
    const el = ref.current?.parentElement
    if (!el) return
    const rect = el.getBoundingClientRect()
    mousePos.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    el.addEventListener('mousemove', handleMouse)
    return () => el.removeEventListener('mousemove', handleMouse)
  }, [handleMouse])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const animate = () => {
      const { x, y } = mousePos.current
      const highlightX = 20 - x * 40
      const highlightY = 20 - y * 40
      el.style.setProperty('--glow-x', `${highlightX}px`)
      el.style.setProperty('--glow-y', `${highlightY}px`)
      rafId.current = requestAnimationFrame(animate)
    }
    rafId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-[180ms] ${className}`}
      style={{
        background: `radial-gradient(circle at calc(50% + var(--glow-x, 0px)) calc(50% + var(--glow-y, 0px)), ${color}18 0%, transparent 70%)`,
        boxShadow: `inset 0 0 0 1px ${color}30`,
      }}
    />
  )
}
