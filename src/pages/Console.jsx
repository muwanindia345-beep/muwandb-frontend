import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://muwandb-server.onrender.com'
const DOCS_URL = 'https://muwandb-frontend.onrender.com/MuwanDB_Guide.pdf'

const SHORTCUTS = [
  { label: 'Show Tables', query: 'SHOW TABLES', color: '#06b6d4' },
  { label: 'Create Table', query: 'CREATE TABLE users (id:INT name:STR email:STR age:INT active:BOOL)', color: '#7c3aed' },
  { label: 'Insert Row', query: "INSERT INTO users (1 'Saad' 'saad@email.com' 20 1)", color: '#10b981' },
  { label: 'Select All', query: 'SELECT * FROM users', color: '#a855f7' },
  { label: 'Select WHERE', query: 'SELECT * FROM users WHERE age > 18', color: '#a855f7' },
  { label: 'Select Cols', query: 'SELECT id name FROM users WHERE active = 1', color: '#a855f7' },
  { label: 'Select LIMIT', query: 'SELECT * FROM users LIMIT 10 OFFSET 0', color: '#a855f7' },
  { label: 'Select ORDER', query: 'SELECT * FROM users ORDER BY age DESC', color: '#a855f7' },
  { label: 'Count Rows', query: 'SELECT COUNT(*) FROM users', color: '#f59e0b' },
  { label: 'Multi Filter', query: 'SELECT * FROM users WHERE age > 18 AND active = 1', color: '#a855f7' },
  { label: 'Update Row', query: "UPDATE users SET name='NewName' age=25 WHERE id = 1", color: '#f59e0b' },
  { label: 'Delete Row', query: 'DELETE FROM users WHERE id = 1', color: '#ef4444' },
  { label: 'Drop Table', query: 'DROP TABLE users', color: '#ef4444' },
]

const SDK_EXAMPLES = [
  {
    label: 'Select + Filter',
    code: `const { data } = await db
  .from('users')
  .select('id name email')
  .eq('active', 1)
  .gt('age', 18)
  .order('name', 'asc')
  .limit(10)
  .get();`,
  },
  {
    label: 'Insert Row',
    code: `const { data, error } = await db
  .from('users')
  .insert({
    id: Date.now(),
    name: 'Saad',
    email: 'saad@email.com',
    age: 20,
    active: 1
  });`,
  },
  {
    label: 'Update Row',
    code: `const { error } = await db
  .from('users')
  .eq('id', 1)
  .update({ name: 'Updated', age: 21 });`,
  },
  {
    label: 'Delete Row',
    code: `const { error } = await db
  .from('users')
  .eq('id', 1)
  .delete();`,
  },
  {
    label: 'Count Rows',
    code: `const { count } = await db
  .from('users')
  .count()
  .get();`,
  },
  {
    label: 'Raw SQL',
    code: `// Secret key only!
const { data } = await adminDb
  .raw('SELECT * FROM users WHERE age > 18');

await adminDb.createTable('posts', {
  id: 'INT', title: 'STR',
  userId: 'INT', createdAt: 'INT'
});`,
  },
]

function ResultTable({ data }) {
  if (!data || !data.length) return null
  const keys = Object.keys(data[0])
  return (
    <div style={{ overflowX: 'auto', marginTop: '8px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
        <thead>
          <tr>
            {keys.map(k => (
              <th key={k} style={{ padding: '6px 10px', background: '#7c3aed33', color: '#a855f7', borderBottom: '1px solid #2d2d5e', textAlign: 'left', fontWeight: 700 }}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#12122a' : '#0d0d14' }}>
              {keys.map(k => (
                <td key={k} style={{ padding: '6px 10px', color: '#94a3b8', borderBottom: '1px solid #1a1a2e' }}>
                  {String(row[k] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Console({ user }) {
  const [query, setQuery] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [keyType, setKeyType] = useState('secret')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('mql')
  const [sdkTab, setSdkTab] = useState(0)
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!query.trim() || !dbPassword) {
      setResult({ success: false, error: 'Query aur DB Password dono required hain!' })
      return
    }
    const key = keyType === 'secret' ? user?.secretKey : user?.anonKey
    if (!key) {
      setResult({ success: false, error: 'API Key missing — logout karke login karo.' })
      return
    }
    setLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (keyType === 'secret') headers['x-secret-key'] = key
      else headers['x-api-key'] = key

      const { data } = await axios.post(API + '/query/raw', { query, dbPassword }, { headers })
      setResult({ success: true, data })
      setHistory(h => [{ query, time: new Date().toLocaleTimeString(), ok: true }, ...h.slice(0, 14)])
    } catch (e) {
      const err = e.response?.data?.error || 'Network error'
      setResult({ success: false, error: err })
      setHistory(h => [{ query, time: new Date().toLocaleTimeString(), ok: false }, ...h.slice(0, 14)])
    }
    setLoading(false)
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderOutput = () => {
    if (!result) return (
      <div style={{ color: '#475569', fontSize: '13px', fontFamily: 'monospace', padding: '8px' }}>
        {'> '}<span style={{ opacity: 0.5 }}>Waiting for query...</span>
      </div>
    )
    if (!result.success) return (
      <div style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '13px', padding: '8px' }}>
        [ERROR] {result.error}
      </div>
    )
    const d = result.data
    if (d?.data && Array.isArray(d.data) && d.data.length > 0) {
      return (
        <div>
          <div style={{ color: '#10b981', fontSize: '11px', marginBottom: '8px', padding: '0 4px' }}>
            ✅ {d.count ?? d.data.length} row(s) returned
          </div>
          <ResultTable data={d.data} />
        </div>
      )
    }
    if (d?.count !== undefined && !d?.data) return (
      <div style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '13px', padding: '8px' }}>
        ✅ COUNT: {d.count}
      </div>
    )
    if (d?.data && Array.isArray(d.data) && d.data.length === 0) return (
      <div style={{ color: '#f59e0b', fontFamily: 'monospace', fontSize: '13px', padding: '8px' }}>
        ⚠️ 0 rows found
      </div>
    )
    if (d?.message) return (
      <div style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '13px', padding: '8px' }}>
        ✅ {d.message}
      </div>
    )
    return (
      <pre style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', padding: '8px' }}>
        {JSON.stringify(d, null, 2)}
      </pre>
    )
  }

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, marginBottom: '2px' }}>💻 Query Console</h1>
          <p style={{ color: 'var(--text2)', fontSize: '13px' }}>Run MQL queries on your encrypted database</p>
        </div>
        <a href={DOCS_URL} target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#7c3aed22', border: '1px solid #7c3aed55', borderRadius: '8px', color: '#a855f7', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          📄 Docs PDF
        </a>
      </div>

      {/* Key status */}
      <div style={{ padding: '10px 14px', background: user?.secretKey ? '#10b98122' : '#ef444422', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', color: user?.secretKey ? 'var(--green)' : 'var(--red)', border: '1px solid', borderColor: user?.secretKey ? 'var(--green)' : 'var(--red)' }}>
        {user?.secretKey ? '✅ API Keys loaded — ready to query!' : '❌ Keys missing — logout karke dobara login karo'}
      </div>

      {/* Tabs: MQL / SDK Examples */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--bg2)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)', width: 'fit-content' }}>
        {['mql', 'sdk'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding: '6px 16px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: activeTab === t ? 'var(--accent)' : 'transparent', color: activeTab === t ? '#fff' : 'var(--text2)', transition: 'all 0.2s' }}>
            {t === 'mql' ? '⚡ MQL Console' : '📦 SDK Examples'}
          </button>
        ))}
      </div>

      {activeTab === 'mql' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Left panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card" style={{ padding: '16px' }}>
              {/* Key selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                {['secret', 'anon'].map(k => (
                  <button key={k} onClick={() => setKeyType(k)}
                    className={`btn ${keyType === k ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, fontSize: '12px', padding: '6px' }}>
                    {k === 'secret' ? '🔒 Secret Key' : '🔓 Anon Key'}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--accent2)', background: 'var(--bg3)', padding: '6px 10px', borderRadius: '6px', marginBottom: '10px', wordBreak: 'break-all' }}>
                {keyType === 'secret'
                  ? (user?.secretKey ? user.secretKey.substring(0, 30) + '...' : 'No key')
                  : (user?.anonKey ? user.anonKey.substring(0, 30) + '...' : 'No key')}
              </div>
              <input placeholder="Database Password 🔑" type="password" value={dbPassword}
                onChange={e => setDbPassword(e.target.value)} style={{ marginBottom: '10px' }} />
              <textarea value={query} onChange={e => setQuery(e.target.value)}
                placeholder={"Enter MQL query...\ne.g. SELECT * FROM users WHERE age > 18"}
                onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') run() }}
                style={{ minHeight: '130px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', marginBottom: '10px' }} />
              <button onClick={run} disabled={loading || !query.trim() || !dbPassword}
                className="btn btn-primary" style={{ width: '100%' }}>
                {loading ? '⏳ Running...' : '▶ Run Query (Ctrl+Enter)'}
              </button>
            </div>

            {/* Quick Queries */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'var(--text2)' }}>⚡ Quick Queries</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {SHORTCUTS.map(s => (
                  <button key={s.query} onClick={() => setQuery(s.query)} style={{
                    background: 'var(--bg3)', border: `1px solid var(--border)`, borderRadius: '6px',
                    padding: '6px 10px', color: 'var(--text2)', fontSize: '11px', fontFamily: 'monospace',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.color = s.color }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}>
                    <span>{s.query.length > 42 ? s.query.substring(0, 42) + '...' : s.query}</span>
                    <span style={{ fontSize: '10px', color: s.color, fontFamily: 'sans-serif', fontWeight: 600, flexShrink: 0, marginLeft: '8px' }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Output */}
            <div className="card" style={{ background: '#0a0a14', minHeight: '220px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {['#ef4444', '#f59e0b', '#10b981'].map(c => (
                    <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                  ))}
                  <span style={{ fontSize: '12px', color: 'var(--text2)', marginLeft: '6px' }}>Output</span>
                </div>
                {result?.success && (
                  <span style={{ fontSize: '11px', color: '#10b981' }}>
                    {result.data?.count !== undefined ? `${result.data.count} rows` : ''}
                  </span>
                )}
              </div>
              {renderOutput()}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'var(--text2)' }}>🕐 History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '220px', overflowY: 'auto' }}>
                  {history.map((h, i) => (
                    <div key={i} onClick={() => setQuery(h.query)} style={{
                      background: 'var(--bg3)', borderRadius: '6px', padding: '7px 10px',
                      cursor: 'pointer', border: `1px solid ${h.ok ? '#10b98133' : '#ef444433'}`,
                      transition: 'all 0.15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = h.ok ? '#10b981' : '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = h.ok ? '#10b98133' : '#ef444433'}>
                      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: h.ok ? 'var(--accent2)' : '#ef4444', marginBottom: '2px', wordBreak: 'break-all' }}>
                        {h.ok ? '✅' : '❌'} {h.query.length > 50 ? h.query.substring(0, 50) + '...' : h.query}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text2)' }}>{h.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SDK Examples Tab */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '4px' }}>
              Install: <code style={{ background: 'var(--bg3)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent2)', fontSize: '12px' }}>npm install muwandb-js</code>
            </p>
            {SDK_EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setSdkTab(i)} style={{
                padding: '10px 14px', borderRadius: '8px', border: `1px solid ${sdkTab === i ? 'var(--accent)' : 'var(--border)'}`,
                background: sdkTab === i ? '#7c3aed22' : 'var(--bg2)', color: sdkTab === i ? 'var(--accent2)' : 'var(--text2)',
                fontSize: '13px', fontWeight: 600, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
              }}>
                {ex.label}
              </button>
            ))}
          </div>
          <div>
            <div className="card" style={{ background: '#0a0a14', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: 'var(--accent2)', fontSize: '13px', fontWeight: 600 }}>{SDK_EXAMPLES[sdkTab].label}</span>
                <button onClick={() => copyCode(SDK_EXAMPLES[sdkTab].code)}
                  style={{ padding: '4px 10px', background: copied ? '#10b98122' : 'var(--bg3)', border: `1px solid ${copied ? '#10b981' : 'var(--border)'}`, borderRadius: '6px', color: copied ? '#10b981' : 'var(--text2)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre style={{ color: '#a855f7', fontSize: '13px', fontFamily: 'monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {SDK_EXAMPLES[sdkTab].code}
              </pre>
            </div>
            <div className="card" style={{ marginTop: '12px', padding: '14px', background: '#06b6d411', border: '1px solid #06b6d433' }}>
              <p style={{ color: '#06b6d4', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>📄 Full Documentation</p>
              <p style={{ color: 'var(--text2)', fontSize: '12px', marginBottom: '10px' }}>Saari queries, operators, RLS setup aur examples PDF mein hain.</p>
              <a href={DOCS_URL} target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', padding: '7px 16px', background: '#7c3aed', borderRadius: '7px', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                📄 Download MuwanDB Guide PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
