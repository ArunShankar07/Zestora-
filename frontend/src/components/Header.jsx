import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Header(){
  const { cart, table } = useApp()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('zestora_theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('zestora_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <div className="brand-icon">Z</div>
        <div>
          <div>ZESTORA</div>
          <div className="brand-subtitle">Dine & Order</div>
        </div>
      </Link>

      <div style={{display:'flex', alignItems:'center', gap:16}}>
        {!isAdmin && table && (
          <div className="badge" style={{background:'var(--accent-glow)', color:'var(--accent)', borderColor:'var(--accent)', padding:'6px 12px', fontWeight:700}}>
            📍 Table {table}
          </div>
        )}

        <nav className="navlinks">
          {!isAdmin ? (
            <>
              <Link to="/" className={location.pathname==='/'?'active':''}>Home</Link>
              <Link to="/menu" className={location.pathname==='/menu'?'active':''}>Menu</Link>
              <Link to="/cart" className={location.pathname==='/cart'?'active':''}>
                Cart 
                {cart.length > 0 && (
                  <span className="badge" style={{background:'var(--accent)', color:'#fff', padding:'2px 8px', fontWeight:700}}>
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                  </span>
                )}
              </Link>
              <Link to="/admin" className={location.pathname.startsWith('/admin')?'active':''}>Admin</Link>
            </>
          ) : (
            <>
              <Link to="/admin/orders" className={location.pathname==='/admin/orders'?'active':''}>Orders</Link>
              <Link to="/admin/menu" className={location.pathname==='/admin/menu'?'active':''}>Menu</Link>
              <Link to="/admin/reports" className={location.pathname==='/admin/reports'?'active':''}>Reports</Link>
              <Link to="/" style={{color:'var(--text-muted)'}}>Customer Site ↗</Link>
            </>
          )}
        </nav>

        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

