import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin(){
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (isRegister && !form.name) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    try {
      const res = await api.post(endpoint, form);
      localStorage.setItem('admin_token', res.data.token);
      nav('/admin/orders');
    } catch(err) {
      console.error(err);
      const msg = err.response?.data?.message || (isRegister ? 'Account creation failed' : 'Invalid email or password');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleAutoFillDefault() {
    setForm({ name: 'Zestora Admin', email: 'admin@zestora.local', password: 'admin123' });
    setIsRegister(false);
    setError('');
  }

  return (
    <div className="animate-fade-in" style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div className="card" style={{
        width: 'min(440px, 100%)',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        border: '1px solid var(--border-hover)'
      }}>
        {/* Header Branding */}
        <div style={{textAlign: 'center'}}>
          <div style={{
            width: 48, height: 48,
            borderRadius: 14,
            background: 'var(--accent-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 10
          }}>
            ⚡
          </div>
          <h2 style={{fontSize: 24, fontWeight: 800, color: 'var(--text-primary)'}}>
            {isRegister ? 'Create Admin Account' : 'Admin Portal Login'}
          </h2>
          <p className="muted" style={{fontSize: 13, marginTop: 4}}>
            {isRegister ? 'Set up your credentials to manage Zestora restaurant' : 'Access orders, menu items, analytics and table settings'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          padding: 4,
          borderRadius: 10,
          border: '1px solid var(--border)'
        }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              background: !isRegister ? 'var(--accent-glow)' : 'transparent',
              color: !isRegister ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🔑 Login
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              background: isRegister ? 'var(--accent-glow)' : 'transparent',
              color: isRegister ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ✨ Register New
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          {isRegister && (
            <div>
              <label className="muted" style={{fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6}}>Full Name</label>
              <input
                className="form-control"
                placeholder="E.g., Arun Shankar"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </div>
          )}

          <div>
            <label className="muted" style={{fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6}}>Admin Email Address</label>
            <input
              className="form-control"
              type="email"
              placeholder="admin@zestora.local or your email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="muted" style={{fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6}}>Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-accent"
            style={{padding: 12, marginTop: 6, fontSize: 15, fontWeight: 800}}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegister ? 'CREATE ADMIN ACCOUNT' : 'LOGIN TO ADMIN')}
          </button>
        </form>

        {/* Default Account Hint */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 14,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div className="muted" style={{fontSize: 12}}>
            💡 Want to use default admin account?
          </div>
          <button
            type="button"
            className="btn-outline"
            style={{padding: '6px 12px', fontSize: 12, margin: '0 auto'}}
            onClick={handleAutoFillDefault}
          >
            Auto-fill Default Admin (admin@zestora.local)
          </button>
        </div>
      </div>
    </div>
  )
}

