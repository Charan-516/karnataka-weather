'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { AuthManager } from '@/lib/auth'

import { WEATHER_CONTENT } from '@/lib/weatherContent'
import { DISTRICT_CONTENT } from '@/lib/districtContent'

const WeatherBackground = dynamic(
    () => import('@/systems/weather/WeatherBackground'),
    { ssr: false }
)

const DARK_CONDITIONS = ['Rainy', 'Stormy', 'Cloudy']

const CONDITION_TEXT_COLORS: Record<string, string> = {
  Sunny: '#3b2d8a',
  Cloudy: '#b8860b',
  Rainy: '#f5c8a0',
  Stormy: '#b8d44a',
  Foggy: '#8b5a3a',
  Windy: '#9a5a7a',
}

function useScrollReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el) } },
            { threshold }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])

    return { ref, visible }
}

function RevealSection({ children, delay = 0, className }: {
    children: React.ReactNode
    delay?: number
    className?: string
}) {
    const { ref, visible } = useScrollReveal()
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
            }}
        >
            {children}
        </div>
    )
}

function ParallaxSection({ children, speed = 0.3 }: { children: React.ReactNode; speed?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const onScroll = () => {
            const progress = Math.min(1, window.scrollY / window.innerHeight)
            const s = 1 - progress * 0.12
            el.style.transform = `scale(${s})`
            el.style.opacity = `${1 - progress * 0.35}`
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [speed])
    return <div ref={ref} style={{ willChange: 'transform' }}>{children}</div>
}

function WeatherStickman({ condition }: { condition: string }) {
    const color = CONDITION_TEXT_COLORS[condition] || '#3d1f0a'
    const props = { stroke: color, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
    const sunny = (
        <g>
            <circle cx="50" cy="30" r="8" {...props} />
            <line x1="50" y1="38" x2="50" y2="65" {...props} />
            <line x1="50" y1="45" x2="35" y2="50" {...props} />
            <line x1="50" y1="45" x2="65" y2="50" {...props} />
            <line x1="50" y1="65" x2="40" y2="80" {...props} />
            <line x1="50" y1="65" x2="60" y2="80" {...props} />
            <line x1="35" y1="58" x2="65" y2="58" {...props} strokeDasharray="2 2" />
            <circle cx="42" cy="28" r="1.5" fill={color} />
            <path d="M48 32 Q50 34 52 32" {...props} />
        </g>
    )
    const rainy = (
        <g>
            <circle cx="50" cy="28" r="8" {...props} />
            <line x1="50" y1="36" x2="50" y2="60" {...props} />
            <line x1="50" y1="42" x2="40" y2="48" {...props} />
            <line x1="50" y1="42" x2="60" y2="48" {...props} />
            <line x1="50" y1="60" x2="44" y2="72" {...props} />
            <line x1="50" y1="60" x2="56" y2="72" {...props} />
            <path d="M44 50 Q50 48 56 50" {...props} />
            <line x1="40" y1="18" x2="38" y2="22" {...props} strokeDasharray="2 2" />
            <line x1="58" y1="14" x2="55" y2="19" {...props} strokeDasharray="2 2" />
        </g>
    )
    const cloudy = (
        <g>
            <circle cx="50" cy="28" r="8" {...props} />
            <line x1="50" y1="36" x2="50" y2="62" {...props} />
            <line x1="50" y1="44" x2="38" y2="50" {...props} />
            <line x1="50" y1="44" x2="62" y2="50" {...props} />
            <line x1="50" y1="62" x2="40" y2="78" {...props} />
            <line x1="50" y1="62" x2="60" y2="78" {...props} />
            <circle cx="38" cy="26" r="0" fill={color} />
        </g>
    )
    const stormy = (
        <g>
            <circle cx="50" cy="26" r="8" {...props} />
            <line x1="50" y1="34" x2="50" y2="52" {...props} />
            <line x1="50" y1="40" x2="40" y2="46" {...props} />
            <line x1="42" y1="52" x2="38" y2="62" {...props} strokeWidth="2.5" />
            <line x1="50" y1="52" x2="46" y2="62" {...props} strokeWidth="2.5" />
            <line x1="55" y1="52" x2="52" y2="62" {...props} strokeWidth="2.5" />
            <line x1="40" y1="12" x2="38" y2="18" {...props} strokeWidth="2.5" />
            <line x1="56" y1="10" x2="53" y2="16" {...props} strokeWidth="2.5" />
            <line x1="62" y1="16" x2="60" y2="20" {...props} strokeWidth="2" />
        </g>
    )
    const foggy = (
        <g>
            <circle cx="50" cy="28" r="8" {...props} />
            <line x1="50" y1="36" x2="50" y2="64" {...props} />
            <line x1="50" y1="44" x2="38" y2="52" {...props} />
            <line x1="50" y1="44" x2="62" y2="52" {...props} />
            <line x1="48" y1="64" x2="44" y2="78" {...props} />
            <line x1="52" y1="64" x2="56" y2="78" {...props} />
            <line x1="30" y1="72" x2="70" y2="72" {...props} strokeWidth="1.5" opacity="0.4" />
            <line x1="32" y1="78" x2="68" y2="78" {...props} strokeWidth="1.5" opacity="0.3" />
            <line x1="35" y1="84" x2="65" y2="84" {...props} strokeWidth="1.5" opacity="0.2" />
        </g>
    )
    const windy = (
        <g>
            <circle cx="50" cy="26" r="8" {...props} />
            <line x1="50" y1="34" x2="50" y2="56" {...props} />
            <line x1="50" y1="42" x2="62" y2="46" {...props} />
            <line x1="48" y1="56" x2="56" y2="68" {...props} />
            <line x1="48" y1="56" x2="58" y2="66" {...props} />
            <line x1="30" y1="54" x2="70" y2="54" {...props} strokeDasharray="4 3" opacity="0.5" />
            <line x1="25" y1="60" x2="65" y2="60" {...props} strokeDasharray="6 4" opacity="0.3" />
            <line x1="35" y1="66" x2="60" y2="66" {...props} strokeDasharray="3 3" opacity="0.2" />
        </g>
    )
    const poses: Record<string, React.ReactNode> = { Sunny: sunny, Cloudy: cloudy, Rainy: rainy, Stormy: stormy, Foggy: foggy, Windy: windy }
    return (
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute', bottom: '-10px', right: '20px', opacity: 0.7 }}>
            {poses[condition] || sunny}
        </svg>
    )
}

function ResultContent() {
    const router = useRouter()
    const params = useSearchParams()
    const city = params.get('city') || 'Karnataka'
    const condition = params.get('condition') || 'Sunny'
    const confidence = parseFloat(params.get('confidence') || '0.75')
    const isDark = DARK_CONDITIONS.includes(condition)
    const accentColor = CONDITION_TEXT_COLORS[condition] || (isDark ? '#fff8f0' : '#3d1f0a')
    const textColor = accentColor
    const mutedColor = accentColor
    const weatherContent = WEATHER_CONTENT[condition] || WEATHER_CONTENT.Sunny
    const normalizedCity = city.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '')
    const districtKey = Object.keys(DISTRICT_CONTENT).find(
        k => k.replace(/\s+/g, '').toLowerCase() === normalizedCity.toLowerCase()
    )
    const districtContent = districtKey ? DISTRICT_CONTENT[districtKey] : null

    useEffect(() => {
        AuthManager.current().then(u => { if (!u) router.replace('/') })
    }, [router])

    const [profileOpen, setProfileOpen] = useState(false)
    const [user, setUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(null)
    const [editName, setEditName] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        AuthManager.current().then(u => {
            if (u) {
                setUser({ name: u.name, email: u.email, avatarUrl: u.avatarUrl })
                setEditName(u.name)
            }
        })
    }, [])

    const handleSaveName = async () => {
        if (!editName.trim()) return
        setSaving(true)
        const result = await AuthManager.updateProfile(editName.trim())
        if (result.success) {
            setUser(prev => prev ? { ...prev, name: editName.trim() } : prev)
        }
        setSaving(false)
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const result = await AuthManager.uploadAvatar(file)
        if (result.success && result.url) {
            setUser(prev => prev ? { ...prev, avatarUrl: result.url } : prev)
        }
    }

    const handleLogout = async () => {
        await AuthManager.logout()
        router.push('/')
    }

    return (
        <>
            <WeatherBackground condition={condition} />

            {/* Profile Button — Top Right */}
            <button
                onClick={() => { setEditName(user?.name || ''); setProfileOpen(true) }}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 100,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : accentColor}30`,
                    background: isDark ? 'rgba(255,255,255,0.08)' : `${accentColor}12`,
                    backdropFilter: 'blur(16px)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.14)' : `${accentColor}20` }}
                onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : `${accentColor}12` }}
            >
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                )}
            </button>

            {/* Profile Modal */}
            {profileOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(6px)',
                }}
                    onClick={e => { if (e.target === e.currentTarget) setProfileOpen(false) }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            background: 'rgba(250, 242, 232, 0.92)',
                            backdropFilter: 'blur(40px)',
                            border: '1px solid rgba(232, 173, 140, 0.3)',
                            borderRadius: '28px',
                            padding: '36px',
                            width: 'min(420px, 90vw)',
                            boxShadow: '0 24px 80px rgba(180,80,20,0.2)',
                        }}
                    >
                        {/* Close */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                            <button
                                onClick={() => setProfileOpen(false)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#3a1a08', opacity: 0.4, fontSize: '20px', lineHeight: 1, padding: '4px',
                                }}
                            >✕</button>
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            {/* Avatar */}
                            <label style={{
                                display: 'inline-block',
                                width: '88px', height: '88px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: `2px solid ${accentColor}40`,
                                boxShadow: `0 4px 20px ${accentColor}20`,
                                position: 'relative',
                                background: `${accentColor}10`,
                            }}>
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{
                                        width: '100%', height: '100%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: accentColor, fontSize: '28px', fontWeight: 300,
                                        fontFamily: 'Playfair Display, serif',
                                    }}>
                                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.2s',
                                    fontSize: '10px', color: '#fff',
                                    fontFamily: 'Space Mono, monospace',
                                    letterSpacing: '0.1em',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                                    onMouseLeave={e => { e.currentTarget.style.opacity = '0' }}
                                >
                                    Change
                                </div>
                                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                            </label>
                        </div>

                        {/* Name */}
                        <div style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '9px', letterSpacing: '0.2em',
                            textTransform: 'uppercase', color: '#2a1a0a',
                            marginBottom: '6px', opacity: 0.6,
                        }}>Name</div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                placeholder={user?.name || 'Your name'}
                                style={{
                                    flex: 1,
                                    fontFamily: 'Playfair Display, serif',
                                    fontSize: '18px',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    border: `1px solid ${accentColor}30`,
                                    background: `${accentColor}08`,
                                    color: '#3d1f0a',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={handleSaveName}
                                disabled={saving || !editName.trim()}
                                style={{
                                    background: accentColor,
                                    color: isDark ? '#3d1f0a' : '#fff8f0',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '0 18px',
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: '10px',
                                    letterSpacing: '0.1em',
                                    cursor: 'pointer',
                                    opacity: saving || !editName.trim() ? 0.5 : 1,
                                }}
                            >
                                {saving ? '...' : 'Save'}
                            </button>
                        </div>

                        {/* Email */}
                        <div style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '9px', letterSpacing: '0.2em',
                            textTransform: 'uppercase', color: '#2a1a0a',
                            marginBottom: '4px', opacity: 0.6,
                        }}>Email</div>
                        <div style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '16px', color: '#3d1f0a',
                            marginBottom: '28px', opacity: 0.7,
                        }}>
                            {user?.email || '-'}
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: `1px solid ${accentColor}30`,
                                borderRadius: '12px',
                                padding: '12px',
                                color: '#a04020',
                                fontFamily: 'Space Mono, monospace',
                                fontSize: '10px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,64,32,0.08)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                            Logout
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Hero Section — Sticky Parallax Zoom */}
            <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
                    <ParallaxSection speed={0.4}>
                        <div style={{
                            position: 'relative',
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '100vh',
                            textAlign: 'center',
                            padding: '40px 20px',
                        }}>
                            <WeatherStickman condition={condition} />

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                style={{
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: '11px',
                                    letterSpacing: '0.3em',
                                    color: mutedColor,
                                    marginBottom: '16px',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {city}
                            </motion.p>

                            <motion.h1
                                initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    fontFamily: 'Playfair Display, serif',
                                    fontSize: 'clamp(72px, 14vw, 160px)',
                                    fontWeight: 300,
                                    color: textColor,
                                    letterSpacing: '-0.04em',
                                    lineHeight: 0.85,
                                    marginBottom: '20px',
                                    textShadow: isDark ? '0 4px 60px rgba(0,0,0,0.4)' : '0 2px 20px rgba(0,0,0,0.06)',
                                }}
                            >
                                {condition}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1.0 }}
                                style={{
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: '10px',
                                    letterSpacing: '0.25em',
                                    color: mutedColor,
                                    marginBottom: '8px',
                                    marginTop: '18px',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {weatherContent.subtitle}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1.2 }}
                                style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontSize: '13px',
                                    fontWeight: 300,
                                    color: mutedColor,
                                    maxWidth: '480px',
                                    lineHeight: 1.6,
                                    marginBottom: '12px',
                                }}
                            >
                                {weatherContent.description}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1.3 }}
                                style={{
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: '12px',
                                    letterSpacing: '0.15em',
                                    color: mutedColor,
                                    marginBottom: '40px',
                                }}
                            >
                                {Math.round(confidence * 100)}% atmospheric confidence
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.5 }}
                                style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
                            >
                                <button
                                    onClick={() => router.push(`/predict?city=${encodeURIComponent(city)}`)}
                                    style={{
                                background: isDark ? `${accentColor}18` : accentColor,
                                color: isDark ? accentColor : '#fff8f0',
                                border: isDark ? `1px solid ${accentColor}40` : 'none',
                                        borderRadius: '8px',
                                        padding: '14px 28px',
                                        fontFamily: 'Space Mono, monospace',
                                        fontSize: '10px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        backdropFilter: isDark ? 'blur(12px)' : 'none',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    Adjust
                                </button>
                                <button
                                    onClick={() => router.push('/map')}
                                    style={{
                                        background: 'transparent',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : accentColor}40`,
                                        borderRadius: '8px',
                                        padding: '14px 28px',
                                        color: mutedColor,
                                        fontFamily: 'Space Mono, monospace',
                                        fontSize: '10px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        backdropFilter: isDark ? 'blur(12px)' : 'none',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    New City
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 2.0 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: '9px',
                                    letterSpacing: '0.2em',
                                    color: mutedColor,
                                    animation: 'breathe 3s ease-in-out infinite',
                                }}
                            >
                                Scroll to explore ↓
                            </motion.div>
                        </div>
                    </ParallaxSection>
                </div>
                <div style={{ height: '100vh', pointerEvents: 'none' }} />
            </div>

            {/* Content Sections */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '960px',
                margin: '0 auto',
                padding: '60px 20px 80px',
            }}>
                {/* Section Label */}
                <RevealSection delay={0.1}>
                    <div style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '10px',
                        letterSpacing: '0.3em',
                        color: mutedColor,
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                    }}>
                        Weather Gallery
                    </div>
                    <div style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '28px',
                        fontWeight: 300,
                        color: textColor,
                        letterSpacing: '-0.03em',
                        marginBottom: '40px',
                    }}>
                        {condition} in Focus
                    </div>
                </RevealSection>

                {/* Cards Grid — Pinterest-style alternating layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {(districtContent?.cards || weatherContent.cards).map((card, i) => (
                        <RevealSection key={i} delay={0.1 + i * 0.15}>
                            <div className="result-card-row" style={{
                                display: 'flex',
                                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                                gap: '24px',
                                alignItems: 'stretch',
                                background: isDark
                                    ? 'rgba(255,255,255,0.06)'
                                    : `${accentColor}08`,
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : accentColor}20`,
                                boxShadow: isDark
                                    ? '0 8px 40px rgba(0,0,0,0.2)'
                                    : `0 8px 40px ${accentColor}15`,
                            }}>
                                <div style={{
                                    flex: '0 0 45%',
                                    minHeight: '280px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                }}>
                                    <img
                                        src={card.image}
                                        alt={card.alt}
                                        loading="lazy"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                            transition: 'transform 0.6s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                                    />
                                </div>
                                <div style={{
                                    flex: 1,
                                    padding: '28px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}>
                                    <div style={{
                                        fontFamily: 'Playfair Display, serif',
                                        fontSize: '22px',
                                        fontWeight: 300,
                                        color: textColor,
                                        letterSpacing: '-0.02em',
                                        marginBottom: '12px',
                                    }}>
                                        {card.title}
                                    </div>
                                    <p style={{
                                        fontFamily: 'Montserrat, sans-serif',
                                        fontSize: '13px',
                                        fontWeight: 300,
                                        color: mutedColor,
                                        lineHeight: 1.8,
                                    }}>
                                        {card.text}
                                    </p>
                                </div>
                            </div>
                        </RevealSection>
                    ))}
                </div>

                {/* Travel Section */}
                <RevealSection delay={0.3}>
                    <div style={{
                        marginTop: '80px',
                        marginBottom: '40px',
                    }}>
                        <div style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '10px',
                            letterSpacing: '0.3em',
                            color: mutedColor,
                            textTransform: 'uppercase',
                            marginBottom: '8px',
                        }}>
                            Travel Ideas
                        </div>
                        <div style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '28px',
                            fontWeight: 300,
                            color: textColor,
                            letterSpacing: '-0.03em',
                            marginBottom: '12px',
                        }}>
                            Best Places for {condition} Weather
                        </div>
                        <p style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '13px',
                            fontWeight: 300,
                            color: mutedColor,
                            lineHeight: 1.6,
                            maxWidth: '600px',
                            marginBottom: '32px',
                        }}>
                            Karnataka offers incredible destinations that are at their absolute best during {condition.toLowerCase()} conditions.
                        </p>
                    </div>
                </RevealSection>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {(districtContent?.travel || weatherContent.travel).map((item, i) => (
                        <RevealSection key={i} delay={0.2 + i * 0.15}>
                            <div className="result-travel-row" style={{
                                display: 'flex',
                                gap: '20px',
                                background: isDark
                                    ? 'rgba(255,255,255,0.04)'
                                    : `${accentColor}06`,
                                backdropFilter: 'blur(16px)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : accentColor}18`,
                            }}>
                                <div style={{
                                    flex: '0 0 180px',
                                    minHeight: '160px',
                                    overflow: 'hidden',
                                }}>
                                    <img
                                        src={item.image}
                                        alt={item.destination}
                                        loading="lazy"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                </div>
                                <div style={{
                                    flex: 1,
                                    padding: '20px 20px 20px 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}>
                                    <div style={{
                                        fontFamily: 'Playfair Display, serif',
                                        fontSize: '20px',
                                        fontWeight: 300,
                                        color: textColor,
                                        letterSpacing: '-0.02em',
                                        marginBottom: '6px',
                                    }}>
                                        {item.destination}
                                    </div>
                                    <p style={{
                                        fontFamily: 'Montserrat, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 300,
                                        color: mutedColor,
                                        lineHeight: 1.7,
                                        marginBottom: '8px',
                                    }}>
                                        {item.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                    }}>
                                        <span style={{
                                            fontFamily: 'Space Mono, monospace',
                                            fontSize: '9px',
                                            letterSpacing: '0.1em',
                                            color: mutedColor,
                                            background: isDark ? 'rgba(255,255,255,0.08)' : `${accentColor}18`,
                                            padding: '4px 10px',
                                            borderRadius: '99px',
                                        }}>
                                            Best: {item.bestTime}
                                        </span>
                                        <span style={{
                                            fontFamily: 'Space Mono, monospace',
                                            fontSize: '9px',
                                            letterSpacing: '0.05em',
                                            color: mutedColor,
                                            fontStyle: 'italic',
                                        }}>
                                            💡 {item.tip}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </RevealSection>
                    ))}
                </div>

                {/* Tips Section */}
                <RevealSection delay={0.4}>
                    <div style={{
                        marginTop: '80px',
                        marginBottom: '32px',
                    }}>
                        <div style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '10px',
                            letterSpacing: '0.3em',
                            color: mutedColor,
                            textTransform: 'uppercase',
                            marginBottom: '8px',
                        }}>
                            Pro Tips
                        </div>
                        <div style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '28px',
                            fontWeight: 300,
                            color: textColor,
                            letterSpacing: '-0.03em',
                            marginBottom: '24px',
                        }}>
                            Making the Most of {condition} Weather
                        </div>
                    </div>
                </RevealSection>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '16px',
                }}>
                    {(districtContent?.tips || weatherContent.tips).map((tip, i) => (
                        <RevealSection key={i} delay={0.2 + i * 0.1}>
                            <div style={{
                                background: isDark
                                    ? 'rgba(255,255,255,0.05)'
                                    : `${accentColor}06`,
                                backdropFilter: 'blur(16px)',
                                borderRadius: '14px',
                                padding: '20px',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : accentColor}18`,
                            }}>
                                <div style={{
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: '24px',
                                    color: isDark ? 'rgba(255,255,255,0.2)' : `${accentColor}30`,
                                    marginBottom: '8px',
                                }}>
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                <p style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontSize: '12px',
                                    fontWeight: 400,
                                    color: textColor,
                                    lineHeight: 1.6,
                                }}>
                                    {tip}
                                </p>
                            </div>
                        </RevealSection>
                    ))}
                </div>

                {/* Footer */}
                <RevealSection delay={0.5}>
                    <div style={{
                        marginTop: '80px',
                        padding: '40px 0',
                        textAlign: 'center',
                        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : accentColor}20`,
                    }}>
                        <div style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '18px',
                            fontWeight: 300,
                            color: mutedColor,
                            marginBottom: '16px',
                        }}>
                            Karnataka Weather
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => router.push(`/predict?city=${encodeURIComponent(city)}`)}
                                    style={{
                                        background: 'transparent',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : accentColor}40`,
                                        borderRadius: '8px',
                                        padding: '10px 20px',
                                        color: mutedColor,
                                        fontFamily: 'Space Mono, monospace',
                                        fontSize: '9px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ← Adjust Values
                                </button>
                                <button
                                    onClick={() => router.push('/map')}
                                    style={{
                                        background: isDark ? `${accentColor}18` : accentColor,
                                        color: isDark ? accentColor : '#fff8f0',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 20px',
                                        fontFamily: 'Space Mono, monospace',
                                        fontSize: '9px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                    }}
                                >
                                    New City
                                </button>
                        </div>
                    </div>
                </RevealSection>
            </div>
        </>
    )
}

export default function ResultPage() {
    return (
        <Suspense fallback={
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f0e8',
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#2a1508',
            }}>
                Loading...
            </div>
        }>
            <ResultContent />
        </Suspense>
    )
}