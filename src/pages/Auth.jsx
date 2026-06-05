import React, { useState } from 'react'
import axios from 'axios'

const API = '/api'

export default function Auth({ login }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', dbName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [keys, setKeys] = useState(null)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    setError(''); setLoading(true)
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login'
      const payload = mode === 'register'
        ? { username: form.username, password: form.password, dbName: form.dbName }
        : { username: form.username, password: form.password }

      const { data } = await axios.post(API + endpoint, payload)

      if (mode === 'register') {
        setKeys({ anonKey: data.anonKey, secretKey: data.secretKey })
      } else {
        login({ username: data.username, dbName: data.dbName, anonKey: data.anonKey, secretKey: data.secretKey })
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  if (keys) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%' }}>
        <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>🎉</div>
        <h2 style={{ textAlign: 'center', marginBottom: '4px' }}>Registration Successful!</h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '13px', marginBottom: '24px' }}>
          Save these keys now! They won't be shown again.
        </p>

        {[['🔓 Anon Key (Frontend)', keys.anonKey, 'yellow'], ['🔒 Secret Key (Backend)', keys.secretKey, 'purple']].map(([label, val, color]) => (
          <div key={label} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{label}</span>
              <span className={`tag tag-${color}`}>{color === 'yellow' ? 'Public Safe' : 'Private'}</span>
            </div>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', fontSize: '11px', wordBreak: 'break-all', fontFamily: 'monospace', color: 'var(--accent2)' }}>
              {val}
            </div>
            <button onClick={() => navigator.clipboard.writeText(val)} className="btn btn-outline" style={{ marginTop: '6px', width: '100%', fontSize: '12px', padding: '6px' }}>
              Copy
            </button>
          </div>
        ))}

        <button onClick={() => login({ username: form.username, dbName: form.dbName, anonKey: keys.anonKey, secretKey: keys.secretKey })}
          className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>🔐</div>
        <h2 style={{ textAlign: 'center', marginBottom: '4px' }}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '13px', marginBottom: '24px' }}>
          {mode === 'login' ? 'Login to your MuwanDB account' : 'Start with your encrypted database'}
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              className={`btn ${mode === m ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, textTransform: 'capitalize' }}>
              {m}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input name="username" placeholder="Username" value={form.username} onChange={handle} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handle} />
          {mode === 'register' && (
            <input name="dbName" placeholder="Database Name (e.g. myapp)" value={form.dbName} onChange={handle} />
          )}
        </div>

        {error && <div style={{ marginTop: '12px', padding: '10px', background: '#ef444422', borderRadius: '8px', color: 'var(--red)', fontSize: '13px' }}>{error}</div>}

        <button onClick={submit} disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
          {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}
