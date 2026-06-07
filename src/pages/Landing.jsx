import React from 'react'
import { Link } from 'react-router-dom'

const DOCS_URL = '/MuwanDB_Guide.pdf'

export default function Landing() {
  const features = [
    { icon: '🔐', title: 'AES-256 Encryption', desc: 'Your data is encrypted at rest. Even we cannot read it.' },
    { icon: '🗝️', title: 'Anon + Secret Keys', desc: 'Two-key system like Supabase. Frontend safe, backend powerful.' },
    { icon: '🛡️', title: 'Row Level Security', desc: 'Users only see their own data. Automatic query filtering.' },
    { icon: '⚡', title: 'Custom Query Engine', desc: 'MQL syntax — CREATE, INSERT, SELECT, UPDATE, DELETE, COUNT.' },
    { icon: '🌐', title: '24/7 REST API', desc: 'Connect any app — React, Node.js, Python, or anything else.' },
    { icon: '🏗️', title: 'Zero Dependencies', desc: 'No MongoDB, no PostgreSQL. Pure custom C++ engine.' },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 16px 60px', background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <h1 style={{ fontSize: 'clamp(28px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
          Your Own{' '}
          <span style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Encrypted Database
          </span>
        </h1>
        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: 'var(--text2)', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          MuwanDB is a privacy-first Database-as-a-Service. AES-256 encrypted, zero-knowledge, with a Supabase-style SDK and custom C++ query engine.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/auth" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 28px' }}>
            Get Started Free →
          </Link>
          <a href={DOCS_URL} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '16px', padding: '12px 28px' }}>
            📄 Read Docs
          </a>
          <a href="https://github.com/muwanindia345-beep/MuwanDB" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '16px', padding: '12px 28px' }}>
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
        <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: '40px' }}>Built from scratch. No compromises.</p>
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

      {/* SDK Code Preview */}
      <div className="container" style={{ padding: '0 16px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 700, marginBottom: '8px' }}>
          Supabase-style SDK
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: '24px', fontSize: '14px' }}>
          Familiar API — drop into any project instantly
        </p>
        <div className="card" style={{ background: '#0d0d14', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {['#ef4444', '#f59e0b', '#10b981'].map(c => (
              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
            ))}
            <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text2)' }}>muwandb-js</span>
          </div>
          <pre style={{ color: '#a855f7', fontSize: 'clamp(11px, 2vw, 13px)', overflowX: 'auto', lineHeight: 1.9 }}>
{`import MuwanDB from 'muwandb-js';

const db = MuwanDB.createClient(
  process.env.MUWANDB_ANON_KEY,
  process.env.MUWANDB_DB_PASSWORD
);

// Select with filters
const { data } = await db
  .from('users')
  .select('id name email')
  .eq('active', 1)
  .gt('age', 18)
  .order('name', 'asc')
  .limit(10)
  .get();

// Insert
await db.from('posts').insert({
  id: Date.now(), title: 'Hello World',
  userId: currentUser.id
});

// Update
await db.from('users')
  .eq('id', currentUser.id)
  .update({ name: 'New Name' });`}
          </pre>
        </div>
      </div>

      {/* Fix 1: Docs CTA — no overlap, proper spacing */}
      <div className="container" style={{ padding: '0 16px 60px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed22, #06b6d422)',
          border: '1px solid #7c3aed44',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ fontSize: '40px', lineHeight: 1 }}>📄</div>
          <h2 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 700, margin: 0 }}>
            Complete Documentation
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '14px', maxWidth: '480px', margin: 0, lineHeight: 1.6 }}>
            A complete reference guide covering setup, SDK usage, MQL query language, Row Level Security, REST API endpoints, error codes, and real-world integration examples.
          </p>
          <a href={DOCS_URL} target="_blank" rel="noreferrer"
            className="btn btn-primary" style={{ fontSize: '15px', padding: '12px 28px', marginTop: '4px' }}>
            📥 Download MuwanDB Guide PDF
          </a>
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
