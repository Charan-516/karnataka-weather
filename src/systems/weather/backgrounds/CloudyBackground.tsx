'use client'
import { useRef, useEffect } from 'react'

export default function CloudyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        type Cloud = { x: number; y: number; w: number; h: number; speed: number; alpha: number }
        const layers: Cloud[][] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        for (let layer = 0; layer < 3; layer++) {
            const clouds: Cloud[] = []
            for (let i = 0; i < 6 + layer * 2; i++) {
                clouds.push({
                    x: Math.random() * canvas.width * 1.5 - canvas.width * 0.25,
                    y: canvas.height * (0.1 + Math.random() * 0.6),
                    w: 120 + Math.random() * 200 - layer * 30,
                    h: 40 + Math.random() * 60 - layer * 10,
                    speed: 0.15 + layer * 0.1 + Math.random() * 0.2,
                    alpha: 0.15 + layer * 0.08 + Math.random() * 0.1,
                })
            }
            layers.push(clouds)
        }

        const draw = () => {
            const grad = ctx.createRadialGradient(
                canvas.width * 0.5, canvas.height * 0.3, 0,
                canvas.width * 0.5, canvas.height * 0.3, Math.max(canvas.width, canvas.height) * 0.8
            )
            grad.addColorStop(0, '#c8d4e0')
            grad.addColorStop(0.4, '#9aacbf')
            grad.addColorStop(0.7, '#6a7d94')
            grad.addColorStop(1, '#3a4a5a')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            layers.forEach((clouds) => {
                clouds.forEach((c) => {
                    c.x += c.speed
                    if (c.x > canvas.width + c.w) c.x = -c.w * 2

                    ctx.beginPath()
                    ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(200, 212, 224, ${c.alpha})`
                    ctx.fill()

                    ctx.beginPath()
                    ctx.ellipse(c.x - c.w * 0.25, c.y - c.h * 0.2, c.w * 0.35, c.h * 0.4, 0, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(210, 220, 232, ${c.alpha * 0.8})`
                    ctx.fill()

                    ctx.beginPath()
                    ctx.ellipse(c.x + c.w * 0.3, c.y - c.h * 0.15, c.w * 0.3, c.h * 0.35, 0, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(190, 204, 218, ${c.alpha * 0.7})`
                    ctx.fill()
                })
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
