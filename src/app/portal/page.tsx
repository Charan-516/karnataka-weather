'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { AuthManager } from '@/lib/auth'
import { OutlineButton } from '@/components/ui/button'
import { getPlaceCount } from '@/lib/places'

const WeatherPortal = dynamic(() => import('@/components/portals/WeatherPortal'), { ssr: false })

function PortalContent() {
  const router = useRouter()
  const params = useSearchParams()
  const city = params.get('city') || 'Karnataka'

  useEffect(() => {
    AuthManager.current().then(u => {
      if (!u) router.replace('/')
    })
  }, [router])

  const portals = [
    {
      type: 'manual' as const,
      title: 'Manual Prediction',
      subtitle: 'AI-Powered Forecast',
      description: 'Adjust atmospheric parameters manually and let XGBoost predict the weather condition for your selected district.',
      onClick: () => router.push(`/predict?city=${encodeURIComponent(city)}`),
    },
    {
      type: 'iot' as const,
      title: 'Live IoT Sensors',
      subtitle: 'Real-Time Data',
      description: 'Connect ESP32 or Wokwi sensors to receive live atmospheric readings and trigger automatic predictions.',
      onClick: () => router.push(`/iot?city=${encodeURIComponent(city)}`),
    },
    {
      type: 'intelligence' as const,
      title: 'Weather Intelligence',
      subtitle: 'Multi-Source RAG',
      description: 'Get a comprehensive district report combining weather, places, knowledge, news, and AI-powered summaries.',
      onClick: () => {
        const count = getPlaceCount(city)
        if (count <= 2) {
          router.push(`/intelligence?city=${encodeURIComponent(city)}`)
        } else {
          router.push(`/intelligence/portal?city=${encodeURIComponent(city)}`)
        }
      },
    },
  ]

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'radial-gradient(ellipse 120% 100% at 30% 20%, #f5f0e8 0%, #eee6d6 50%, #e8dcc8 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
    }}>
      {/* Header */}
      <motion.div
        style={{ textAlign: 'center', marginBottom: 48 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 15,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#2a1a0a',
          marginBottom: 12,
          opacity: 0.6,
        }}>
          Karnataka — {city}
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 300,
          color: '#3d1f0a',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}>
          Choose Your Method
        </h1>
      </motion.div>

      {/* Portal Cards */}
      <motion.div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {portals.map((portal) => (
          <motion.div
            key={portal.type}
            variants={{
              hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <WeatherPortal {...portal} />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom actions */}
      <motion.div
        style={{ marginTop: 56, display: 'flex', gap: 16 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <OutlineButton onClick={() => router.push('/map')}>
          ← BACK TO MAP
        </OutlineButton>
        <OutlineButton onClick={() => router.push('/history')}>
          HISTORY →
        </OutlineButton>
      </motion.div>
    </div>
  )
}

export default function PortalPage() {
  return (
    <Suspense fallback={
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f5f0e8',
        fontFamily: 'Space Mono, monospace',
        fontSize: 10, letterSpacing: '0.2em', color: '#2a1508',
      }}>
        Loading...
      </div>
    }>
      <PortalContent />
    </Suspense>
  )
}
