'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AuthManager } from '@/lib/auth'
import { GEO_DATA } from '@/lib/karnatakaDistricts'

const LNG_MIN = 74.051, LNG_MAX = 78.588
const LAT_MIN = 11.582, LAT_MAX = 18.477
const VW = 500, VH = 560, PADDING = 20

function lngToX(lng: number) {
    return PADDING + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (VW - PADDING * 2)
}

function latToY(lat: number) {
    return PADDING + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (VH - PADDING * 2)
}

function ringToPath(ring: number[][]): string {
    if (!ring || ring.length < 2) return ''
    let d = `M ${lngToX(ring[0][0]).toFixed(2)} ${latToY(ring[0][1]).toFixed(2)}`
    for (let i = 1; i < ring.length; i++) {
        d += ` L ${lngToX(ring[i][0]).toFixed(2)} ${latToY(ring[i][1]).toFixed(2)}`
    }
    return d + ' Z'
}

interface Tooltip {
    visible: boolean
    name: string
    x: number
    y: number
}

export default function MapPage() {
    const router = useRouter()
    const [tooltip, setTooltip] = useState<Tooltip>({
        visible: false, name: '', x: 0, y: 0
    })
    const [selected, setSelected] = useState<string | null>(null)
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

    useEffect(() => {
        AuthManager.current().then(u => {
            if (!u) router.replace('/')
        })
    }, [router])

    const handleClick = (district: string) => {
        setSelected(district)
    }

    const handleProceed = () => {
        if (!selected) return
        router.push(`/predict?city=${encodeURIComponent(selected)}`)
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'radial-gradient(ellipse 120% 100% at 30% 20%, #fde8d8 0%, #f5cdb0 30%, #f0b890 55%, #e8a070 80%, #d4845a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}>

            {/* Tooltip */}
            {tooltip.visible && (
                <div style={{
                    position: 'fixed',
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: 'translate(-50%, calc(-100% - 14px))',
                    pointerEvents: 'none',
                    zIndex: 100,
                    background: 'rgba(255, 245, 235, 0.92)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(232, 173, 140, 0.5)',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    boxShadow: '0 8px 32px rgba(180,80,20,0.18)',
                    whiteSpace: 'nowrap',
                }}>
                    <div style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '17px',
                        color: '#3d1f0a',
                    }}>
                        {tooltip.name}
                    </div>
                    <div style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '10px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#3a2010',
                        marginTop: '2px',
                    }}>
                        Click to select
                    </div>
                </div>
            )}

            {/* Main Glass Card */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    background: 'rgba(250, 242, 232, 0.85)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(232, 173, 140, 0.3)',
                    borderRadius: '28px',
                    padding: '32px 36px 28px',
                    width: 'min(860px, 94vw)',
                    maxHeight: '94vh',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: '0 24px 80px rgba(180,80,20,0.18)',
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                }}>
                    <div>
                        <div style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '10px',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                        color: '#2a1a0a',
                    }}>
                        Karnataka — Select District
                    </div>
                </div>
                <div style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '10px',
                    color: '#2a1a0a',
                    opacity: 0.7,
                    }}>
                        30 districts
                    </div>
                </div>

                {/* SVG Map */}
                <div style={{ flex: 1, minHeight: 0 }}>
                    <svg
                        viewBox="0 0 500 560"
                        style={{
                            width: '100%',
                            height: '100%',
                            cursor: 'crosshair',
                            display: 'block',
                        }}
                    >
                        {GEO_DATA.map(({ district, polys }) => (
                            <g
                                key={district}
                                onMouseMove={(e) => {
                                    setTooltip({
                                        visible: true,
                                        name: district,
                                        x: e.clientX,
                                        y: e.clientY,
                                    })
                                    setHoveredDistrict(district)
                                }}
                                onMouseLeave={() => {
                                    setTooltip(t => ({ ...t, visible: false }))
                                    setHoveredDistrict(null)
                                }}
                                onClick={() => handleClick(district)}
                                style={{ cursor: 'pointer' }}
                            >
                                {polys.map((poly, pi) =>
                                    poly.map((ring, ri) => (
                                        <path
                                            key={`${pi}-${ri}`}
                                            d={ringToPath(ring)}
                                            fill={
                                                selected === district
                                                    ? 'rgba(212, 132, 90, 0.55)'
                                                    : hoveredDistrict === district
                                                        ? 'rgba(212, 132, 90, 0.35)'
                                                        : 'rgba(232, 173, 140, 0.18)'
                                            }
                                            stroke={
                                                selected === district || hoveredDistrict === district
                                                    ? 'rgba(160, 70, 30, 0.75)'
                                                    : 'rgba(180, 100, 60, 0.35)'
                                            }
                                            strokeWidth={
                                                selected === district
                                                    ? 1.2
                                                    : hoveredDistrict === district
                                                        ? 1.0
                                                        : 0.6
                                            }
                                            strokeLinejoin="round"
                                            style={{
                                                transition: 'fill 0.18s ease, stroke 0.18s ease',
                                            }}
                                        />
                                    ))
                                )}
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Bottom Panel */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '44px',
                }}>
                    <div>
                        <div style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '10px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#2a1a0a',
                            marginBottom: '4px',
                        }}>
                            Selected District
                        </div>
                        <motion.div
                            key={selected || 'none'}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                fontFamily: 'Playfair Display, serif',
                                fontSize: '22px',
                                color: '#3d1f0a',
                                letterSpacing: '-0.02em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            {selected ? (
                                <>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#d4845a',
                                        display: 'inline-block',
                                        animation: 'pulse 2s ease-in-out infinite',
                                    }} />
                                    {selected}
                                </>
                            ) : (
                                <span style={{ color: '#2a1a0a', fontSize: '16px' }}>
                                    — hover and click a district
                                </span>
                            )}
                        </motion.div>
                    </div>

                    {selected && (
                        <motion.button
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={handleProceed}
                            style={{
                                background: '#d4845a',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '99px',
                                padding: '10px 24px',
                                fontFamily: 'Space Mono, monospace',
                                fontSize: '11px',
                                letterSpacing: '0.08em',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(212, 132, 90, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            Continue →
                        </motion.button>
                    )}
                </div>
            </motion.div>

            <button
                onClick={async () => { await AuthManager.logout(); router.push('/') }}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 200,
                    background: 'rgba(255,245,238,0.7)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(232,173,140,0.4)',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    color: '#3a1a08',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(180,80,20,0.12)',
                    transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,245,238,0.9)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,245,238,0.7)' }}
            >
                Logout
            </button>

            <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
      `}</style>
        </div>
    )
}