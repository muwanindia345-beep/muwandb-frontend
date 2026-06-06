import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://muwandb-server.onrender.com'

export default function Console({ user }) {
  const [query, setQuery] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [keyType, setKeyType] = useState('secret')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const run = async () => {
    if (!query.trim() || !dbPassword) return
    setLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (keyType === 'secret') headers['x-secret-key'] = user.secretKey
      else headers['x-api-key'] = user.anonKey

      const { data } = await axios.post(API + '/query', { query, dbPassword }, { headers })
      setResult({ success: true, data })
      setHistory(h => [{ query, result: data.result, time: new Date().toLocaleTimeString() }, ...h.slice(0, 9)])
    } catch (e) {
      setResult({ success: false, error: e.response?.data?.error || 'Error' })
    }
    setLoading(false)
  }

  const shortcuts = [
    'SHOW TABLES',
    'CREATE TABLE users (id:INT name:STR email:STR)',
    'INSERT INTO users (1 John john@mail.com)',
    'SELECT * FROM users',
    'SELECT * FROM users WHERE id = 1',
    'DELETE FROM users WHERE id = 1',
    'DROP TABLE users',
  ]

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, marginBottom: '4px' }}>💻 Query Console</h1>
      <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '24px' }}>Run MQL queries on your encrypted database</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Left - Query editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {['secret', 'anon'].map(k => (
                <button key={k} onClick={() => setKeyType(k)}
                  className={`btn ${keyType === k ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, fontSize: '12px', padding: '6px' }}>
                  {k === 'secret' ? '🔒 Secret Key' : '🔓 Anon Key'}
                </button>
              ))}
            </div>
            <input placeholder="Database Password" type="password" value={dbPassword}
              onChange={e => setDbPassword(e.target.value)} style={{ marginBottom: '12px' }} />
            <textarea value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Enter MQL query...&#10;e.g. SELECT * FROM users"
              onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') run() }}
              style={{ minHeight: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', marginBottom: '12px' }} />
            <button onClick={run} disabled={loading || !query.trim() || !dbPassword}
              className="btn btn-primary" style={{ width: '100%' }}>
              {loading ? 'Running...' : '▶ Run Query (Ctrl+Enter)'}
            </button>
          </div>

          {/* Shortcuts */}
          <div className="card">
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'var(--text2)' }}>Quick Queries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {shortcuts.map(s => (
                <button key={s} onClick={() => setQuery(s)} style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px',
                  padding: '6px 10px', color: 'var(--text2)', fontSize: '11px', fontFamily: 'monospace',
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent2)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Result + History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Result */}
          <div className="card" style={{ background: '#0d0d14', minHeight: '200px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {['#ef4444', '#f59e0b', '#10b981'].map(c => (
                <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
              ))}
              <span style={{ fontSize: '12px', color: 'var(--text2)', marginLeft: '8px' }}>Output</span>
            </div>
            {!result && <div style={{ color: 'var(--text2)', fontSize: '13px', fontFamily: 'monospace' }}>
              {'> '}<span style={{ opacity: 0.5 }}>Waiting for query...</span>
            </div>}
            {result && (
              <pre style={{
                fontSize: 'clamp(10px, 2vw, 13px)', fontFamily: 'monospace', whiteSpace: 'pre-wrap',
                wordBreak: 'break-word', lineHeight: 1.8,
                color: result.success ? '#10b981' : '#ef4444'
              }}>
                {result.success ? result.data.result : `[ERROR] ${result.error}`}
              </pre>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'var(--text2)' }}>History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                {history.map((h, i) => (
                  <div key={i} onClick={() => setQuery(h.query)} style={{
                    background: 'var(--bg3)', borderRadius: '6px', padding: '8px 10px',
                    cursor: 'pointer', border: '1px solid var(--border)'
                  }}>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--accent2)', marginBottom: '2px' }}>{h.query}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text2)' }}>{h.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
