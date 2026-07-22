'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AuthManager } from '@/lib/auth'
import { savePrediction } from '@/lib/history'
import { OutlineButton } from '@/components/ui/button'
import { fetchIntelligence, type IntelligenceResponse } from '@/lib/weatherIntelligence'
import dynamic from 'next/dynamic'

const WiLoader = dynamic(() => import('@/components/ui/loader-wi'), { ssr: false })

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫' },
  48: { label: 'Depositing Rime Fog', icon: '🌫' },
  51: { label: 'Light Drizzle', icon: '🌦' },
  53: { label: 'Moderate Drizzle', icon: '🌦' },
  55: { label: 'Dense Drizzle', icon: '🌧' },
  61: { label: 'Slight Rain', icon: '🌦' },
  63: { label: 'Moderate Rain', icon: '🌧' },
  65: { label: 'Heavy Rain', icon: '🌧' },
  71: { label: 'Slight Snow', icon: '🌨' },
  73: { label: 'Moderate Snow', icon: '🌨' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  80: { label: 'Slight Rain Showers', icon: '🌦' },
  81: { label: 'Moderate Rain Showers', icon: '🌧' },
  82: { label: 'Violent Rain Showers', icon: '🌧' },
  95: { label: 'Thunderstorm', icon: '⛈' },
  96: { label: 'Thunderstorm with Hail', icon: '⛈' },
}

function IntelContent() {
  const router = useRouter()
  const params = useSearchParams()
  const city = params.get('city') || 'Karnataka'
  const placeParam = params.get('place')
  const placeLatParam = params.get('lat')
  const placeLngParam = params.get('lng')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IntelligenceResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    AuthManager.current().then(u => {
      if (!u) router.replace('/')
    })
  }, [router])

  useEffect(() => {
    let cancelled = false
    const place = placeParam ?? undefined
    const lat = placeLatParam ? parseFloat(placeLatParam) : undefined
    const lng = placeLngParam ? parseFloat(placeLngParam) : undefined
    fetchIntelligence(city, place, lat, lng)
      .then(res => {
        if (!cancelled) {
          setData(res)
          savePrediction({
            district: city,
            mode: 'intelligence',
            condition: res?.weather?.current
              ? `Weather: ${res.weather.current.temperature_2m ?? '--'}°C`
              : 'Report completed',
            confidence: 1,
          })
        }
      })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [city, placeParam, placeLatParam, placeLngParam])

  if (loading) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse 120% 100% at 30% 20%, #f5f0e8 0%, #eee6d6 50%, #e8dcc8 100%)',
      }}>
        <WiLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#f5f0e8', gap: 16,
      }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 14, color: '#c0392b' }}>
          Unable to load intelligence data
        </p>
        <button onClick={() => router.push('/portal?city=' + encodeURIComponent(city))}
          style={{
            background: '#8b4513', color: '#fff', border: 'none', borderRadius: 10,
            padding: '14px 28px', fontFamily: 'Space Mono, monospace', fontSize: 14,
            letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
          }}>
          Try Again
        </button>
      </div>
    )
  }

  const avails = data?._available || []

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      background: 'radial-gradient(ellipse 120% 100% at 30% 20%, #f5f0e8 0%, #eee6d6 50%, #e8dcc8 100%)',
      padding: '60px 20px 80px',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 48, textAlign: 'center' }}
        >
          <p style={{
          fontFamily: 'Space Mono, monospace', fontSize: 15,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: '#2a1a0a', marginBottom: 12, opacity: 0.6,
        }}>
          Weather Intelligence
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 300,
            color: '#3d1f0a', letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            {placeParam ? placeParam : city}
          </h1>
          {placeParam && (
            <p style={{
              fontFamily: 'Space Mono, monospace', fontSize: 14,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#2a1a0a', opacity: 0.4, marginTop: 4,
            }}>
              {city} District
            </p>
          )}
          {data?.summary && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: 16,
                fontWeight: 300, color: '#3a2a1a', lineHeight: 1.7,
                maxWidth: 640, margin: '20px auto 0',
              }}
            >
              {data.summary}
            </motion.p>
          )}


        </motion.div>

        {/* Weather Section */}
        {avails.includes('weather') && data?.weather && (
          <Section delay={0.3} title="Current Weather">
            <WeatherBlock weather={data.weather} />
          </Section>
        )}

        {/* Places Section */}
        {avails.includes('places') && data?.places && data.places.length > 0 && (
          <Section delay={0.5} title={placeParam ? `Places near ${placeParam}` : 'Places to Visit'}>
            {placeParam && (
              <div style={{
                fontFamily: 'Space Mono, monospace', fontSize: 14,
                letterSpacing: '0.1em', color: '#8b6914',
                opacity: 0.6, marginBottom: 16,
                padding: '8px 16px', borderRadius: 8,
                background: 'rgba(180, 100, 60, 0.06)',
                display: 'inline-block',
              }}>
                Focused on: {placeParam}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {data.places.map((p, i) => (
                <div key={i} style={{
                  background: 'rgba(250,242,232,0.7)', borderRadius: 12,
                  padding: '12px 16px', border: '1px solid rgba(139,69,19,0.12)',
                  flex: '1 1 200px',
                }}>
                  <div style={{
                    fontFamily: 'Playfair Display, serif', fontSize: 15,
                    color: '#3d1f0a', marginBottom: 4,
                  }}>
                    {p.name}
                  </div>
                  <div style={{
                    fontFamily: 'Space Mono, monospace', fontSize: 14,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#2a1a0a', opacity: 0.5,
                  }}>
                    {p.type}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Wikipedia Section */}
        {avails.includes('knowledge') && data?.wikipedia && (
          <Section delay={0.7} title="About the District">
            <div style={{
              background: 'rgba(250,242,232,0.7)', borderRadius: 20,
              padding: 24, border: '1px solid rgba(139,69,19,0.12)',
            }}>
              <p style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: 15,
                fontWeight: 300, color: '#3a2a1a', lineHeight: 1.8, marginBottom: 16,
              }}>
                {data.wikipedia.extract}
              </p>
              {data.wikipedia.url && (
                  <a href={data.wikipedia.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontFamily: 'Space Mono, monospace', fontSize: 14,
                      letterSpacing: '0.1em', color: '#8b4513',
                  }}>
                  Read more on Wikipedia →
                </a>
              )}
            </div>
          </Section>
        )}

        {/* Wikivoyage Section */}
        {avails.includes('knowledge') && data?.wikivoyage && (
          <Section delay={0.9} title="Travel Guide">
            <div style={{
              background: 'rgba(250,242,232,0.7)', borderRadius: 20,
              padding: 24, border: '1px solid rgba(139,69,19,0.12)',
            }}>
              <p style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: 15,
                fontWeight: 300, color: '#3a2a1a', lineHeight: 1.8, marginBottom: 16,
              }}>
                {data.wikivoyage.extract}
              </p>
              {data.wikivoyage.url && (
                <a href={data.wikivoyage.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontFamily: 'Space Mono, monospace', fontSize: 14,
                      letterSpacing: '0.1em', color: '#8b4513',
                  }}>
                  Travel guide on Wikivoyage →
                </a>
              )}
            </div>
          </Section>
        )}

        {/* Images Section */}
        {avails.includes('images') && data?.images && data.images.length > 0 && (
          <Section delay={1.1} title="Gallery">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12,
            }}>
              {data.images.map((img, i) => (
                <a key={i} href={img.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    borderRadius: 14, overflow: 'hidden',
                    aspectRatio: '4/3', display: 'block',
                  }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* News Section */}
        {avails.includes('news') && data?.news && data.news.length > 0 && (
          <Section delay={1.3} title="Recent News">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.news.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'block', textDecoration: 'none',
                    background: 'rgba(250,242,232,0.7)', borderRadius: 12,
                    padding: '14px 18px', border: '1px solid rgba(139,69,19,0.1)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,69,19,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,69,19,0.1)' }}
                >
                  <div style={{
                    fontFamily: 'Montserrat, sans-serif', fontSize: 15,
                    fontWeight: 500, color: '#3d1f0a', marginBottom: 6,
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontFamily: 'Space Mono, monospace', fontSize: 14,
                    letterSpacing: '0.1em', color: '#2a1a0a', opacity: 0.4,
                  }}>
                    {item.source} • {item.published ? new Date(item.published).toLocaleDateString() : ''}
                  </div>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{ marginTop: 48, textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center' }}
        >
          <OutlineButton onClick={() => router.push('/portal?city=' + encodeURIComponent(city))}>
            ← CHANGE METHOD
          </OutlineButton>
          <OutlineButton onClick={() => router.push('/map')}>
            NEW DISTRICT
          </OutlineButton>
        </motion.div>
      </div>
    </div>
  )
}

function Section({ children, title, delay }: { children: React.ReactNode; title: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 48 }}
    >
      <h2 style={{
        fontFamily: 'Space Mono, monospace', fontSize: 14,
        letterSpacing: '0.25em', textTransform: 'uppercase',
        color: '#2a1a0a', opacity: 0.6, marginBottom: 20,
      }}>
        {title}
      </h2>
      {children}
    </motion.div>
  )
}

import type { WeatherData } from '@/lib/weatherIntelligence'

function WeatherBlock({ weather }: { weather: WeatherData }) {
  const current = weather?.current
  const daily = weather?.daily
  const code = current?.weather_code
  const wmo = (code != null ? WMO_CODES[code] : undefined) || { label: 'Unknown', icon: '🌡' }

  return (
    <div style={{
      background: 'rgba(250,242,232,0.7)', borderRadius: 20,
      padding: 24, border: '1px solid rgba(139,69,19,0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <span style={{ fontSize: 48 }}>{wmo.icon}</span>
        <div>
          <div style={{
            fontFamily: 'Playfair Display, serif', fontSize: 36,
            fontWeight: 300, color: '#3d1f0a', lineHeight: 1,
          }}>
            {current?.temperature_2m ?? '--'}°C
          </div>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 14,
            letterSpacing: '0.1em', color: '#2a1a0a', opacity: 0.5, marginTop: 4,
          }}>
            {wmo.label} • Feels like {current?.apparent_temperature ?? '--'}°C
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Humidity', value: `${current?.relative_humidity_2m ?? '--'}%` },
          { label: 'Wind', value: `${current?.wind_speed_10m ?? '--'} km/h` },
          { label: 'Pressure', value: `${current?.pressure_msl ?? '--'} hPa` },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'rgba(250,242,232,0.8)', borderRadius: 10,
            padding: '8px 14px', border: '1px solid rgba(139,69,19,0.08)',
            flex: '1 1 100px', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Space Mono, monospace', fontSize: 14,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#2a1a0a', opacity: 0.4, marginBottom: 4,
            }}>
              {item.label}
            </div>
            <div style={{
              fontFamily: 'Montserrat, sans-serif', fontSize: 16,
              fontWeight: 400, color: '#3d1f0a',
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
      {daily?.time && daily.time.length > 0 && (
        <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {daily.time.map((date: string, i: number) => (
            <div key={i} style={{
              background: 'rgba(250,242,232,0.8)', borderRadius: 10,
              padding: '8px 14px', border: '1px solid rgba(139,69,19,0.08)',
              flex: '1 1 120px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Space Mono, monospace', fontSize: 14,
                letterSpacing: '0.05em', color: '#2a1a0a', opacity: 0.5, marginBottom: 4,
              }}>
                {new Date(date).toLocaleDateString('en-IN', { weekday: 'short' })}
              </div>
              <div style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: 13,
                color: '#3d1f0a',
              }}>
                {daily?.temperature_2m_max?.[i] ?? '--'}° / {daily?.temperature_2m_min?.[i] ?? '--'}°
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function IntelligencePage() {
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
      <IntelContent />
    </Suspense>
  )
}
