import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const features = [
    { icon: '🔐', title: 'AES-256 Encryption', desc: 'Your data is encrypted at rest. Even we cannot see it.' },
    { icon: '🗝️', title: 'Anon + Secret Keys', desc: 'Two-key system like Supabase. Frontend safe, backend powerful.' },
    { icon: '🛡️', title: 'Row Level Security', desc: 'Users only see their own data. Automatic query filtering.' },
    { icon: '⚡', title: 'Custom Query Language', desc: 'Simple MQL syntax. CREATE, INSERT, SELECT, DELETE.' },
    { icon: '🌐', title: '24/7 REST API', desc: 'Connect any app — React, Node.js, Python, anything.' },
    { icon: '🏗️', title: 'Zero Dependencies', desc: 'No MongoDB, no PostgreSQL. Pure custom C++ engine.' },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        textAlign: 'center', padding: '80px 16px 60px',
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <h1 style={{ fontSize: 'clamp(28px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
          Your Own{' '}
          <span style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Encrypted Database
          </span>
        </h1>
        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: 'var(--text2)', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          MuwanDB is a privacy-first Database-as-a-Service. AES-256 encrypted, zero-knowledge, with a custom query language.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/auth" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 28px' }}>
            Get Started Free →
          </Link>
          <a href="https://github.com/muwanindia345-beep/MuwanDB" target="_blank" className="btn btn-outline" style={{ fontSize: '16px', padding: '12px 28px' }}>
            GitHub ⭐
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap' }}>
          {[['AES-256', 'Encryption'], ['0', 'Third Parties'], ['∞', 'Queries'], ['24/7', 'Uptime']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent2)' }}>{val}</div>
              <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container" style={{ padding: '60px 16px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 700, marginBottom: '8px' }}>
          Everything you need
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: '40px' }}>
          Built from scratch. No compromises.
        </p>
        <div className="grid-3">
          {features.map(f => (
            <div key={f.title} className="card" style={{ transition: 'transform 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Code preview */}
      <div className="container" style={{ padding: '0 16px 60px' }}>
        <div className="card" style={{ background: '#0d0d14', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {['#ef4444', '#f59e0b', '#10b981'].map(c => (
              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <pre style={{ color: '#a855f7', fontSize: 'clamp(11px, 2vw, 14px)', overflowX: 'auto', lineHeight: 1.8 }}>
{`// Connect MuwanDB to any app
const res = await fetch(import.meta.env.VITE_API_URL + '/query', {
  method: 'POST',
  headers: {
    'x-api-key': 'mwn_anon_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'SELECT * FROM users WHERE age > 18',
    dbPassword: 'your_db_password',
    userId: currentUser.id  // RLS auto-applied!
  })
})`}
          </pre>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '60px 16px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 700, marginBottom: '12px' }}>
          Ready to build with MuwanDB?
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>Free forever. No credit card required.</p>
        <Link to="/auth" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>
          Create Free Account →
        </Link>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid var(--border)', color: 'var(--text2)', fontSize: '13px' }}>
        Built with ❤️ by MuwanOrganisation • Privacy-first Database
      </div>
    </div>
  )
}
