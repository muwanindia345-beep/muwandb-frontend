import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://muwandb-server.onrender.com'
const MUWAN_AUTH = 'https://muwan-auth.onrender.com'

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
        login({
          username: data.username,
          dbName: data.dbName,
          anonKey: data.anonKey,
          secretKey: data.secretKey
        })
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  const googleLogin = () => {
    window.location.href = `${MUWAN_AUTH}/auth/google`
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

        {/* Google Button */}
        <button onClick={googleLogin} className="btn btn-outline" style={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px' }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text2)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

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
