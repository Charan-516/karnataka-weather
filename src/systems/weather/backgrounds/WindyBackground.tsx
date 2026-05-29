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
        type Streak = { x: number; y: number; speed: number; length: number; alpha: number; width: number }
        let streaks: Streak[] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        for (let i = 0; i < 150; i++) {
            streaks.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: 2 + Math.random() * 6,
                length: 30 + Math.random() * 80,
                alpha: 0.05 + Math.random() * 0.15,
                width: 1 + Math.random() * 2,
            })
        }

        const draw = () => {
            const grad = ctx.createRadialGradient(
                canvas.width * 0.4, canvas.height * 0.5, 0,
                canvas.width * 0.4, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.9
            )
            grad.addColorStop(0, '#e8f5e9')
            grad.addColorStop(0.3, '#c8e6c9')
            grad.addColorStop(0.6, '#a5d6a7')
            grad.addColorStop(1, '#6a8a6a')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            streaks.forEach((s) => {
                s.x += s.speed
                if (s.x > canvas.width + s.length) {
                    s.x = -s.length
                    s.y = Math.random() * canvas.height
                }

                const grad2 = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y)
                grad2.addColorStop(0, `rgba(180, 220, 180, 0)`)
                grad2.addColorStop(0.3, `rgba(180, 220, 180, ${s.alpha})`)
                grad2.addColorStop(0.7, `rgba(180, 220, 180, ${s.alpha})`)
                grad2.addColorStop(1, `rgba(180, 220, 180, 0)`)

                ctx.beginPath()
                ctx.moveTo(s.x, s.y)
                ctx.lineTo(s.x + s.length, s.y)
                ctx.strokeStyle = grad2
                ctx.lineWidth = s.width
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
