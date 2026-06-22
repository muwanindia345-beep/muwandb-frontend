import React, { useState, useRef } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://muwandb-server.onrender.com'
const DOCS_URL = '/MuwanDB_Guide.pdf'

const SHORTCUTS = [
  { label: 'Show Tables',   query: 'SHOW TABLES',                                                            color: '#06b6d4' },
  { label: 'Create Table',  query: 'CREATE TABLE users (id:AUTO name:STR email:STR age:INT active:BOOL)',    color: '#7c3aed' },
  { label: 'Insert Row',    query: "INSERT INTO users name email age active VALUES 'Saad' 'saad@email.com' 20 true", color: '#10b981' },
  { label: 'Select All',    query: 'SELECT * FROM users',                                                    color: '#a855f7' },
  { label: 'Select Cols',   query: 'SELECT id name FROM users WHERE active = true',                          color: '#a855f7' },
  { label: 'Select LIMIT',  query: 'SELECT * FROM users LIMIT 10 OFFSET 0',                                  color: '#a855f7' },
  { label: 'Select ORDER',  query: 'SELECT * FROM users ORDER BY age DESC',                                  color: '#a855f7' },
  { label: 'Multi Filter',  query: 'SELECT * FROM users WHERE age > 18 AND active = true',                   color: '#a855f7' },
  { label: 'Count Rows',    query: 'SELECT COUNT(*) FROM users',                                             color: '#f59e0b' },
  { label: 'SUM',           query: 'SELECT SUM age FROM users',                                              color: '#f59e0b' },
  { label: 'AVG',           query: 'SELECT AVG age FROM users',                                              color: '#f59e0b' },
  { label: 'IN Filter',     query: "SELECT * FROM users WHERE name IN Saad|Ali|Zara",                        color: '#a855f7' },
  { label: 'BETWEEN',       query: 'SELECT * FROM users WHERE age BETWEEN 18|30',                           color: '#a855f7' },
  { label: 'SEARCH',        query: "SELECT * FROM users WHERE name SEARCH sa",                               color: '#a855f7' },
  { label: 'DISTINCT',      query: 'SELECT DISTINCT name FROM users',                                       color: '#a855f7' },
  { label: 'Update Row',    query: "UPDATE users SET name='NewName' age=25 WHERE id = 1",                   color: '#f59e0b' },
  { label: 'Delete Row',    query: 'DELETE FROM users WHERE id = 1',                                        color: '#ef4444' },
  { label: 'Transaction',   query: 'BEGIN',                                                                  color: '#06b6d4' },
  { label: 'Commit',        query: 'COMMIT',                                                                 color: '#10b981' },
  { label: 'Rollback',      query: 'ROLLBACK',                                                               color: '#ef4444' },
  { label: 'Drop Table',    query: 'DROP TABLE users',                                                       color: '#ef4444' },
]

const SDK_EXAMPLES = [
  { label: 'Select + Filter', code: `const { data } = await db\n  .from('users')\n  .select('id name email')\n  .eq('active', true)\n  .gt('age', 18)\n  .order('name', 'asc')\n  .limit(10)\n  .get();` },
  { label: 'Insert Row',      code: `const { data, error } = await db\n  .from('users')\n  .insert({\n    name: 'Saad',\n    email: 'saad@email.com',\n    age: 20,\n    active: true\n  });` },
  { label: 'Update Row',      code: `const { error } = await db\n  .from('users')\n  .eq('id', 1)\n  .update({ name: 'Updated', age: 21 });` },
  { label: 'Delete Row',      code: `const { error } = await db\n  .from('users')\n  .eq('id', 1)\n  .delete();` },
  { label: 'Count / SUM',     code: `// Count\nconst { count } = await db.from('users').count().get();\n\n// SUM\nconst { data } = await db.from('orders').sum('price').get();\n\n// AVG\nconst { data } = await db.from('users').avg('age').get();` },
  { label: 'IN / BETWEEN',    code: `// IN\nawait db.from('users').in('city', ['Delhi','Mumbai']).get();\n\n// BETWEEN\nawait db.from('users').between('age', 18, 30).get();\n\n// SEARCH\nawait db.from('posts').search('caption', 'hello').get();` },
  { label: 'Real-time',       code: `const unsub = db.subscribe('messages', ({ event, data }) => {\n  console.log(event, data)\n})\nunsub()` },
  { label: 'Transactions',    code: `await db.begin();\ntry {\n  await db.from('wallet').eq('id', 1).update({ balance: 500 });\n  await db.from('wallet').eq('id', 2).update({ balance: 1500 });\n  await db.commit();\n} catch {\n  await db.rollback();\n}` },
  { label: 'Raw MQL / SQL',   code: `await db.raw('SELECT * FROM users WHERE age > 18');\nawait db.raw(\`CREATE TABLE posts (\n  id SERIAL,\n  title VARCHAR(255)\n);\`);` },
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

function QueryTab({ user, activeProject }) {
  const [query, setQuery]           = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [keyType, setKeyType]       = useState('secret')
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(false)
  const [history, setHistory]       = useState([])
  const textareaRef                 = useRef(null)

  const currentKey = keyType === 'secret' ? activeProject?.secretKey : activeProject?.anonKey

  const run = async () => {
    if (!query.trim() || !dbPassword) {
      setResult({ success: false, error: 'Query and DB Password required!' }); return
    }
    if (!currentKey) { setResult({ success: false, error: 'API Key missing' }); return }
    setLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (keyType === 'secret') headers['x-secret-key'] = currentKey
      else headers['x-api-key'] = currentKey
      const { data } = await axios.post(API + '/query/raw', { query, dbPassword }, { headers })
      setResult({ success: true, data })
      setHistory(h => [{ query, time: new Date().toLocaleTimeString(), ok: true }, ...h.slice(0, 19)])
    } catch (e) {
      const err = e.response?.data?.error || 'Network error'
      setResult({ success: false, error: err })
      setHistory(h => [{ query, time: new Date().toLocaleTimeString(), ok: false }, ...h.slice(0, 19)])
    }
    setLoading(false)
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
    if (d?.data && Array.isArray(d.data) && d.data.length > 0) return (
      <div>
        <div style={{ color: '#10b981', fontSize: '11px', marginBottom: '8px', padding: '0 4px' }}>
          ✅ {d.count ?? d.data.length} row(s) returned
        </div>
        <ResultTable data={d.data} />
      </div>
    )
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
    if (d?.data?.sum !== undefined) return (
      <div style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '13px', padding: '8px' }}>
        ✅ SUM: {d.data.sum} | AVG: {d.data.avg} | MIN: {d.data.min} | MAX: {d.data.max}
      </div>
    )
    return (
      <pre style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', padding: '8px' }}>
        {JSON.stringify(d, null, 2)}
      </pre>
    )
  }

return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="card" style={{ padding: '16px' }}>
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
            {currentKey ? currentKey.substring(0, 30) + '...' : 'No key'}
          </div>
          <input placeholder="Database Password 🔑" type="password" value={dbPassword}
            onChange={e => setDbPassword(e.target.value)} style={{ marginBottom: '10px' }} />
          <textarea ref={textareaRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder={"Enter MQL / SQL query...\ne.g. SELECT * FROM users WHERE age > 18"}
            onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') run() }}
            style={{ minHeight: '130px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={run} disabled={loading || !query.trim() || !dbPassword}
              className="btn btn-primary" style={{ flex: 1 }}>
              {loading ? '⏳ Running...' : '▶ Run (Ctrl+Enter)'}
            </button>
            <button onClick={() => { setQuery(''); textareaRef.current?.focus() }}
              className="btn btn-outline" style={{ padding: '8px 12px' }} title="Clear query">
              🗑
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'var(--text2)' }}>⚡ Quick Queries</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '300px', overflowY: 'auto' }}>
            {SHORTCUTS.map(s => (
              <button key={s.label} onClick={() => setQuery(s.query)} style={{
                background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px',
                padding: '6px 10px', color: 'var(--text2)', fontSize: '11px', fontFamily: 'monospace',
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="card" style={{ background: '#0a0a14', minHeight: '220px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {['#ef4444', '#f59e0b', '#10b981'].map(c => (
                <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
              ))}
              <span style={{ fontSize: '12px', color: 'var(--text2)', marginLeft: '6px' }}>Output</span>
            </div>
            {result && (
              <button onClick={() => setResult(null)} style={{
                padding: '2px 8px', background: 'transparent', border: '1px solid var(--border)',
                borderRadius: '4px', color: 'var(--text2)', fontSize: '11px', cursor: 'pointer'
              }}>Clear ✕</button>
            )}
          </div>
          {renderOutput()}
        </div>

        {history.length > 0 && (
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)' }}>🕐 History</h3>
              <button onClick={() => setHistory([])} style={{
                padding: '2px 8px', background: 'transparent', border: '1px solid var(--border)',
                borderRadius: '4px', color: 'var(--text2)', fontSize: '11px', cursor: 'pointer'
              }}>Clear All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '220px', overflowY: 'auto' }}>
              {history.map((h, i) => (
                <div key={i} onClick={() => setQuery(h.query)} style={{
                  background: 'var(--bg3)', borderRadius: '6px', padding: '7px 10px',
                  cursor: 'pointer', border: `1px solid ${h.ok ? '#10b98133' : '#ef444433'}`, transition: 'all 0.15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = h.ok ? '#10b981' : '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = h.ok ? '#10b98133' : '#ef444433'}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: h.ok ? 'var(--accent2)' : '#ef4444', marginBottom: '2px', wordBreak: 'break-all' }}>
                    {h.ok ? '✅' : '❌'} {h.query.length > 55 ? h.query.substring(0, 55) + '...' : h.query}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text2)' }}>{h.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


export default function Console({ user, login }) {
  const [activeTab, setActiveTab]         = useState('mql')
  const [queryTabs, setQueryTabs]         = useState([{ id: 1, label: 'Query 1' }])
  const [activeQueryTab, setActiveQueryTab] = useState(1)
  const [sdkTab, setSdkTab]               = useState(0)
  const [copied, setCopied]               = useState(false)
  const nextId                            = useRef(2)

  // Project switcher state
  const [showSwitcher, setShowSwitcher]   = useState(false)
  const [switchPass, setSwitchPass]       = useState('')
  const [switchLoading, setSwitchLoading] = useState(false)
  const [switchError, setSwitchError]     = useState('')
  const [activeProject, setActiveProject] = useState({
    projectName: user.activeProject || user.dbName,
    anonKey: user.anonKey,
    secretKey: user.secretKey
  })
  const [availableProjects, setAvailableProjects] = useState(user.projects || [user.activeProject || user.dbName])

  const switchProject = async (projectName) => {
    if (!switchPass) { setSwitchError('Password required'); return }
    setSwitchLoading(true); setSwitchError('')
    try {
      const { data } = await axios.post(
        (import.meta.env.VITE_API_URL || 'https://muwandb-server.onrender.com'\) + '/auth/project/switch',
        { username: user.username, password: switchPass, projectName }
      )
      setActiveProject({ projectName: data.projectName, anonKey: data.anonKey, secretKey: data.secretKey })
      login({ ...user, activeProject: data.projectName, anonKey: data.anonKey, secretKey: data.secretKey, dbName: data.dbName })
      setShowSwitcher(false)
      setSwitchPass('')
    } catch (e) {
      setSwitchError(e.response?.data?.error || 'Wrong password')
    }
    setSwitchLoading(false)
  }

  const addQueryTab = () => {
    const id = nextId.current++
    setQueryTabs(t => [...t, { id, label: `Query ${id}` }])
    setActiveQueryTab(id)
  }

  const removeQueryTab = (id) => {
    if (queryTabs.length === 1) return
    const remaining = queryTabs.filter(t => t.id !== id)
    setQueryTabs(remaining)
    if (activeQueryTab === id) setActiveQueryTab(remaining[remaining.length - 1].id)
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container" style={{ padding: '24px 16px' }}>

      {/* Project Switch Modal */}
      {showSwitcher && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>🔁</div>
            <h3 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '4px' }}>Switch Project</h3>
            <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '12px', marginBottom: '16px' }}>
              Enter password to load project keys
            </p>
            <input type="password" placeholder="Account password" value={switchPass}
              onChange={e => { setSwitchPass(e.target.value); setSwitchError('') }}
              style={{ width: '100%', marginBottom: '12px', boxSizing: 'border-box' }} autoFocus />
            {switchError && <div style={{ padding: '8px', background: '#ef444422', borderRadius: '6px', color: 'var(--red)', fontSize: '12px', marginBottom: '10px' }}>{switchError}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              {availableProjects.map(p => (
                <button key={p} onClick={() => switchProject(p)} disabled={switchLoading}
                  style={{
                    padding: '10px 14px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer',
                    background: activeProject.projectName === p ? '#7c3aed22' : 'var(--bg3)',
                    border: `1px solid ${activeProject.projectName === p ? '#7c3aed' : 'var(--border)'}`,
                    color: activeProject.projectName === p ? 'var(--accent2)' : 'var(--text)',
                    fontWeight: activeProject.projectName === p ? 700 : 400,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                  <span>📁 {p}</span>
                  {activeProject.projectName === p && <span style={{ fontSize: '11px' }}>✅ Active</span>}
                </button>
              ))}
            </div>
            <button onClick={() => { setShowSwitcher(false); setSwitchPass('') }} className="btn btn-outline" style={{ width: '100%' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, marginBottom: '2px' }}>💻 Query Console</h1>
          <p style={{ color: 'var(--text2)', fontSize: '13px' }}>MQL & SQL — run any query on your encrypted database</p>
        </div>
        {/* Docs PDF + Project Switcher — same row */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href={DOCS_URL} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#7c3aed22', border: '1px solid #7c3aed55', borderRadius: '8px', color: '#a855f7', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            📄 Docs PDF
          </a>
          <button onClick={() => setShowSwitcher(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#06b6d422', border: '1px solid #06b6d455', borderRadius: '8px', color: '#06b6d4', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            📁 {activeProject.projectName} 🔁
          </button>
        </div>
      </div>

      {/* API key status */}
      <div style={{ padding: '10px 14px', background: activeProject.secretKey ? '#10b98122' : '#ef444422', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', color: activeProject.secretKey ? 'var(--green)' : 'var(--red)', border: '1px solid', borderColor: activeProject.secretKey ? 'var(--green)' : 'var(--red)' }}>
        {activeProject.secretKey
          ? `✅ Project: ${activeProject.projectName} — ready to query!`
          : '❌ Keys missing — please logout and login again'}
      </div>

      {/* Main tab switcher */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--bg2)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)', width: 'fit-content' }}>
        {['mql', 'sdk'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding: '6px 16px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: activeTab === t ? 'var(--accent)' : 'transparent', color: activeTab === t ? '#fff' : 'var(--text2)', transition: 'all 0.2s' }}>
            {t === 'mql' ? '⚡ MQL Console' : '📦 SDK Examples'}
          </button>
        ))}
      </div>

      {activeTab === 'mql' ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', flexWrap: 'wrap' }}>
            {queryTabs.map(tab => (
              <div key={tab.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '6px 6px 0 0', background: activeQueryTab === tab.id ? 'var(--bg2)' : 'transparent', border: `1px solid ${activeQueryTab === tab.id ? 'var(--border)' : 'transparent'}`, borderBottom: 'none', cursor: 'pointer' }}
                onClick={() => setActiveQueryTab(tab.id)}>
                <span style={{ fontSize: '12px', color: activeQueryTab === tab.id ? 'var(--accent2)' : 'var(--text2)', fontFamily: 'monospace' }}>
                  ⚡ {tab.label}
                </span>
                {queryTabs.length > 1 && (
                  <span onClick={e => { e.stopPropagation(); removeQueryTab(tab.id) }}
                    style={{ fontSize: '12px', color: 'var(--text2)', marginLeft: '4px', opacity: 0.6, lineHeight: 1 }}>✕</span>
                )}
              </div>
            ))}
            <button onClick={addQueryTab} style={{
              padding: '4px 10px', background: 'transparent', border: '1px dashed var(--border)',
              borderRadius: '6px', color: 'var(--text2)', fontSize: '13px', cursor: 'pointer'
            }} title="New query tab">+ New Tab</button>
          </div>

          {queryTabs.map(tab => (
            <div key={tab.id} style={{ display: activeQueryTab === tab.id ? 'block' : 'none' }}>
              <QueryTab user={user} activeProject={activeProject} />
            </div>
          ))}
        </div>
      ) : (
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
              }}>{ex.label}</button>
            ))}
          </div>
          <div>
            <div className="card" style={{ background: '#0a0a14', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: 'var(--accent2)', fontSize: '13px', fontWeight: 600 }}>{SDK_EXAMPLES[sdkTab].label}</span>
                <button onClick={() => copyCode(SDK_EXAMPLES[sdkTab].code)}
                  style={{ padding: '4px 10px', background: copied ? '#10b98122' : 'var(--bg3)', border: `1px solid ${copied ? '#10b981' : 'var(--border)'}`, borderRadius: '6px', color: copied ? '#10b981' : 'var(--text2)', fontSize: '12px', cursor: 'pointer' }}>
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre style={{ color: '#a855f7', fontSize: '13px', fontFamily: 'monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {SDK_EXAMPLES[sdkTab].code}
              </pre>
            </div>
            <div className="card" style={{ marginTop: '12px', padding: '14px', background: '#06b6d411', border: '1px solid #06b6d433' }}>
              <p style={{ color: '#06b6d4', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>📄 Full Documentation</p>
              <p style={{ color: 'var(--text2)', fontSize: '12px', marginBottom: '10px' }}>
                Complete reference for all queries, filters, RLS, REST API, WebSocket, and real-world examples.
              </p>
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
