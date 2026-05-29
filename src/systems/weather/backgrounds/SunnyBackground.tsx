'use client'
import { useRef, useEffect } from 'react'

export default function SunnyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        const rays: { angle: number; speed: number; length: number; width: number }[] = []
        const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        for (let i = 0; i < 16; i++) {
            rays.push({
                angle: (Math.PI * 2 * i) / 16,
                speed: 0.002 + Math.random() * 0.004,
                length: 0.4 + Math.random() * 0.4,
                width: 2 + Math.random() * 3,
            })
        }

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -0.2 - Math.random() * 0.5,
                size: 1.5 + Math.random() * 3,
                alpha: 0.1 + Math.random() * 0.3,
            })
        }

        const cx = () => canvas.width / 2
        const cy = () => canvas.height / 2

        const draw = () => {
            const w = canvas.width
            const h = canvas.height
            const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.8)
            grad.addColorStop(0, '#ffd166')
            grad.addColorStop(0.3, '#ff8c42')
            grad.addColorStop(0.6, '#ffe8a3')
            grad.addColorStop(1, '#f5e6c8')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)

            const time = Date.now() * 0.001

            ctx.save()
            ctx.translate(cx(), cy())

            rays.forEach((ray) => {
                const angle = ray.angle + time * ray.speed
                ctx.save()
                ctx.rotate(angle)
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(ray.width, -Math.max(w, h) * ray.length)
                ctx.lineTo(-ray.width, -Math.max(w, h) * ray.length)
                ctx.closePath()
                ctx.fillStyle = `rgba(255, 230, 180, ${0.06 + Math.sin(time + ray.angle) * 0.03})`
                ctx.fill()
                ctx.restore()
            })

            ctx.restore()

            particles.forEach((p) => {
                p.x += p.vx
                p.y += p.vy
                if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
                if (p.x < -10) p.x = w + 10
                if (p.x > w + 10) p.x = -10

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 220, ${p.alpha})`
                ctx.fill()
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
