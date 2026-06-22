import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://muwandb-server.onrender.com'
const WS_URL = (import.meta.env.VITE_API_URL || 'https://muwandb-server.onrender.com').replace('https', 'wss').replace('http', 'ws')

const Icons = {
  key: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  copy: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  refresh: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  console: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  settings: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  db: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  eye: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  folder: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
}

export default function Dashboard({ user, login }) {
  const [copied, setCopied] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [refreshMsg, setRefreshMsg] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalPass, setModalPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [modalError, setModalError] = useState('')
  const [syncPopup, setSyncPopup] = useState(null)

  // Project create state
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectForm, setProjectForm] = useState({ projectName: '', password: '' })
  const [projectLoading, setProjectLoading] = useState(false)
  const [projectError, setProjectError] = useState('')
  const [newProjectKeys, setNewProjectKeys] = useState(null)
  const [projects, setProjects] = useState(user.projects || [user.activeProject || user.dbName])
  const [keyCopied, setKeyCopied] = useState('')
  const [showKeysModal, setShowKeysModal] = useState(false)
  const [showKeysProject, setShowKeysProject] = useState(null)
  const [showKeysData, setShowKeysData] = useState(null)
  const [showKeysPass, setShowKeysPass] = useState('')
  const [showKeysError, setShowKeysError] = useState('')
  const [showKeysLoading, setShowKeysLoading] = useState(false)

  const wsRef = useRef(null)

  useEffect(() => {
    if (!user?.username) return
    const ws = new WebSocket(WS_URL + '/ws?apiKey=' + user.anonKey)
    wsRef.current = ws
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'KEYS_REFRESHED' && data.username === user.username && data.source === 'app') {
          setSyncPopup({ anonKey: data.anonKey, secretKey: data.secretKey, source: 'App' })
        }
      } catch {}
    }
    ws.onerror = () => {}
    ws.onclose = () => {}
    return () => ws.close()
  }, [user?.username])

  const acceptSync = () => {
    if (syncPopup) {
      login({ ...user, anonKey: syncPopup.anonKey, secretKey: syncPopup.secretKey })
      setRefreshMsg('Keys synced from App!')
      setSyncPopup(null)
      setTimeout(() => setRefreshMsg(''), 3000)
    }
  }

  const copy = (val, label) => {
    if (!val) return
    navigator.clipboard.writeText(val)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const copyKey = (val, label) => {
    navigator.clipboard.writeText(val)
    setKeyCopied(label)
    setTimeout(() => setKeyCopied(''), 2000)
  }

  const openRefreshModal = () => {
    setModalPass(''); setModalError(''); setShowPass(false); setShowModal(true)
  }

  const confirmRefresh = async () => {
    if (!modalPass) { setModalError('Password required'); return }
    setRefreshing(true); setModalError('')
    try {
      const { data } = await axios.post(API + '/auth/refresh-keys', {
        username: user.username,
        password: modalPass,
        projectName: user.activeProject || user.dbName
      }, { headers: { 'x-source': 'web' } })
      login({ ...user, anonKey: data.anonKey, secretKey: data.secretKey })
      setShowModal(false)
      setRefreshMsg('Keys refreshed!')
    } catch (e) {
      setModalError(e.response?.data?.error || 'Wrong password')
    }
    setRefreshing(false)
    setTimeout(() => setRefreshMsg(''), 3000)
  }

  const openProjectModal = () => {
    setProjectForm({ projectName: '', password: '' })
    setProjectError('')
    setNewProjectKeys(null)
    setShowProjectModal(true)
  }

  const openShowKeys = (projectName) => {
    setShowKeysProject(projectName)
    setShowKeysData(null)
    setShowKeysPass('')
    setShowKeysError('')
    setShowKeysModal(true)
  }

  const fetchProjectKeys = async () => {
    if (!showKeysPass) { setShowKeysError('Password required'); return }
    setShowKeysLoading(true); setShowKeysError('')
    try {
      const { data } = await axios.post(API + '/auth/project/switch', {
        username: user.username,
        password: showKeysPass,
        projectName: showKeysProject
      })
      setShowKeysData({ anonKey: data.anonKey, secretKey: data.secretKey })
    } catch (e) {
      setShowKeysError(e.response?.data?.error || 'Wrong password')
    }
    setShowKeysLoading(false)
  }

  const createProject = async () => {
    if (!projectForm.projectName || !projectForm.password)
      return setProjectError('Project name and password required')
    setProjectLoading(true); setProjectError('')
    try {
      const { data } = await axios.post(API + '/auth/project/create', {
        username: user.username,
        password: projectForm.password,
        projectName: projectForm.projectName
      })
      setNewProjectKeys({ anonKey: data.anonKey, secretKey: data.secretKey, projectName: data.projectName })
      setProjects(prev => [...prev, data.projectName])
    } catch (e) {
      setProjectError(e.response?.data?.error || 'Something went wrong')
    }
    setProjectLoading(false)
  }

  const cards = [
    { icon: Icons.console, title: 'Query Console', desc: 'Run MQL queries on your database', to: '/console', color: '#7c3aed' },
    { icon: Icons.settings, title: 'Settings', desc: 'Manage RLS rules and account', to: '/settings', color: '#10b981' },
  ]

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
{/* Sync Popup */}
      {syncPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>📱</div>
            <h3 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '4px' }}>Keys Refreshed via App!</h3>
            <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '13px', marginBottom: '20px' }}>
              MuwanDB App ne keys refresh ki hain. Web pe bhi sync karein?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSyncPopup(null)} className="btn btn-outline" style={{ flex: 1 }}>Ignore</button>
              <button onClick={acceptSync} className="btn btn-primary" style={{ flex: 1 }}>Sync Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Keys Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>🔑</div>
            <h3 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '4px' }}>Refresh API Keys</h3>
            <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '13px', marginBottom: '20px' }}>
              Enter your password to generate new keys
            </p>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <input type={showPass ? 'text' : 'password'} placeholder="Your password" value={modalPass}
                onChange={e => { setModalPass(e.target.value); setModalError('') }}
                onKeyDown={e => e.key === 'Enter' && confirmRefresh()}
                style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }} autoFocus />
              <button onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)' }}>
                {showPass ? Icons.eyeOff : Icons.eye}
              </button>
            </div>
            {modalError && <div style={{ padding: '8px 12px', background: '#ef444422', borderRadius: '8px', color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{modalError}</div>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={confirmRefresh} disabled={refreshing} className="btn btn-primary" style={{ flex: 1 }}>
                {refreshing ? 'Refreshing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Show Keys Modal */}
      {showKeysModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
            {!showKeysData ? (
              <>
                <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>🔑</div>
                <h3 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '4px' }}>Show API Keys</h3>
                <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '13px', marginBottom: '16px' }}>
                  Project: <strong>{showKeysProject}</strong>
                </p>
                <input type="password" placeholder="Account password" value={showKeysPass}
                  onChange={e => { setShowKeysPass(e.target.value); setShowKeysError('') }}
                  onKeyDown={e => e.key === 'Enter' && fetchProjectKeys()}
                  style={{ width: '100%', marginBottom: '12px', boxSizing: 'border-box' }} autoFocus />
                {showKeysError && <div style={{ padding: '8px', background: '#ef444422', borderRadius: '6px', color: 'var(--red)', fontSize: '12px', marginBottom: '10px' }}>{showKeysError}</div>}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setShowKeysModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                  <button onClick={fetchProjectKeys} disabled={showKeysLoading} className="btn btn-primary" style={{ flex: 1 }}>
                    {showKeysLoading ? 'Loading...' : '👁 Show Keys'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>🔓</div>
                <h3 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '16px' }}>{showKeysProject} Keys</h3>
                {[['🔓 Anon Key', showKeysData.anonKey, 'ak', 'yellow', 'Frontend Safe'],
                  ['🔒 Secret Key', showKeysData.secretKey, 'sk', 'purple', 'Backend Only']].map(([label, val, id, color, tag]) => (
                  <div key={id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{label}</span>
                      <span className={`tag tag-${color}`}>{tag}</span>
                    </div>
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', fontSize: '11px', wordBreak: 'break-all', fontFamily: 'monospace', color: 'var(--accent2)', marginBottom: '6px' }}>
                      {val}
                    </div>
                    <button onClick={() => copyKey(val, id)} className="btn btn-outline" style={{ width: '100%', fontSize: '12px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      {keyCopied === id ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                ))}
                <button onClick={() => setShowKeysModal(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }}>
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showProjectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
            {!newProjectKeys ? (
              <>
                <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>📁</div>
                <h3 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '4px' }}>New Project</h3>
                <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '13px', marginBottom: '20px' }}>
                  Har project ki apni isolated database aur API keys hongi
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                  <input placeholder="Project name (e.g. luciagram, myapp)"
                    value={projectForm.projectName}
                    onChange={e => setProjectForm({ ...projectForm, projectName: e.target.value })} />
                  <input type="password" placeholder="Your account password"
                    value={projectForm.password}
                    onChange={e => setProjectForm({ ...projectForm, password: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && createProject()} />
                </div>
                {projectError && <div style={{ padding: '8px 12px', background: '#ef444422', borderRadius: '8px', color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{projectError}</div>}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setShowProjectModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                  <button onClick={createProject} disabled={projectLoading} className="btn btn-primary" style={{ flex: 1 }}>
                    {projectLoading ? 'Creating...' : '✅ Confirm'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>🎉</div>
                <h3 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '4px' }}>Project Created!</h3>
                <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '13px', marginBottom: '4px' }}>
                  <strong>{newProjectKeys.projectName}</strong>
                </p>
                <p style={{ textAlign: 'center', color: 'var(--red)', fontSize: '12px', marginBottom: '16px', fontWeight: 600 }}>
                  ⚠️ Save these keys now! Won't be shown again.
                </p>
                {[['🔓 Anon Key', newProjectKeys.anonKey, 'anon', 'yellow', 'Frontend Safe'],
                  ['🔒 Secret Key', newProjectKeys.secretKey, 'secret', 'purple', 'Backend Only']].map(([label, val, id, color, tag]) => (
                  <div key={id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{label}</span>
                      <span className={`tag tag-${color}`}>{tag}</span>
                    </div>
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', fontSize: '11px', wordBreak: 'break-all', fontFamily: 'monospace', color: 'var(--accent2)', marginBottom: '6px' }}>
                      {val}
                    </div>
                    <button onClick={() => copyKey(val, id)} className="btn btn-outline" style={{ width: '100%', fontSize: '12px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      {keyCopied === id ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                ))}
                <button onClick={() => setShowProjectModal(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }}>
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800 }}>Welcome, {user.username} 👋</h1>
        <p style={{ color: 'var(--text2)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {Icons.db} Project: <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>{user.activeProject || user.dbName}</span>
        </p>
      </div>

      {/* Online badge */}
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
          <button onClick={openRefreshModal} className="btn btn-outline"
            style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {Icons.refresh} Refresh Keys
          </button>
        </div>

        {refreshMsg && (
          <div style={{ marginBottom: '12px', padding: '8px 12px', background: '#10b98122', borderRadius: '8px', fontSize: '13px', color: 'var(--green)' }}>
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
                    style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', opacity: val ? 1 : 0.5 }}>
                    {copied === label ? Icons.check : Icons.copy}
                    {copied === label ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: val ? 'var(--accent2)' : 'var(--text2)', wordBreak: 'break-all', marginBottom: '4px' }}>
                {val ? val.substring(0, 40) + '...' : 'Session expired — click Refresh Keys'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav Cards */}
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

      {/* ── Projects Section ── */}
      <div className="card" style={{ marginBottom: '24px', border: '1px solid #7c3aed55' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {Icons.folder} Projects
          </h2>
          <button onClick={openProjectModal} className="btn btn-primary"
            style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {Icons.plus} New Project
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {projects.map(p => (
            <div key={p} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--bg3)', borderRadius: '8px', padding: '10px 14px',
              border: `1px solid ${(user.activeProject || user.dbName) === p ? '#7c3aed' : 'var(--border)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px' }}>📁</span>
                <span style={{ fontWeight: 600, fontSize: '14px', color: (user.activeProject || user.dbName) === p ? 'var(--accent2)' : 'var(--text)' }}>{p}</span>
                {(user.activeProject || user.dbName) === p && <span className="tag tag-green" style={{ fontSize: '10px' }}>Active</span>}
              </div>
              <button onClick={() => openShowKeys(p)} className="btn btn-outline" style={{ fontSize: '11px', padding: '4px 8px' }}>
                🔑 Keys
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
