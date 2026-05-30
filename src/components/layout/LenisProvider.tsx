'use client'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
        lenisRef.current = lenis

        let running = true
        function raf(time: number) {
            if (!running) return
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        const ro = new ResizeObserver(() => lenis.resize())
        ro.observe(document.body)

        return () => {
            running = false
            lenis.destroy()
            lenisRef.current = null
            ro.disconnect()
        }
    }, [])

    return <>{children}</>
}
