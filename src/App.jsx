import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Console from './pages/Console'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'

const MUWAN_AUTH = 'https://muwan-auth.onrender.com'
const API = import.meta.env.VITE_API_URL || 'https://muwandb-server.onrender.com'

function GoogleCallback({ login }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState('Verifying...')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (!token) {
      navigate('/auth')
      return
    }

    // Muwan Auth se verify karo
    fetch(`${MUWAN_AUTH}/session/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    .then(r => r.json())
    .then(async data => {
      if (!data.success) {
        navigate('/auth')
        return
      }

      const { email, username } = data.user

      // MuwanDB server pe check karo — account hai ya nahi
      try {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password: token.slice(0, 16) })
        })
        const loginData = await res.json()

        if (res.ok && loginData.anonKey) {
          // Account hai — seedha login
          login({
            username: loginData.username,
            dbName: loginData.dbName,
            anonKey: loginData.anonKey,
            secretKey: loginData.secretKey,
            email,
            provider: 'google'
          })
          navigate('/dashboard')
        } else {
          // Account nahi hai — registration pe bhejo
          navigate('/auth/google-register', {
            state: { email, username, token }
          })
        }
      } catch {
        navigate('/auth/google-register', {
          state: { email, username, token }
        })
      }
    })
    .catch(() => navigate('/auth'))
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
        <p style={{ color: 'var(--text2)' }}>{status}</p>
      </div>
    </div>
  )
}

function GoogleRegister({ login }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { email, username, token } = location.state || {}
  const [dbName, setDbName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!token) {
    navigate('/auth')
    return null
  }

  const submit = async () => {
    if (!dbName) return setError('Database name required')
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password: token.slice(0, 16),
          dbName
        })
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Registration failed')

      login({
        username: data.username || username,
        dbName: data.dbName || dbName,
        anonKey: data.anonKey,
        secretKey: data.secretKey,
        email,
        provider: 'google'
      })
      navigate('/dashboard')
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>🎉</div>
        <h2 style={{ textAlign: 'center', marginBottom: '4px' }}>Almost there!</h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '13px', marginBottom: '8px' }}>
          Signed in as <strong>{email}</strong>
        </p>
        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '13px', marginBottom: '24px' }}>
          Create your encrypted database to continue
        </p>

        <input
          placeholder="Database name (e.g. myapp)"
          value={dbName}
          onChange={e => setDbName(e.target.value)}
          style={{ width: '100%', marginBottom: '12px' }}
        />

        {error && (
          <div style={{ padding: '10px', background: '#ef444422', borderRadius: '8px', color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        <button onClick={submit} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
          {loading ? 'Creating...' : 'Create Database →'}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('muwandb_user') || 'null')
    } catch { return null }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('muwandb_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('muwandb_user')
  }

  return (
    <BrowserRouter>
      <Navbar user={user} theme={theme} toggleTheme={toggleTheme} logout={logout} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={!user ? <Auth login={login} /> : <Navigate to="/dashboard" />} />
        <Route path="/auth/callback" element={<GoogleCallback login={login} />} />
        <Route path="/auth/google-register" element={<GoogleRegister login={login} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} login={login} /> : <Navigate to="/auth" />} />
        <Route path="/console" element={user ? <Console user={user} /> : <Navigate to="/auth" />} />
        <Route path="/settings" element={user ? <Settings user={user} /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}
