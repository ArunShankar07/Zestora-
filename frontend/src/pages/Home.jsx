import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Home(){
  const { tables, table, setTable } = useApp();
  const nav = useNavigate();

  const handleTableSelect = (tableNumber) => {
    setTable(tableNumber);
  }

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:24}}>
      {/* Hero Section */}
      <div className="hero">
        <div style={{flex:1, zIndex:2}}>
          <span className="badge" style={{background:'var(--accent-glow)', color:'var(--accent)', borderColor:'var(--accent)', marginBottom:12}}>
            🔥 Premium Dining & Quick Order
          </span>
          <h2>Taste the Extraordinary</h2>
          <p>
            Experience exquisite culinary crafts delivered right to your table. Select your table below or start browsing our gourmet menu.
          </p>
          <div className="cta">
            <Link className="btn-accent" to="/menu">
              🍔 Explore Full Menu
            </Link>
            <a className="btn-outline" href="#tables">
              📍 Select Table
            </a>
          </div>
        </div>

        <div style={{width: 320, height: 220, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0}} className="hero-img-box">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" 
            alt="Zestora Restaurant" 
            style={{width:'100%', height:'100%', objectFit:'cover'}}
          />
        </div>
      </div>

      {/* Table Selector Section */}
      <div className="card" id="tables">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:12}}>
          <div>
            <h3 style={{fontSize:20, fontWeight:800}}>Select Your Table</h3>
            <p className="muted" style={{fontSize:13}}>Pick your table number to associate your orders</p>
          </div>
          {table && (
            <div className="badge" style={{background:'var(--accent-glow)', color:'var(--accent)', borderColor:'var(--accent)', padding:'6px 14px', fontSize:13}}>
              Selected: Table #{table} ✓
            </div>
          )}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:14}}>
          {tables.length === 0 ? (
            Array.from({length: 8}).map((_, i) => (
              <div key={i} className="card" style={{opacity:0.5, padding:14}}>
                <div style={{fontWeight:700}}>Table #{String(i+1).padStart(2,'0')}</div>
                <div className="muted" style={{fontSize:12, marginTop:4}}>Loading...</div>
              </div>
            ))
          ) : (
            tables.map(t => {
              const isSelected = table === t.tableNumber;
              const isAvailable = t.status === 'Available';
              return (
                <button
                  key={t._id}
                  onClick={() => handleTableSelect(t.tableNumber)}
                  style={{
                    background: isSelected ? 'var(--accent-glow)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 14,
                    padding: 16,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 16px var(--accent-glow)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                  className="table-card"
                >
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:15, fontWeight:800, color: isSelected ? 'var(--accent)' : 'var(--text-primary)'}}>
                      TABLE {t.tableNumber}
                    </span>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: isAvailable ? 'var(--veg-color)' : 'var(--nonveg-color)'
                    }} />
                  </div>
                  <div className="muted" style={{fontSize:12}}>🪑 {t.capacity} Seats</div>
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    color: isAvailable ? 'var(--text-secondary)' : 'var(--nonveg-color)'
                  }}>
                    {t.status}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {table && (
          <div style={{marginTop: 20, textAlign: 'right'}}>
            <button className="btn-accent" onClick={() => nav('/menu')}>
              Proceed to Menu with Table #{table} →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

