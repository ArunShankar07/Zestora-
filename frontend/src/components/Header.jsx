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
        <div className="brand-icon" style={{display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
          <svg viewBox="0 0 60 60" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            {/* Outer circle - decorative ring */}
            <circle cx="30" cy="30" r="28" fill="none" stroke="#000" strokeWidth="1.5"/>
            
            {/* Plate */}
            <circle cx="30" cy="30" r="18" fill="none" stroke="#000" strokeWidth="2"/>
            <circle cx="30" cy="30" r="15" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.5"/>
            
            {/* Fork - left side */}
            <g stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round">
              {/* Handle */}
              <line x1="18" y1="15" x2="18" y2="38"/>
              {/* Fork prongs */}
              <g>
                <line x1="16" y1="38" x2="16" y2="45"/>
                <line x1="18" y1="38" x2="18" y2="45"/>
                <line x1="20" y1="38" x2="20" y2="45"/>
              </g>
              {/* Fork base connector */}
              <line x1="16" y1="38" x2="20" y2="38"/>
            </g>
            
            {/* Spoon - right side */}
            <g stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round">
              {/* Handle */}
              <line x1="42" y1="15" x2="42" y2="35"/>
              {/* Spoon bowl */}
              <ellipse cx="42" cy="42" rx="4" ry="5"/>
            </g>
            
            {/* Decorative center dot */}
            <circle cx="30" cy="30" r="1.5" fill="#000"/>
          </svg>
        </div>
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

