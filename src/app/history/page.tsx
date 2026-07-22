'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AuthManager } from '@/lib/auth'
import { fetchHistory, deleteHistoryEntry, type HistoryEntry } from '@/lib/history'
import { OutlineButton } from '@/components/ui/button'

function HistoryPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMode, setFilterMode] = useState<string>('all')

  useEffect(() => {
    AuthManager.current().then(u => {
      if (!u) router.replace('/')
    })
  }, [router])

  useEffect(() => {
    fetchHistory().then(data => {
      setEntries(data)
      setLoading(false)
    })
  }, [])

  const filtered = filterMode === 'all'
    ? entries
    : entries.filter(e => e.mode === filterMode)

  const handleDelete = async (id: string) => {
    const ok = await deleteHistoryEntry(id)
    if (ok) setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      background: 'radial-gradient(ellipse 120% 100% at 30% 20%, #f5f0e8 0%, #eee6d6 50%, #e8dcc8 100%)',
      padding: '60px 20px 80px',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 40, textAlign: 'center' }}
        >
          <p style={{
          fontFamily: 'Space Mono, monospace', fontSize: 15,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: '#2a1a0a', marginBottom: 12, opacity: 0.6,
        }}>
          History
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300,
            color: '#3d1f0a', letterSpacing: '-0.03em',
          }}>
            Prediction History
          </h1>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ display: 'flex', gap: 12, marginBottom: 32, justifyContent: 'center' }}
        >
          {['all', 'manual', 'iot', 'intelligence'].map(m => (
            <button key={m}
              onClick={() => setFilterMode(m)}
              style={{
                fontFamily: 'Space Mono, monospace', fontSize: 14,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '8px 20px', borderRadius: 99, cursor: 'pointer',
                background: filterMode === m ? '#8b4513' : 'rgba(250,242,232,0.7)',
                color: filterMode === m ? '#fff' : '#3a1a08',
                border: filterMode === m ? 'none' : '1px solid rgba(139,69,19,0.15)',
              }}
            >
              {m === 'all' ? 'All' : m}
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{
            textAlign: 'center', fontFamily: 'Space Mono, monospace',
            fontSize: 14, letterSpacing: '0.2em', color: '#2a1a0a', opacity: 0.5,
            padding: 60,
          }}>
            Loading...
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 60,
            fontFamily: 'Montserrat, sans-serif', fontSize: 15,
            fontWeight: 300, color: '#3a2a1a',
          }}>
            No predictions yet. Make your first weather prediction!
          </div>
        )}

        {/* Entries */}
        {!loading && filtered.map((entry, i) => (
          <motion.div
            key={entry.id || i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            style={{
              background: 'rgba(250,242,232,0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139,69,19,0.1)',
              borderRadius: 16, padding: '20px 24px',
              marginBottom: 14, display: 'flex',
              alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => router.push(`/result?city=${encodeURIComponent(entry.district)}&condition=${entry.condition}&confidence=${entry.confidence}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <span style={{
                  fontFamily: 'Playfair Display, serif', fontSize: 26,
                  fontWeight: 300, color: '#3d1f0a',
                }}>
                  {entry.condition}
                </span>
                <span style={{
                  fontFamily: 'Space Mono, monospace', fontSize: 14,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '4px 12px', borderRadius: 99,
                  background: 'rgba(139,69,19,0.08)',
                  color: '#2a1a0a', opacity: 0.5,
                }}>
                  {entry.mode}
                </span>
              </div>
              <div style={{
                fontFamily: 'Space Mono, monospace', fontSize: 14,
                letterSpacing: '0.08em', color: '#2a1a0a', opacity: 0.4,
              }}>
                {entry.district} • {Math.round(entry.confidence * 100)}% confidence
                {entry.created_at && ` • ${new Date(entry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
              </div>
            </div>

            <button onClick={() => { if (entry.id) handleDelete(entry.id) }}
              style={{
                background: 'transparent', border: 'none',
                color: '#c0392b', opacity: 0.4, cursor: 'pointer',
                fontSize: 16, padding: '4px 8px',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.4' }}
            >
              ✕
            </button>
          </motion.div>
        ))}

        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ marginTop: 40, textAlign: 'center' }}
        >
          <OutlineButton onClick={() => router.push('/map')}>
            ← BACK TO MAP
          </OutlineButton>
        </motion.div>
      </div>
    </div>
  )
}

export default HistoryPage
