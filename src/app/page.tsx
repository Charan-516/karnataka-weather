'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { AuthManager, type User } from '@/lib/auth'

const CONDITION_BG = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Foggy', 'Windy']

const WeatherBg = dynamic(
  () => import('@/systems/weather/WeatherBackground'),
  { ssr: false }
)

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isExiting, setIsExiting] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    AuthManager.current().then(u => {
      if (u) router.replace('/map')
    })
  }, [router])

  useEffect(() => {
    AuthManager.current().then(setUser)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result =
      mode === 'signup'
        ? await AuthManager.signup(name, email, password)
        : await AuthManager.login(email, password)

    if (!result.success) {
      setError(result.error || 'Something went wrong')
      return
    }

    setIsExiting(true)
    setTimeout(() => router.push('/map'), 900)
  }

  const handleLogout = async () => {
    await AuthManager.logout()
    setUser(null)
    router.push('/')
  }

  return (
    <>
      {/* 6 weather backgrounds split vertically */}
      {CONDITION_BG.map((cond, i) => (
        <div key={cond} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          clipPath: `inset(0 ${(100 / 6) * (5 - i)}vw 0 ${(100 / 6) * i}vw)`,
          pointerEvents: 'none',
        }}>
          <WeatherBg condition={cond} />
        </div>
      ))}
      {/* Vertical dividers between seasons */}
      {[1,2,3,4,5].map((i) => (
        <div key={`div-${i}`} style={{
          position: 'fixed',
          top: 0,
          left: `${(100 / 6) * i}vw`,
          width: '1px',
          height: '100vh',
          zIndex: 1,
          background: 'rgba(255,255,255,0.15)',
        }} />
      ))}
      {/* Season labels at bottom */}
      <div style={{
        position: 'fixed',
        bottom: '12px',
        left: 0,
        width: '100vw',
        display: 'flex',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        {CONDITION_BG.map((cond, i) => (
          <div key={`label-${cond}`} style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'Space Mono, monospace',
            fontSize: '8px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}>
            {cond}
          </div>
        ))}
      </div>

      {user && (
        <button
          onClick={handleLogout}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 100,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '10px 18px',
            color: '#fff',
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
        >
          Logout
        </button>
      )}

      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <AnimatePresence>
          {!isExiting && (
            <motion.div
              className="login-card float-element"
              initial={{
                opacity: 0,
                y: 24,
                filter: 'blur(8px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                filter: 'blur(12px)',
              }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h1>Karnataka</h1>
              <p className="subtitle">
                Atmospheric Weather
              </p>

              <form onSubmit={handleSubmit}>
                <AnimatePresence>
                  {mode === 'signup' && (
                    <motion.div
                      className="login-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label>Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="login-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="login-field">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="login-error">{error}</p>
                )}

                <button type="submit" className="login-btn">
                  {mode === 'signup'
                    ? 'Create Account'
                    : 'Enter'}
                </button>
              </form>

              <p
                className="login-toggle"
                onClick={() => {
                  setMode((m) =>
                    m === 'login' ? 'signup' : 'login'
                  )
                  setError('')
                }}
              >
                {mode === 'login' ? (
                  <>No account? <span>Sign up</span></>
                ) : (
                  <>Have an account? <span>Log in</span></>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}