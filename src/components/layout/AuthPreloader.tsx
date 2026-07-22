'use client'
import { useEffect } from 'react'

export default function AuthPreloader() {
    useEffect(() => {
        import('@/lib/auth').then(m => m.AuthManager.current())
    }, [])
    return null
}
