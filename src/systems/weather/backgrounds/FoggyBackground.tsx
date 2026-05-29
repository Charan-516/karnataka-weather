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
        let bgGrad: CanvasGradient | null = null
        type FogPatch = {
            x: number; y: number; r: number
            speedX: number; speedY: number
            alpha: number
        }
        let patches: FogPatch[] = []

        const resize = () => {
            const w = window.innerWidth, h = window.innerHeight
            canvas.width = w
            canvas.height = h
            bgGrad = ctx.createRadialGradient(
                w * 0.5, h * 0.3, 0,
                w * 0.5, h * 0.3, Math.max(w, h) * 1.0
            )
            bgGrad.addColorStop(0, '#dde6ee')
            bgGrad.addColorStop(0.3, '#c5d2e0')
            bgGrad.addColorStop(0.6, '#9aafc2')
            bgGrad.addColorStop(1, '#6a8098')
        }
        resize()
        window.addEventListener('resize', resize)

        for (let i = 0; i < 5; i++) {
            patches.push({
                x: Math.random() * canvas.width * 1.5 - canvas.width * 0.25,
                y: Math.random() * canvas.height * 1.2 - canvas.height * 0.1,
                r: 150 + Math.random() * 300,
                speedX: -0.15 - Math.random() * 0.25,
                speedY: 0.03 + Math.random() * 0.06,
                alpha: 0.06 + Math.random() * 0.08,
            })
        }

        const draw = () => {
            const w = canvas.width, h = canvas.height
            if (bgGrad) ctx.fillStyle = bgGrad
            ctx.fillRect(0, 0, w, h)

            for (const p of patches) {
                p.x += p.speedX
                p.y += p.speedY
                if (p.x > w + p.r) p.x = -p.r
                if (p.x < -p.r * 2) p.x = w + p.r
                if (p.y > h + p.r) p.y = -p.r
                if (p.y < -p.r) p.y = h + p.r

                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
                grad.addColorStop(0, `rgba(210, 225, 242, ${p.alpha})`)
                grad.addColorStop(0.6, `rgba(210, 225, 242, ${p.alpha * 0.4})`)
                grad.addColorStop(1, 'rgba(210, 225, 242, 0)')
                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fill()
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
