'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { AuthManager } from '@/lib/auth'

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

  useEffect(() => {
    AuthManager.current().then(u => {
      if (u) router.replace('/map')
    })
  }, [router])

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
        bottom: '10px',
        left: 0,
        width: '100vw',
        display: 'flex',
        zIndex: 1,
        pointerEvents: 'none',
        gap: '4px',
        padding: '0 4px',
      }}>
        {CONDITION_BG.map((cond) => {
          const labelColor = {
            Sunny: '#3b2d8a',
            Cloudy: '#b8860b',
            Rainy: '#f5c8a0',
            Stormy: '#b8d44a',
            Foggy: '#8b5a3a',
            Windy: '#9a5a7a',
          }[cond] || '#fff'
          return (
            <div key={`label-${cond}`} style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'Space Mono, monospace',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: labelColor,
              padding: '3px 0',
            }}>
              {cond}
            </div>
          )
        })}
      </div>

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

              <div className="login-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="google-btn"
                onClick={async () => {
                  setError('')
                  const result = await AuthManager.signInWithGoogle()
                  if (!result.success) setError(result.error || 'Google sign-in failed')
                }}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

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