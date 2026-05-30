'use client'
import { useRef, useEffect } from 'react'

export default function WindyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        let time = 0
        type Streak = { x: number; y: number; speed: number; baseSpeed: number; length: number; alpha: number; width: number; phase: number }
        type Leaf = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; rot: number; rotSpeed: number }
        const streaks: Streak[] = []
        const leaves: Leaf[] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        for (let i = 0; i < 120; i++) {
            streaks.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: 2 + Math.random() * 6,
                baseSpeed: 2 + Math.random() * 6,
                length: 40 + Math.random() * 100,
                alpha: 0.08 + Math.random() * 0.18,
                width: 1 + Math.random() * 2.5,
                phase: Math.random() * Math.PI * 2,
            })
        }

        for (let i = 0; i < 20; i++) {
            leaves.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: 3 + Math.random() * 5,
                vy: -1.5 + Math.random() * 3,
                size: 3 + Math.random() * 5,
                alpha: 0.3 + Math.random() * 0.4,
                rot: Math.random() * Math.PI * 2,
                rotSpeed: 0.02 + Math.random() * 0.05,
            })
        }

        const draw = () => {
            const w = canvas.width, h = canvas.height
            time++

            const grad = ctx.createRadialGradient(
                w * 0.4, h * 0.5, 0,
                w * 0.4, h * 0.5, Math.max(w, h) * 0.9
            )
            grad.addColorStop(0, '#e8f5e9')
            grad.addColorStop(0.3, '#c8e6c9')
            grad.addColorStop(0.6, '#a5d6a7')
            grad.addColorStop(1, '#6a8a6a')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)

            streaks.forEach((s) => {
                const gust = 0.7 + 0.3 * Math.sin(time * 0.02 + s.phase)
                s.speed = s.baseSpeed * gust
                s.x += s.speed
                if (s.x > w + s.length) {
                    s.x = -s.length
                    s.y = Math.random() * h
                }

                const grad2 = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y)
                grad2.addColorStop(0, `rgba(180, 220, 180, 0)`)
                grad2.addColorStop(0.2, `rgba(180, 220, 180, ${s.alpha * gust})`)
                grad2.addColorStop(0.8, `rgba(180, 220, 180, ${s.alpha * gust})`)
                grad2.addColorStop(1, `rgba(180, 220, 180, 0)`)

                ctx.beginPath()
                ctx.moveTo(s.x, s.y)
                const midX = s.x + s.length * 0.5
                const midY = s.y + Math.sin(time * 0.03 + s.phase) * 4
                ctx.quadraticCurveTo(midX, midY, s.x + s.length, s.y)
                ctx.strokeStyle = grad2
                ctx.lineWidth = s.width
                ctx.stroke()
            })

            leaves.forEach((l) => {
                l.x += l.vx
                l.y += l.vy + Math.sin(time * 0.04 + l.rot) * 0.3
                l.rot += l.rotSpeed
                if (l.x > w + 20) {
                    l.x = -20
                    l.y = Math.random() * h
                }
                if (l.y > h + 20) l.y = -20
                if (l.y < -20) l.y = h + 20

                ctx.save()
                ctx.translate(l.x, l.y)
                ctx.rotate(l.rot)

                ctx.beginPath()
                ctx.ellipse(0, 0, l.size * 0.6, l.size * 0.3, 0, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(90, 130, 70, ${l.alpha})`
                ctx.fill()

                ctx.beginPath()
                ctx.moveTo(0, -l.size * 0.1)
                ctx.lineTo(0, l.size * 0.1)
                ctx.strokeStyle = `rgba(60, 90, 40, ${l.alpha * 0.6})`
                ctx.lineWidth = 1
                ctx.stroke()

                ctx.restore()
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
