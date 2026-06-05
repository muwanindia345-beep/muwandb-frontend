import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = '/api'

const Icons = {
  key: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  copy: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  refresh: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  console: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  settings: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  db: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
}

export default function Dashboard({ user, login }) {
  const [copied, setCopied] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [refreshMsg, setRefreshMsg] = useState('')
  const navigate = useNavigate()

  const copy = (val, label) => {
    if (!val) return
    navigator.clipboard.writeText(val)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const refreshKeys = async () => {
    setRefreshing(true)
    setRefreshMsg('')
    try {
      const { data } = await axios.post(API + '/auth/login', {
        username: user.username,
        password: prompt('Enter your password to refresh keys:')
      })
      login({ username: data.username, dbName: data.dbName, anonKey: data.anonKey, secretKey: data.secretKey })
      setRefreshMsg('Keys refreshed!')
    } catch (e) {
      setRefreshMsg(e.response?.data?.error || 'Failed to refresh')
    }
    setRefreshing(false)
    setTimeout(() => setRefreshMsg(''), 3000)
  }

  const cards = [
    { icon: Icons.console, title: 'Query Console', desc: 'Run MQL queries on your database', to: '/console', color: '#7c3aed' },
    { icon: Icons.settings, title: 'Settings', desc: 'Manage RLS rules and account', to: '/settings', color: '#10b981' },
  ]

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800 }}>Welcome, {user.username} 👋</h1>
        <p style={{ color: 'var(--text2)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {Icons.db} Database: <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>{user.dbName}</span>
        </p>
      </div>

      {/* Status */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)', flexShrink: 0 }} />
        <span style={{ fontWeight: 600 }}>Database Online</span>
        <span className="tag tag-green">Active</span>
      </div>

      {/* API Keys */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {Icons.key} API Keys
          </h2>
          <button onClick={refreshKeys} disabled={refreshing} className="btn btn-outline"
            style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {Icons.refresh} {refreshing ? 'Refreshing...' : 'Refresh Keys'}
          </button>
        </div>

        {refreshMsg && (
          <div style={{ marginBottom: '12px', padding: '8px 12px', background: refreshMsg.includes('refreshed') ? '#10b98122' : '#ef444422', borderRadius: '8px', fontSize: '13px', color: refreshMsg.includes('refreshed') ? 'var(--green)' : 'var(--red)' }}>
            {refreshMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Anon Key', val: user.anonKey, tag: 'Frontend Safe', tagColor: 'yellow', desc: 'Use in frontend — RLS enforced' },
            { label: 'Secret Key', val: user.secretKey, tag: 'Backend Only', tagColor: 'purple', desc: 'Never expose in frontend!' },
          ].map(({ label, val, tag, tagColor, desc }) => (
            <div key={label} style={{ background: 'var(--bg3)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{label}</span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span className={`tag tag-${tagColor}`}>{tag}</span>
                  <button onClick={() => copy(val, label)} disabled={!val} className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {copied === label ? Icons.check : Icons.copy}
                    {copied === label ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: val ? 'var(--accent2)' : 'var(--text2)', wordBreak: 'break-all', marginBottom: '4px' }}>
                {val ? val.substring(0, 40) + '...' : '⚠️ Session expired — click Refresh Keys'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {cards.map(c => (
          <Link key={c.to} to={c.to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ marginBottom: '10px', color: c.color }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>{c.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '13px' }}>{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Code snippet */}
      <div className="card" style={{ background: '#0d0d14' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Quick Connect</span>
          <button onClick={() => copy(`const res = await fetch('/api/query', {\n  method: 'POST',\n  headers: {\n    'x-api-key': '${user.anonKey}',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    query: 'SELECT * FROM your_table',\n    dbPassword: 'your_db_password',\n    userId: currentUser.id\n  })\n})`, 'snippet')} className="btn btn-outline" style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {copied === 'snippet' ? Icons.check : Icons.copy}
            {copied === 'snippet' ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <pre style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#a855f7', overflowX: 'auto', lineHeight: 1.8 }}>
{`const res = await fetch('/api/query', {
  method: 'POST',
  headers: {
    'x-api-key': '${user.anonKey ? user.anonKey.substring(0, 20) + '...' : 'YOUR_ANON_KEY'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'SELECT * FROM your_table',
    dbPassword: 'your_db_password',
    userId: currentUser.id
  })
})`}
        </pre>
      </div>
    </div>
  )
}
