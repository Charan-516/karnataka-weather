'use client'
import { useRef, useEffect } from 'react'

export default function FoggyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        type FogPatch = {
            x: number; y: number; r: number
            speedX: number; speedY: number
            alpha: number; alphaSpeed: number; alphaPhase: number
        }
        type MistParticle = {
            x: number; y: number; vx: number; vy: number
            size: number; alpha: number
        }
        const patches: FogPatch[] = []
        const particles: MistParticle[] = []

        const resize = () => {
            const w = window.innerWidth, h = window.innerHeight
            canvas.width = w
            canvas.height = h
        }
        resize()
        window.addEventListener('resize', resize)

        for (let i = 0; i < 12; i++) {
            patches.push({
                x: Math.random() * canvas.width * 1.5 - canvas.width * 0.25,
                y: Math.random() * canvas.height * 1.2 - canvas.height * 0.1,
                r: 120 + Math.random() * 400,
                speedX: -0.1 - Math.random() * 0.3,
                speedY: -0.03 + Math.random() * 0.08,
                alpha: 0.04 + Math.random() * 0.12,
                alphaSpeed: 0.002 + Math.random() * 0.005,
                alphaPhase: Math.random() * Math.PI * 2,
            })
        }

        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: -0.1 + Math.random() * 0.2,
                vy: -0.3 - Math.random() * 0.4,
                size: 1 + Math.random() * 2.5,
                alpha: 0.04 + Math.random() * 0.1,
            })
        }

        const draw = (time: number) => {
            const w = canvas.width, h = canvas.height

            const bg = ctx.createRadialGradient(
                w * 0.5, h * 0.3, 0,
                w * 0.5, h * 0.3, Math.max(w, h) * 1.0
            )
            bg.addColorStop(0, '#dde6ee')
            bg.addColorStop(0.3, '#c5d2e0')
            bg.addColorStop(0.6, '#9aafc2')
            bg.addColorStop(1, '#6a8098')
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, w, h)

            for (const p of patches) {
                p.x += p.speedX
                p.y += p.speedY
                if (p.x > w + p.r) p.x = -p.r
                if (p.x < -p.r * 2) p.x = w + p.r
                if (p.y > h + p.r) p.y = -p.r
                if (p.y < -p.r) p.y = h + p.r

                const pulseAlpha = p.alpha * (0.7 + 0.3 * Math.sin(time * p.alphaSpeed + p.alphaPhase))
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
                grad.addColorStop(0, `rgba(210, 225, 242, ${pulseAlpha})`)
                grad.addColorStop(0.5, `rgba(210, 225, 242, ${pulseAlpha * 0.5})`)
                grad.addColorStop(1, 'rgba(210, 225, 242, 0)')
                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fill()
            }

            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy
                if (p.x < -10) p.x = w + 10
                if (p.x > w + 10) p.x = -10
                if (p.y < -10) p.y = h + 10
                if (p.y > h + 10) p.y = -10

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(220, 235, 250, ${p.alpha})`
                ctx.fill()
            }

            animId = requestAnimationFrame(draw)
        }

        draw(0)

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
