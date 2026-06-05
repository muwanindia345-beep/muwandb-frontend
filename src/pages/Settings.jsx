import React, { useState } from 'react'
import axios from 'axios'

const API = '/api'

export default function Settings({ user }) {
  const [rlsForm, setRlsForm] = useState({ table: '', column: 'user_id', operator: '=' })
  const [rlsRules, setRlsRules] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const headers = { 'x-secret-key': user.secretKey }

  const setRLS = async () => {
    if (!rlsForm.table) return
    setLoading(true); setError(''); setMsg('')
    try {
      await axios.post(API + '/auth/rls', rlsForm, { headers })
      setMsg(`✅ RLS set for table: ${rlsForm.table}`)
      setRlsForm({ table: '', column: 'user_id', operator: '=' })
    } catch (e) { setError(e.response?.data?.error || 'Error') }
    setLoading(false)
  }

  const viewRLS = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await axios.get(API + '/auth/rls', { headers })
      setRlsRules(data.rls)
    } catch (e) { setError(e.response?.data?.error || 'Error') }
    setLoading(false)
  }

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, marginBottom: '4px' }}>⚙️ Settings</h1>
      <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '24px' }}>Manage your database security</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Account Info */}
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>👤 Account Info</h2>
          {[['Username', user.username], ['Database', user.dbName], ['Status', 'Active']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
              <span style={{ color: 'var(--text2)' }}>{k}</span>
              <span style={{ fontWeight: 600, color: k === 'Status' ? 'var(--green)' : 'var(--text)' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* RLS Manager */}
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '4px', fontSize: '15px' }}>🛡️ Row Level Security</h2>
          <p style={{ color: 'var(--text2)', fontSize: '12px', marginBottom: '16px' }}>
            Anon key users only see rows matching their userId
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
            <input placeholder="Table name (e.g. posts)" value={rlsForm.table}
              onChange={e => setRlsForm({ ...rlsForm, table: e.target.value })} />
            <input placeholder="Column (default: user_id)" value={rlsForm.column}
              onChange={e => setRlsForm({ ...rlsForm, column: e.target.value })} />
            <select value={rlsForm.operator} onChange={e => setRlsForm({ ...rlsForm, operator: e.target.value })}>
              {['=', '!=', '>', '<', '>=', '<='].map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          </div>

          {msg && <div style={{ padding: '8px 12px', background: '#10b98122', borderRadius: '8px', color: 'var(--green)', fontSize: '13px', marginBottom: '10px' }}>{msg}</div>}
          {error && <div style={{ padding: '8px 12px', background: '#ef444422', borderRadius: '8px', color: 'var(--red)', fontSize: '13px', marginBottom: '10px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={setRLS} disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
              {loading ? '...' : 'Set RLS'}
            </button>
            <button onClick={viewRLS} disabled={loading} className="btn btn-outline" style={{ flex: 1 }}>
              View Rules
            </button>
          </div>

          {rlsRules && (
            <div style={{ marginTop: '16px', background: 'var(--bg3)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Active RLS Rules:</div>
              {Object.keys(rlsRules).length === 0
                ? <div style={{ fontSize: '12px', color: 'var(--text2)' }}>No rules set</div>
                : Object.entries(rlsRules).map(([table, rule]) => (
                  <div key={table} style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--accent2)', marginBottom: '4px' }}>
                    {table}: {rule.column} {rule.operator} userId
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
