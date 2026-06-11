import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Console from './pages/Console'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'

const MUWAN_AUTH = 'https://muwan-auth.onrender.com'

function GoogleCallback({ login }) {
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (token) {
      fetch(`${MUWAN_AUTH}/session/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          login({
            username: data.user.username,
            email: data.user.email,
            provider: 'google',
            token
          })
        }
      })
      .catch(console.error)
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text2)' }}>Logging in with Google...</p>
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
        <Route path="/dashboard" element={user ? <Dashboard user={user} login={login} /> : <Navigate to="/auth" />} />
        <Route path="/console" element={user ? <Console user={user} /> : <Navigate to="/auth" />} />
        <Route path="/settings" element={user ? <Settings user={user} /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}
