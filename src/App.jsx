import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Console from './pages/Console'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('muwandb_user') || 'null'))

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
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} />
        <Route path="/console" element={user ? <Console user={user} /> : <Navigate to="/auth" />} />
        <Route path="/settings" element={user ? <Settings user={user} /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}
