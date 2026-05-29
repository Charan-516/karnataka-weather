'use client'
import { useRef, useEffect } from 'react'

export default function RainyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        type Drop = { x: number; y: number; speed: number; length: number; alpha: number }
        type Ripple = { x: number; y: number; r: number; alpha: number; speed: number }
        let drops: Drop[] = []
        let ripples: Ripple[] = []

        const DROP_COUNT = 200

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        for (let i = 0; i < DROP_COUNT; i++) {
            drops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: 6 + Math.random() * 10,
                length: 8 + Math.random() * 12,
                alpha: 0.2 + Math.random() * 0.3,
            })
        }

        const draw = () => {
            const grad = ctx.createRadialGradient(
                canvas.width * 0.5, canvas.height * 0.2, 0,
                canvas.width * 0.5, canvas.height * 0.2, Math.max(canvas.width, canvas.height) * 0.9
            )
            grad.addColorStop(0, '#1a3a4a')
            grad.addColorStop(0.4, '#0d2a38')
            grad.addColorStop(0.7, '#061a24')
            grad.addColorStop(1, '#020d12')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            drops.forEach((d) => {
                d.y += d.speed
                if (d.y > canvas.height + d.length) {
                    d.y = -d.length
                    d.x = Math.random() * canvas.width
                    ripples.push({ x: d.x, y: d.y + d.length, r: 1, alpha: 0.3, speed: 1 + Math.random() * 2 })
                }

                ctx.beginPath()
                ctx.moveTo(d.x, d.y)
                ctx.lineTo(d.x - 1, d.y + d.length)
                ctx.strokeStyle = `rgba(150, 200, 255, ${d.alpha})`
                ctx.lineWidth = 1
                ctx.stroke()
            })

            ripples = ripples.filter((r) => r.alpha > 0)
            ripples.forEach((r) => {
                r.r += r.speed
                r.alpha -= 0.008

                ctx.beginPath()
                ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2)
                ctx.strokeStyle = `rgba(150, 200, 255, ${r.alpha})`
                ctx.lineWidth = 1
                ctx.stroke()
            })

            animId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'fixed', inset: 0, zIndex: 0, display: 'block' }}
        />
    )
}
