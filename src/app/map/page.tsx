'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AuthManager } from '@/lib/auth'
import { GEO_DATA } from '@/lib/karnatakaDistricts'
import { SolidButton } from '@/components/ui/button'

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
        router.push(`/portal?city=${encodeURIComponent(selected)}`)
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
                    transform: 'translate(-50%, calc(-100% - 16px))',
                    pointerEvents: 'none',
                    zIndex: 100,
                    background: 'rgba(255, 245, 235, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1.5px solid rgba(212, 132, 90, 0.55)',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    boxShadow: '0 10px 36px rgba(180,80,20,0.22)',
                    whiteSpace: 'nowrap',
                }}>
                    <div style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '19px',
                        fontWeight: 600,
                        color: '#3d1f0a',
                    }}>
                        {tooltip.name}
                    </div>
                    <div style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: '#b85a2b',
                        marginTop: '4px',
                    }}>
                        Click to select
                    </div>
                </div>
            )}

            {/* Scale wrapper for map card */}
            <div style={{
                transform: 'scale(0.80)',
                transformOrigin: 'center center',
            }}>
            {/* Main Glass Card */}
            <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        background: 'rgba(250, 242, 232, 0.92)',
                        backdropFilter: 'blur(40px)',
                        border: '1.5px solid rgba(212, 132, 90, 0.35)',
                        borderRadius: '32px',
                        padding: '36px 44px 32px',
                        width: '880px',
                        boxShadow: '0 24px 80px rgba(180,80,20,0.18)',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div>
                            <div style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '16px',
                            fontWeight: 700,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: '#3d1f0a',
                        }}>
                            Karnataka — Select District
                        </div>
                    </div>
                    <div style={{
                        fontFamily: 'Space Mono, monospace',
                            fontSize: '17px',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            color: '#3d1f0a',
                            opacity: 0.9,
                            background: 'rgba(212, 132, 90, 0.12)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid rgba(212, 132, 90, 0.25)',
                            }}>
                            30 districts
                        </div>
                    </div>

                    <div style={{ height: 16 }} />
                    {/* SVG Map */}
                    <div style={{ width: '100%', aspectRatio: '500/560' }}>
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

                    <div style={{ height: 16 }} />
                    {/* Bottom Panel */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '56px',
                    }}>
                        <div>
                            <div style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '15px',
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: '#3d1f0a',
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
                                    fontSize: '32px',
                                    fontWeight: 600,
                                    color: '#3d1f0a',
                                    letterSpacing: '-0.02em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                {selected ? (
                                    <>
                                        <span style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#d4845a',
                                            display: 'inline-block',
                                            boxShadow: '0 0 10px #d4845a',
                                            animation: 'pulse 2s ease-in-out infinite',
                                        }} />
                                        {selected}
                                    </>
                                ) : (
                                    <span style={{ color: '#5c3d1e', fontSize: '24px', opacity: 0.85 }}>
                                        — hover and click a district
                                    </span>
                                )}
                            </motion.div>
                        </div>

                        {selected && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <SolidButton onClick={handleProceed}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
                                        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                                    </svg>
                                    <span className="text">CONTINUE</span>
                                    <span className="circle" />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
                                        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                                    </svg>
                                </SolidButton>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

                <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 200 }}>
                    <SolidButton onClick={async () => { await AuthManager.logout(); router.push('/') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                        </svg>
                        <span className="text">LOGOUT</span>
                        <span className="circle" />
                        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                        </svg>
                    </SolidButton>
                </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
      `}</style>
        </div>
    )
}
