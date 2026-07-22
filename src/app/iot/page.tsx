'use client'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AuthManager } from '@/lib/auth'
import { savePrediction } from '@/lib/history'
import { SolidButton, OutlineButton } from '@/components/ui/button'
import dynamic from 'next/dynamic'

const IoTLoader = dynamic(() => import('@/components/ui/loader-iot'), { ssr: false })

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function generateId() {
  return 'sensor_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
}

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'completed' | 'processing'

function IoTContent() {
  const router = useRouter()
  const params = useSearchParams()
  const city = params.get('city') || 'Karnataka'

  const [sessionId] = useState(generateId)
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [sensorValues, setSensorValues] = useState({
    temperature: 25,
    humidity: 60,
    pressure: 1010,
    wind_speed: 15,
  })
  const [prediction, setPrediction] = useState<{ condition: string; confidence: number } | null>(null)

  useEffect(() => {
    AuthManager.current().then(u => {
      if (!u) router.replace('/')
    })
  }, [router])

  useEffect(() => {
    fetch(`${API_URL}/iot/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.NEXT_PUBLIC_IOT_API_KEY || '',
      },
      body: JSON.stringify({ session_id: sessionId, district: city }),
    }).then(async () => {
      await new Promise(r => setTimeout(r, 3500))
      setConnectionState('connected')
    }).catch(() => setConnectionState('disconnected'))
  }, [sessionId, city])

  const sendSensorData = useCallback(async (values: typeof sensorValues) => {
    try {
      const res = await fetch(`${API_URL}/iot/sensor-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.NEXT_PUBLIC_IOT_API_KEY || '',
        },
        body: JSON.stringify({ session_id: sessionId, ...values }),
      })
      const data = await res.json()
      if (data.prediction) {
        setPrediction(data.prediction)
        setConnectionState('completed')
        savePrediction({
          district: city,
          mode: 'iot',
          condition: data.prediction.condition,
          confidence: data.prediction.confidence,
          input_params: values,
        })
      }
    } catch {
      setConnectionState('disconnected')
    }
  }, [sessionId])

  const handleSimulate = () => {
    setConnectionState('processing')
    setPrediction(null)
    const randomValues = {
      temperature: parseFloat((18 + Math.random() * 22).toFixed(1)),
      humidity: Math.round(30 + Math.random() * 70),
      pressure: parseFloat((990 + Math.random() * 35).toFixed(1)),
      wind_speed: Math.round(Math.random() * 80),
    }
    setSensorValues(randomValues)
    sendSensorData(randomValues)
  }

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      background: 'radial-gradient(ellipse 120% 100% at 30% 20%, #f5f0e8 0%, #eee6d6 50%, #e8dcc8 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 40,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <p style={{
          fontFamily: 'Space Mono, monospace', fontSize: 15,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: '#2a1a0a', opacity: 0.6, marginBottom: 12,
        }}>
          Live IoT Sensors
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300,
          color: '#3d1f0a', letterSpacing: '-0.03em',
        }}>
          {city}
        </h1>
      </motion.div>

      {/* Connection State */}
      {connectionState === 'connecting' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <IoTLoader />
          <p style={{
            fontFamily: 'Space Mono, monospace', fontSize: 14,
            letterSpacing: '0.15em', color: '#2a1a0a', opacity: 0.5,
          }}>
            Establishing connection...
          </p>
        </motion.div>
      )}

      {connectionState === 'connected' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Connection badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Space Mono, monospace', fontSize: 14,
            letterSpacing: '0.12em', color: '#166534',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 99, padding: '8px 20px',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#22c55e', display: 'inline-block',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            Sensor Connected
          </div>

          {/* Sensor values display */}
          <div style={{
            background: 'rgba(250,242,232,0.85)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(139,69,19,0.15)',
            borderRadius: 28, padding: '32px 36px',
            width: 'min(420px, 90vw)',
          }}>
            <p style={{
            fontFamily: 'Space Mono, monospace', fontSize: 14,
            letterSpacing: '0.15em', color: '#2a1a0a', opacity: 0.4,
            marginBottom: 24, textTransform: 'uppercase',
          }}>
            Latest Sensor Readings
            </p>
            {[
              { label: 'Temperature', value: sensorValues.temperature, unit: '°C' },
              { label: 'Humidity', value: sensorValues.humidity, unit: '%' },
              { label: 'Pressure', value: sensorValues.pressure, unit: ' hPa' },
              { label: 'Wind Speed', value: sensorValues.wind_speed, unit: ' km/h' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(139,69,19,0.08)' : 'none',
              }}>
                <span style={{
                  fontFamily: 'Space Mono, monospace', fontSize: 14,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#2a1a0a', opacity: 0.5,
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontFamily: 'Playfair Display, serif', fontSize: 22,
                  fontWeight: 300, color: '#3d1f0a',
                }}>
                  {item.value}{item.unit}
                </span>
              </div>
            ))}
          </div>

          {/* Simulate Button */}
          <button onClick={handleSimulate}
            style={{
              background: '#22c55e', color: '#fff', border: 'none',
              borderRadius: 99, padding: '14px 32px',
              fontFamily: 'Space Mono, monospace', fontSize: 14,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#16a34a' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#22c55e' }}
          >
            Simulate Sensor Data
          </button>

          <p style={{
            fontFamily: 'Space Mono, monospace', fontSize: 14,
            letterSpacing: '0.1em', color: '#2a1a0a', opacity: 0.3,
            textAlign: 'center', maxWidth: 360,
          }}>
            Simulating ESP32 sensor data. In production, this receives real data from Wokwi or physical sensors.
          </p>
        </motion.div>
      )}

      {connectionState === 'processing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <IoTLoader />
          <p style={{
            fontFamily: 'Space Mono, monospace', fontSize: 14,
            letterSpacing: '0.15em', color: '#2a1a0a', opacity: 0.5,
          }}>
            Processing sensor data...
          </p>
        </motion.div>
      )}

      {connectionState === 'disconnected' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: '#ef4444',
          }}>
            ⚠
          </div>
          <p style={{
            fontFamily: 'Montserrat, sans-serif', fontSize: 16,
            fontWeight: 300, color: '#3a2a1a', textAlign: 'center',
          }}>
            Sensor disconnected or backend unreachable.
          </p>
          <button onClick={() => {
            setConnectionState('connected')
          }}
            style={{
              background: '#8b4513', color: '#fff', border: 'none',
              borderRadius: 99, padding: '14px 28px',
              fontFamily: 'Space Mono, monospace', fontSize: 14,
              letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Try Reconnecting
          </button>
        </motion.div>
      )}

      {/* Prediction Result */}
      {connectionState === 'completed' && prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-center"
        >
          <div style={{
            background: 'rgba(250,242,232,0.85)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(139,69,19,0.15)',
            borderRadius: 32, padding: '40px 48px',
            width: 'min(580px, 90vw)',
          }}>
            <p style={{
              fontFamily: 'Space Mono, monospace', fontSize: 15,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#2a1a0a', opacity: 0.5, marginBottom: 16,
            }}>
              Prediction Result
            </p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: 48,
              fontWeight: 300, color: '#3d1f0a', letterSpacing: '-0.03em',
              marginBottom: 8,
            }}>
              {prediction.condition}
            </h2>
            <p style={{
            fontFamily: 'Space Mono, monospace', fontSize: 14,
            letterSpacing: '0.15em', color: '#2a1a0a', opacity: 0.5,
            marginBottom: 28,
          }}>
            {Math.round(prediction.confidence * 100)}% confidence
            </p>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center' }}>
              <SolidButton style={{ padding: '10px 44px' }} onClick={() => router.push(`/result?city=${encodeURIComponent(city)}&condition=${prediction.condition}&confidence=${prediction.confidence}`)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
                <span className="text">VIEW FULL RESULT</span>
                <span className="circle" />
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
              </SolidButton>
              <OutlineButton style={{ padding: '0.7em 3em' }} onClick={() => {
                setConnectionState('connected')
                setPrediction(null)
              }}>
                NEW READING
              </OutlineButton>
            </div>
          </div>
        </motion.div>
      )}

      {/* Back */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{ marginTop: 40 }}
      >
        <OutlineButton onClick={() => router.push('/portal?city=' + encodeURIComponent(city))}>
          ← BACK
        </OutlineButton>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

export default function IoTPage() {
  return (
    <Suspense fallback={
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f5f0e8',
        fontFamily: 'Space Mono, monospace', fontSize: 10,
        letterSpacing: '0.2em', color: '#2a1508',
      }}>
        Loading...
      </div>
    }>
      <IoTContent />
    </Suspense>
  )
}
