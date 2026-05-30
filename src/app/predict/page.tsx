'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AuthManager } from '@/lib/auth'
import OrbitalPredict from '@/systems/sliders/OrbitalPredict'

const API_URL = '/api'

function PredictContent() {
    const router = useRouter()
    const params = useSearchParams()
    const city = params.get('city') || 'Karnataka'

    const [humidity, setHumidity] = useState(60)
    const [pressure, setPressure] = useState(1010)
    const [windSpeed, setWindSpeed] = useState(20)
    const [minTemp, setMinTemp] = useState(18)
    const [maxTemp, setMaxTemp] = useState(30)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        AuthManager.current().then(u => {
            if (!u) router.replace('/')
        })
    }, [router])

    // Compute background tint from slider values
    const getBgColor = () => {
        if (humidity > 80) return 'radial-gradient(ellipse 120% 100% at 30% 20%, #dde8f0 0%, #b8ccd8 40%, #8aaabb 100%)'
        if (maxTemp > 38) return 'radial-gradient(ellipse 120% 100% at 30% 20%, #fde8d8 0%, #f5c4a0 40%, #e8a070 100%)'
        if (minTemp < 12) return 'radial-gradient(ellipse 120% 100% at 30% 20%, #e8eef5 0%, #c8d8e8 40%, #a0b8cc 100%)'
        return 'radial-gradient(ellipse 120% 100% at 30% 20%, #fde8d8 0%, #f5cdb0 30%, #f0b890 55%, #e8a070 80%, #d4845a 100%)'
    }

    const handleSubmit = async () => {
        setLoading(true)

        const payload = {
            minTemp: parseFloat(minTemp.toString()),
            maxTemp: parseFloat(maxTemp.toString()),
            humidity: parseFloat(humidity.toString()),
            pressure: parseFloat(pressure.toString()),
            windSpeed: parseFloat(windSpeed.toString()),
        }
        console.log('[Predict] Sending to backend:', payload)

        try {
            const res = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            
            if (!res.ok) {
                throw new Error('API response not ok')
            }
            
            const data = await res.json()
            console.log('[Predict] Backend response:', data)

            const params = new URLSearchParams({
                city,
                condition: data.condition,
                confidence: data.confidence.toString(),
                humidity: humidity.toString(),
                pressure: pressure.toString(),
                windSpeed: windSpeed.toString(),
                minTemp: minTemp.toString(),
                maxTemp: maxTemp.toString(),
            })
            router.push(`/result?${params.toString()}`)
        } catch (err) {
            console.error('Failed to fetch prediction from backend:', err)
            
            // Met-calibrated client fallback if backend is unreachable
            // Must mirror src/lib/xgboost.ts applyRuleOverrides exactly
            let fallbackCondition = 'Sunny'
            let fallbackConfidence = 0.70

            if (humidity >= 88 && windSpeed >= 40) {
                fallbackCondition = 'Stormy'
                fallbackConfidence = 0.88
            } else if (humidity >= 88 && windSpeed >= 5) {
                fallbackCondition = 'Rainy'
                fallbackConfidence = 0.82
            } else if (humidity >= 85 && windSpeed >= 15) {
                fallbackCondition = 'Rainy'
                fallbackConfidence = 0.84
            } else if (humidity >= 92 && windSpeed >= 3) {
                fallbackCondition = 'Rainy'
                fallbackConfidence = 0.80
            } else if (humidity >= 40 && windSpeed <= 15 && minTemp <= 18 && maxTemp <= 26) {
                fallbackCondition = 'Foggy'
                fallbackConfidence = 0.78
            } else if (humidity >= 70) {
                fallbackCondition = 'Cloudy'
                fallbackConfidence = 0.80
            } else if (windSpeed >= 30) {
                fallbackCondition = 'Windy'
                fallbackConfidence = 0.82
            } else if (maxTemp >= 26 && humidity <= 55) {
                fallbackCondition = 'Sunny'
                fallbackConfidence = 0.85
            }
            
            const params = new URLSearchParams({
                city,
                condition: fallbackCondition,
                confidence: fallbackConfidence.toString(),
                humidity: humidity.toString(),
                pressure: pressure.toString(),
                windSpeed: windSpeed.toString(),
                minTemp: minTemp.toString(),
                maxTemp: maxTemp.toString(),
            })
            router.push(`/result?${params.toString()}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: getBgColor(),
            transition: 'background 1s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}>

            {/* Floating orbs */}
            <div style={{
                position: 'fixed',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,220,195,0.4) 0%, transparent 70%)',
                top: '-150px',
                left: '-100px',
                filter: 'blur(60px)',
                pointerEvents: 'none',
                animation: 'orbDrift 14s ease-in-out infinite alternate',
            }} />
            <div style={{
                position: 'fixed',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(240,150,100,0.2) 0%, transparent 70%)',
                bottom: '-100px',
                right: '-80px',
                filter: 'blur(60px)',
                pointerEvents: 'none',
                animation: 'orbDrift 18s ease-in-out infinite alternate-reverse',
            }} />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    background: 'rgba(250, 242, 232, 0.85)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(232, 173, 140, 0.3)',
                    borderRadius: '28px',
                    padding: '32px 40px',
                    width: 'min(700px, 94vw)',
                    boxShadow: '0 24px 80px rgba(180,80,20,0.15)',
                }}
            >
                {/* City Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    style={{ marginBottom: '24px' }}
                >
                    <div style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '10px',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: '#2a1a0a',
                        marginBottom: '6px',
                        textAlign: 'center',
                    }}>
                        Atmospheric Conditions
                    </div>
                    <div style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 300,
                        letterSpacing: '-0.04em',
                        color: '#3d1f0a',
                        lineHeight: 1.1,
                        textAlign: 'center',
                    }}>
                        {city}
                    </div>
                </motion.div>

                {/* Orbital Predict */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <OrbitalPredict
                        variables={[
                            { key: 'humidity', label: 'Humidity', min: 20, max: 100, step: 1, unit: '%', value: humidity, description: 'Humidity measures water vapour suspended in the air. High humidity above 80% often saturates the atmosphere, forming clouds and precipitation. Below 30%, the air feels dry and static electricity builds up.' },
                            { key: 'pressure', label: 'Pressure', min: 980, max: 1025, step: 0.5, unit: ' hPa', value: pressure, description: 'Atmospheric pressure is the weight of the air column above. Rising pressure signals clearing skies and stable weather. Falling pressure warns of approaching lows — clouds, wind, and rain.' },
                            { key: 'windSpeed', label: 'Wind Speed', min: 0, max: 80, step: 1, unit: ' km/h', value: windSpeed, description: 'Wind speed determines how air masses move across the region. Breezes under 20 km/h feel gentle, while speeds above 50 km/h signal storms capable of damage and rapid weather shifts.' },
                            { key: 'minTemp', label: 'Min Temperature', min: 5, max: 25, step: 0.5, unit: ' °C', value: minTemp, description: 'The daily minimum temperature occurs just before sunrise. It reflects overnight cooling and is critical for agriculture — frost forms when it drops below 4 °C.' },
                            { key: 'maxTemp', label: 'Max Temperature', min: 20, max: 45, step: 0.5, unit: ' °C', value: maxTemp, description: 'The daily maximum temperature peaks in early afternoon, driven by solar radiation. Extreme heat above 40 °C stresses both people and crops, increasing evaporation rates.' },
                        ]}
                        onVariableChange={(key, val) => {
                            switch (key) {
                                case 'humidity': setHumidity(val); break
                                case 'pressure': setPressure(val); break
                                case 'windSpeed': setWindSpeed(val); break
                                case 'minTemp': setMinTemp(val); break
                                case 'maxTemp': setMaxTemp(val); break
                            }
                        }}
                        onSubmit={handleSubmit}
                        onBack={() => router.push('/map')}
                        loading={loading}
                    />
                </motion.div>

                {/* Season presets */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    style={{ marginTop: '24px', textAlign: 'center' }}
                >
                    <div style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '9px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#2a1a0a',
                        marginBottom: '12px',
                        opacity: 0.5,
                    }}>
                        Quick Preview
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { label: '☀️ Sunny', cond: 'Sunny', conf: 0.85, h: 35, p: 1018, w: 10, minT: 20, maxT: 32 },
                            { label: '☁️ Cloudy', cond: 'Cloudy', conf: 0.78, h: 75, p: 1008, w: 22, minT: 18, maxT: 28 },
                            { label: '🌧 Rainy', cond: 'Rainy', conf: 0.82, h: 90, p: 995, w: 35, minT: 16, maxT: 24 },
                            { label: '⛈ Stormy', cond: 'Stormy', conf: 0.85, h: 95, p: 985, w: 55, minT: 14, maxT: 22 },
                            { label: '🌫 Foggy', cond: 'Foggy', conf: 0.80, h: 55, p: 1005, w: 8, minT: 10, maxT: 22 },
                            { label: '💨 Windy', cond: 'Windy', conf: 0.78, h: 35, p: 1012, w: 40, minT: 22, maxT: 36 },
                        ].map(p => (
                            <button
                                key={p.label}
                                onClick={() => {
                                    setHumidity(p.h)
                                    setPressure(p.p)
                                    setWindSpeed(p.w)
                                    setMinTemp(p.minT)
                                    setMaxTemp(p.maxT)
                                    const params = new URLSearchParams({
                                        city,
                                        condition: p.cond,
                                        confidence: p.conf.toString(),
                                        humidity: p.h.toString(),
                                        pressure: p.p.toString(),
                                        windSpeed: p.w.toString(),
                                        minTemp: p.minT.toString(),
                                        maxTemp: p.maxT.toString(),
                                    })
                                    router.push(`/result?${params.toString()}`)
                                }}
                                style={{
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: '10px',
                                    letterSpacing: '0.1em',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(139,69,19,0.2)',
                                    background: 'rgba(250,242,232,0.7)',
                                    color: '#3d1f0a',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(12px)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(139,69,19,0.12)'
                                    e.currentTarget.style.borderColor = 'rgba(139,69,19,0.4)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(250,242,232,0.7)'
                                    e.currentTarget.style.borderColor = 'rgba(139,69,19,0.2)'
                                }}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            <style>{`
        @keyframes orbDrift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.06); }
        }
      `}</style>
        </div>
    )
}

export default function PredictPage() {
    return (
        <Suspense fallback={
            <div style={{
                width: '100vw',
                height: '100vh',
                background: '#fde8d8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Space Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#2a1a0a',
            }}>
                Loading...
            </div>
        }>
            <PredictContent />
        </Suspense>
    )
}