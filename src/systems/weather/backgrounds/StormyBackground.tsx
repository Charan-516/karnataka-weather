'use client'
import { useRef, useEffect } from 'react'

export default function StormyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        type Vortex = { angle: number; radius: number; size: number; alpha: number; speed: number }
        const particles: Vortex[] = []
        let lightningAlpha = 0
        let lightningTimer = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        for (let i = 0; i < 200; i++) {
            particles.push({
                angle: Math.random() * Math.PI * 2,
                radius: 50 + Math.random() * Math.max(canvas.width, canvas.height) * 0.5,
                size: 1 + Math.random() * 3,
                alpha: 0.3 + Math.random() * 0.5,
                speed: 0.002 + Math.random() * 0.006,
            })
        }

        const draw = () => {
            const cx = canvas.width / 2
            const cy = canvas.height / 2

            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) * 0.8)
            grad.addColorStop(0, '#2a0038')
            grad.addColorStop(0.3, '#1a0028')
            grad.addColorStop(0.6, '#0e0018')
            grad.addColorStop(1, '#05000a')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const time = Date.now() * 0.001

            particles.forEach((p) => {
                p.angle += p.speed

                const x = cx + Math.cos(p.angle) * p.radius
                const y = cy + Math.sin(p.angle) * p.radius

                ctx.beginPath()
                ctx.arc(x, y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(180, 80, 220, ${p.alpha * (0.6 + 0.4 * Math.sin(time * 2 + p.angle))})`
                ctx.fill()
            })

            lightningTimer++
            if (lightningTimer > 180 + Math.random() * 300) {
                lightningAlpha = 0.6 + Math.random() * 0.3
                lightningTimer = 0

                ctx.save()
                const lx = Math.random() * canvas.width * 0.6 + canvas.width * 0.2
                ctx.beginPath()
                ctx.moveTo(lx, 0)
                let ly = 0
                for (let seg = 0; seg < 8; seg++) {
                    ly += 30 + Math.random() * 60
                    ctx.lineTo(lx + (Math.random() - 0.5) * 80, ly)
                }
                ctx.strokeStyle = `rgba(255, 255, 255, ${lightningAlpha})`
                ctx.lineWidth = 2 + Math.random() * 2
                ctx.stroke()

                ctx.beginPath()
                for (let seg = 0; seg < 5; seg++) {
                    ly += 20 + Math.random() * 30
                    ctx.lineTo(lx + (Math.random() - 0.5) * 40, ly)
                }
                ctx.strokeStyle = `rgba(200, 180, 255, ${lightningAlpha * 0.5})`
                ctx.lineWidth = 1
                ctx.stroke()
                ctx.restore()
            }

            if (lightningAlpha > 0) {
                lightningAlpha -= 0.02
                ctx.save()
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, lightningAlpha * 0.15)})`
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.restore()
            }

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
