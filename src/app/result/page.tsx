'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useRef, useState, useCallback } from 'react'
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
            const rect = el.getBoundingClientRect()
            const offset = (window.innerHeight - rect.top) * speed
            el.style.transform = `translateY(${Math.max(-100, Math.min(100, offset * 0.15))}px)`
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [speed])
    return <div ref={ref}>{children}</div>
}

function ResultContent() {
    const router = useRouter()
    const params = useSearchParams()
    const city = params.get('city') || 'Karnataka'
    const condition = params.get('condition') || 'Sunny'
    const confidence = parseFloat(params.get('confidence') || '0.75')
    const isDark = DARK_CONDITIONS.includes(condition)
    const textColor = isDark ? '#fff8f0' : '#3d1f0a'
    const mutedColor = isDark ? 'rgba(255,248,240,0.75)' : '#3a2010'
    const weatherContent = WEATHER_CONTENT[condition] || WEATHER_CONTENT.Sunny
    const normalizedCity = city.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '')
    const districtKey = Object.keys(DISTRICT_CONTENT).find(
        k => k.replace(/\s+/g, '').toLowerCase() === normalizedCity.toLowerCase()
    )
    const districtContent = districtKey ? DISTRICT_CONTENT[districtKey] : null

    useEffect(() => {
        if (!AuthManager.current()) router.replace('/')
    }, [router])

    return (
        <>
            <WeatherBackground condition={condition} />

            {/* Hero Section — Parallax */}
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
                                background: 'transparent',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(139, 69, 19, 0.3)'}`,
                                borderRadius: '8px',
                                padding: '14px 28px',
                                color: isDark ? '#fff' : '#8b4513',
                                fontFamily: 'Space Mono, monospace',
                                fontSize: '10px',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            ← Adjust
                        </button>
                        <button
                            onClick={() => router.push('/map')}
                            style={{
                                background: isDark ? 'rgba(255,255,255,0.15)' : '#8b4513',
                                color: isDark ? '#fff' : '#fff8f0',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '14px 28px',
                                fontFamily: 'Space Mono, monospace',
                                fontSize: '10px',
                                letterSpacing: '0.18em',
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
                                    : 'rgba(255, 245, 238, 0.6)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232, 173, 140, 0.25)'}`,
                                boxShadow: isDark
                                    ? '0 8px 40px rgba(0,0,0,0.2)'
                                    : '0 8px 40px rgba(139,69,19,0.08)',
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
                                    : 'rgba(255, 245, 238, 0.5)',
                                backdropFilter: 'blur(16px)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232, 173, 140, 0.2)'}`,
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
                                            color: isDark ? 'rgba(255,255,255,0.65)' : '#3a2010',
                                            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,173,140,0.2)',
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
                                    : 'rgba(255, 245, 238, 0.5)',
                                backdropFilter: 'blur(16px)',
                                borderRadius: '14px',
                                padding: '20px',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232, 173, 140, 0.2)'}`,
                            }}>
                                <div style={{
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: '24px',
                                    color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(139,69,19,0.2)',
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
                        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232, 173, 140, 0.2)'}`,
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
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(139,69,19,0.2)'}`,
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
                                    background: isDark ? 'rgba(255,255,255,0.1)' : '#8b4513',
                                    color: isDark ? '#fff' : '#fff8f0',
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