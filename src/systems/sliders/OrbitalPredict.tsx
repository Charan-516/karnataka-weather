'use client'
import { useState, useEffect, useRef, useCallback } from "react"
import { Droplets, Gauge, Wind, Thermometer, Sun } from "lucide-react"

interface VariableConfig {
  key: string
  label: string
  min: number
  max: number
  step: number
  unit: string
  value: number
  description: string
}

interface OrbitalPredictProps {
  variables: VariableConfig[]
  onVariableChange: (key: string, value: number) => void
  onSubmit: () => void
  onBack: () => void
  loading: boolean
}

function shortestAngleDelta(from: number, to: number): number {
  let d = (to - from) % 360
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return d
}

export default function OrbitalPredict({
  variables,
  onVariableChange,
  onSubmit,
  onBack,
  loading,
}: OrbitalPredictProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [pulseNodes, setPulseNodes] = useState<Record<string, boolean>>({})
  const [cardVisible, setCardVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!autoRotate) return
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)))
    }, 50)
    return () => clearInterval(timer)
  }, [autoRotate])

  const animateToTarget = useCallback((target: number) => {
    targetRef.current = target
    const step = () => {
      setRotationAngle((prev) => {
        const current = targetRef.current
        if (current === null) return prev
        const delta = shortestAngleDelta(prev, current)
        const absDelta = Math.abs(delta)
        if (absDelta < 0.3) {
          targetRef.current = null
          setCardVisible(true)
          return current
        }
        const speed = Math.max(0.5, absDelta * 0.08)
        return Number((prev + Math.sign(delta) * speed).toFixed(3))
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const calculatePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360
    const radius = 170
    const radian = (angle * Math.PI) / 180
    const x = radius * Math.cos(radian)
    const y = radius * Math.sin(radian)
    const zIndex = Math.round(100 + 50 * Math.cos(radian))
    const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2)))
    return { x, y, zIndex, opacity }
  }

  const getIcon = (label: string) => {
    switch (label) {
      case "Humidity": return Droplets
      case "Pressure": return Gauge
      case "Wind Speed": return Wind
      case "Min Temperature": return Thermometer
      case "Max Temperature": return Sun
      default: return Droplets
    }
  }

  const handleNodeClick = (key: string) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (expandedId === key) {
      setExpandedId(null)
      setCardVisible(false)
      setAutoRotate(true)
      setPulseNodes({})
      targetRef.current = null
      return
    }
    const idx = variables.findIndex((v) => v.key === key)
    if (idx === -1) return
    const target = (270 - (idx / variables.length) * 360 + 720) % 360
    setAutoRotate(false)
    setExpandedId(null)
    setCardVisible(false)
    targetRef.current = null
    setPulseNodes({})
    const related: Record<string, boolean> = {}
    variables.forEach((v) => { if (v.key !== key) related[v.key] = true })
    setPulseNodes(related)
    setTimeout(() => {
      setExpandedId(key)
      animateToTarget(target)
    }, 50)
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setExpandedId(null)
      setCardVisible(false)
      setAutoRotate(true)
      setPulseNodes({})
      targetRef.current = null
    }
  }

  const expandedVar = variables.find((v) => v.key === expandedId)

  return (
    <div
      onClick={handleContainerClick}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      {/* Orbital area */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '480px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Center pulsing orb */}
        <div style={{
          position: 'absolute',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,69,19,0.4) 0%, transparent 70%)',
          animation: 'centerPulse 2s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,69,19,0.15) 0%, transparent 70%)',
          animation: 'centerPing 2s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,69,19,0.08) 0%, transparent 70%)',
          animation: 'centerPing 2s ease-in-out infinite',
          animationDelay: '0.5s',
        }} />

        {/* Orbital ring */}
        <div style={{
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          border: '1px solid rgba(139,69,19,0.12)',
          position: 'absolute',
          pointerEvents: 'none',
        }} />

        {/* Orbiting nodes */}
        {variables.map((v, index) => {
          const pos = calculatePosition(index, variables.length)
          const isExpanded = expandedId === v.key
          const isRelated = expandedId && expandedId !== v.key && pulseNodes[v.key]
          const isPulsing = pulseNodes[v.key]
          const Icon = getIcon(v.label)
          const pct = ((v.value - v.min) / (v.max - v.min)) * 100

          return (
            <div
              key={v.key}
              onClick={(e) => { e.stopPropagation(); handleNodeClick(v.key) }}
              style={{
                position: 'absolute',
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                zIndex: isExpanded ? 200 : pos.zIndex,
                opacity: expandedId && !isExpanded && !isRelated ? 0.2 : pos.opacity,
                cursor: 'pointer',
                transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Energy glow behind node */}
              <div style={{
                position: 'absolute',
                borderRadius: '50%',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle, rgba(139,69,19,${0.08 + pct * 0.0015}) 0%, transparent 70%)`,
                animation: isPulsing ? 'nodePulse 1s ease-in-out infinite' : 'none',
                pointerEvents: 'none',
              }} />

              <div style={{
                width: isExpanded ? '56px' : '46px',
                height: isExpanded ? '56px' : '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isExpanded
                  ? 'rgba(139,69,19,0.92)'
                  : isRelated
                    ? 'rgba(139,69,19,0.15)'
                    : 'rgba(250,242,232,0.9)',
                border: isExpanded
                  ? '2px solid rgba(139,69,19,0.6)'
                  : isRelated
                    ? '2px solid rgba(139,69,19,0.4)'
                    : '1px solid rgba(139,69,19,0.18)',
                boxShadow: isExpanded
                  ? '0 0 30px rgba(139,69,19,0.3)'
                  : isRelated
                    ? '0 0 16px rgba(139,69,19,0.15)'
                    : '0 4px 16px rgba(139,69,19,0.08)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.35s ease',
              }}>
                <Icon
                  size={isExpanded ? 22 : 18}
                  color={isExpanded ? '#fff8f0' : '#3d1f0a'}
                />
              </div>

              {/* Label */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '10px',
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                letterSpacing: '0.12em',
                color: '#3d1f0a',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                fontWeight: isExpanded ? 700 : isRelated ? 600 : 400,
                opacity: isExpanded || isRelated || !expandedId ? 1 : 0.4,
                transition: 'all 0.35s ease',
              }}>
                {v.label}
              </div>

              {/* Energy ring */}
              <svg
                style={{
                  position: 'absolute',
                  top: '-3px',
                  left: '-3px',
                  transform: 'rotate(-90deg)',
                  pointerEvents: 'none',
                }}
                width={isExpanded ? 62 : 52}
                height={isExpanded ? 62 : 52}
              >
                <circle
                  cx={isExpanded ? 31 : 26}
                  cy={isExpanded ? 31 : 26}
                  r={isExpanded ? 28 : 23}
                  fill="none"
                  stroke="rgba(139,69,19,0.1)"
                  strokeWidth="2"
                />
                <circle
                  cx={isExpanded ? 31 : 26}
                  cy={isExpanded ? 31 : 26}
                  r={isExpanded ? 28 : 23}
                  fill="none"
                  stroke="rgba(139,69,19,0.5)"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * (isExpanded ? 28 : 23)}`}
                  strokeDashoffset={`${2 * Math.PI * (isExpanded ? 28 : 23) * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'all 0.6s ease' }}
                />
              </svg>
            </div>
          )
        })}

        {/* Expanded card */}
        {expandedVar && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) ${cardVisible ? 'scale(1)' : 'scale(0.92)'}`,
              width: '320px',
              zIndex: 300,
              background: 'rgba(250,242,232,0.95)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(139,69,19,0.2)',
              borderRadius: '16px',
              padding: '28px 24px 24px',
              boxShadow: '0 24px 80px rgba(139,69,19,0.2)',
              opacity: cardVisible ? 1 : 0,
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: cardVisible ? 'auto' : 'none',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}>
              <div>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '22px',
                  color: '#3d1f0a',
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  {expandedVar.label}
                </div>
              </div>
              <div
                onClick={() => { setExpandedId(null); setCardVisible(false); setAutoRotate(true); setPulseNodes({}); targetRef.current = null }}
                style={{
                  cursor: 'pointer',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(139,69,19,0.08)',
                  color: '#3d1f0a',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '12px',
                }}
              >
                ×
              </div>
            </div>

            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              lineHeight: 1.7,
              color: '#5a3a2a',
              letterSpacing: '0.02em',
              marginBottom: '20px',
              padding: '12px',
              background: 'rgba(139,69,19,0.04)',
              borderRadius: '8px',
              border: '1px solid rgba(139,69,19,0.08)',
            }}>
              {expandedVar.description}
            </p>

            {/* Slider */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '8px',
              }}>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#3d1f0a',
                }}>
                  Energy Level
                </span>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '14px',
                  color: '#3d1f0a',
                  fontWeight: 700,
                }}>
                  {expandedVar.step >= 1
                    ? Math.round(expandedVar.value)
                    : expandedVar.value.toFixed(1)}
                  <span style={{ fontSize: '10px', fontWeight: 400, marginLeft: '2px', opacity: 0.7 }}>
                    {expandedVar.unit}
                  </span>
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '99px',
                  background: 'rgba(139,69,19,0.1)',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }} />
                <div style={{
                  width: `${((expandedVar.value - expandedVar.min) / (expandedVar.max - expandedVar.min)) * 100}%`,
                  height: '6px',
                  borderRadius: '99px',
                  background: 'linear-gradient(90deg, rgba(139,69,19,0.4), rgba(139,69,19,0.8))',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  transition: 'width 0.15s ease',
                  pointerEvents: 'none',
                }} />
                <input
                  type="range"
                  min={expandedVar.min}
                  max={expandedVar.max}
                  step={expandedVar.step}
                  value={expandedVar.value}
                  onChange={(e) => onVariableChange(expandedVar.key, Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 2,
                  }}
                  onMouseDown={() => setAutoRotate(false)}
                />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '4px',
                fontFamily: 'Space Mono, monospace',
                fontSize: '8px',
                color: '#3d1f0a',
                opacity: 0.5,
              }}>
                <span>{expandedVar.min}{expandedVar.unit}</span>
                <span>{expandedVar.max}{expandedVar.unit}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit & Back */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        paddingTop: '4px',
      }}>
        <div
          onClick={onBack}
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: '#3d1f0a',
            cursor: 'pointer',
            textTransform: 'uppercase',
            opacity: 0.7,
            transition: 'opacity 0.2s',
          }}
        >
          ← Change district
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            background: loading
              ? 'rgba(139,69,19,0.4)'
              : '#8b4513',
            color: '#fff8f0',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 32px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: loading
              ? 'none'
              : '0 4px 24px rgba(139,69,19,0.25)',
          }}
        >
          {loading ? 'Reading atmosphere...' : 'Predict Weather'}
        </button>
      </div>
    </div>
  )
}
