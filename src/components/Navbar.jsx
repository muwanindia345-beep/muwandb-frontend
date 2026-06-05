import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Icons = {
  logo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  console: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  sun: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
}

export default function Navbar({ user, theme, toggleTheme, logout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const loc = useLocation()

  const links = user ? [
    { to: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
    { to: '/console', label: 'Console', icon: Icons.console },
    { to: '/settings', label: 'Settings', icon: Icons.settings },
  ] : []

  return (
    <>
      <nav style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '0 20px', height: '60px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(10px)',
      }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: '18px', color: 'var(--accent2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--accent)' }}>{Icons.logo}</span> MuwanDB
        </Link>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }} className="hide-mobile">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '6px 14px', borderRadius: '8px', fontSize: '13px',
              color: loc.pathname === l.to ? 'var(--accent2)' : 'var(--text2)',
              background: loc.pathname === l.to ? 'var(--bg3)' : 'transparent',
              fontWeight: loc.pathname === l.to ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>{l.icon}{l.label}</Link>
          ))}
          <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
            {theme === 'dark' ? Icons.sun : Icons.moon}
          </button>
          {user
            ? <button onClick={logout} className="btn btn-outline" style={{ padding: '6px 12px', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '6px' }}>{Icons.logout} Logout</button>
            : <Link to="/auth" className="btn btn-primary">Get Started</Link>
          }
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }} id="theme-btn-mobile">
            {theme === 'dark' ? Icons.sun : Icons.moon}
          </button>
          <button onClick={() => setMenuOpen(o => !o)} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '6px 10px', color: 'var(--text)',
            display: 'flex', alignItems: 'center'
          }} id="hamburger">{Icons.menu}</button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px'
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
              padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
              color: loc.pathname === l.to ? 'var(--accent2)' : 'var(--text)',
              background: loc.pathname === l.to ? 'var(--bg3)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>{l.icon}{l.label}</Link>
          ))}
          {user
            ? <button onClick={() => { logout(); setMenuOpen(false) }} style={{
                padding: '10px 14px', borderRadius: '8px', background: '#ef444422',
                color: 'var(--red)', border: 'none', textAlign: 'left', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
              }}>{Icons.logout} Logout</button>
            : <Link to="/auth" onClick={() => setMenuOpen(false)} className="btn btn-primary">Get Started</Link>
          }
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { #hamburger, #theme-btn-mobile { display: none; } }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
      `}</style>
    </>
  )
}
