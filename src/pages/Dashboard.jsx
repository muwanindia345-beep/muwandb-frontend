import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard({ user }) {
  const [copied, setCopied] = useState('')

  const copy = (val, label) => {
    navigator.clipboard.writeText(val)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const cards = [
    { icon: '💻', title: 'Query Console', desc: 'Run MQL queries on your database', to: '/console', color: '#7c3aed' },
    { icon: '⚙️', title: 'Settings', desc: 'Manage RLS rules and account', to: '/settings', color: '#10b981' },
  ]

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800 }}>Welcome, {user.username} 👋</h1>
        <p style={{ color: 'var(--text2)', marginTop: '4px' }}>Database: <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>{user.dbName}</span></p>
      </div>

      {/* Status */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
        <span style={{ fontWeight: 600 }}>Database Online</span>
        <span className="tag tag-green">Active</span>
        <span style={{ color: 'var(--text2)', fontSize: '13px', marginLeft: 'auto' }}>
          muwandb-server.onrender.com
        </span>
      </div>

      {/* API Keys */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px' }}>🔑 API Keys</h2>
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
                  <button onClick={() => copy(val, label)} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }}>
                    {copied === label ? '✅ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--accent2)', wordBreak: 'break-all', marginBottom: '4px' }}>
                {val ? val.substring(0, 40) + '...' : 'Login again to see key'}
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
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{c.icon}</div>
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
          <button onClick={() => copy(`const res = await fetch('${import.meta.env.VITE_API_URL}/query', {\n  method: 'POST',\n  headers: {\n    'x-api-key': '${user.anonKey}',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    query: 'SELECT * FROM your_table',\n    dbPassword: 'your_db_password',\n    userId: currentUser.id\n  })\n})`, 'snippet')} className="btn btn-outline" style={{ fontSize: '12px', padding: '4px 10px' }}>
            {copied === 'snippet' ? '✅ Copied!' : 'Copy Code'}
          </button>
        </div>
        <pre style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#a855f7', overflowX: 'auto', lineHeight: 1.8 }}>
{`const res = await fetch('${import.meta.env.VITE_API_URL}/query', {
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
