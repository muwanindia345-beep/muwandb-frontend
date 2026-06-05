import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ user, theme, toggleTheme, logout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const loc = useLocation()

  const links = user
    ? [
        { to: '/dashboard', label: '🏠 Dashboard' },
        { to: '/console', label: '💻 Console' },
        { to: '/settings', label: '⚙️ Settings' },
      ]
    : []

  return (
    <>
      <nav style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: '20px', color: 'var(--accent2)', letterSpacing: '-0.5px' }}>
          🔐 MuwanDB
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="hide-mobile">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              color: loc.pathname === l.to ? 'var(--accent2)' : 'var(--text2)',
              background: loc.pathname === l.to ? 'var(--bg3)' : 'transparent',
              fontWeight: loc.pathname === l.to ? 600 : 400,
            }}>{l.label}</Link>
          ))}
          <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '6px 12px' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user
            ? <button onClick={logout} className="btn btn-outline" style={{ padding: '6px 12px', color: 'var(--red)' }}>Logout</button>
            : <Link to="/auth" className="btn btn-primary">Get Started</Link>
          }
        </div>

        {/* Mobile hamburger */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '6px 10px' }}
            id="theme-btn-mobile">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setMenuOpen(o => !o)} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '6px 10px', color: 'var(--text)', fontSize: '18px'
          }} id="hamburger">☰</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
              padding: '10px 14px', borderRadius: '8px', fontSize: '15px',
              color: loc.pathname === l.to ? 'var(--accent2)' : 'var(--text)',
              background: loc.pathname === l.to ? 'var(--bg3)' : 'transparent',
            }}>{l.label}</Link>
          ))}
          {user
            ? <button onClick={() => { logout(); setMenuOpen(false) }} style={{
                padding: '10px', borderRadius: '8px', background: '#ef444422',
                color: 'var(--red)', border: 'none', textAlign: 'left', fontSize: '15px'
              }}>🚪 Logout</button>
            : <Link to="/auth" onClick={() => setMenuOpen(false)} className="btn btn-primary">Get Started</Link>
          }
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          #hamburger, #theme-btn-mobile { display: none; }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
