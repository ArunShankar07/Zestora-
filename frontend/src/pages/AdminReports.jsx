import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminReports(){
  const [sales, setSales] = useState(null)
  const [popular, setPopular] = useState([])

  useEffect(()=>{ load() },[])
  async function load(){
    try {
      const s = await api.get('/reports/sales')
      const p = await api.get('/reports/popular-items')
      setSales(s.data)
      setPopular(p.data.slice(0,8))
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <h2 style={{fontSize:24, fontWeight:800}}>Reports & Analytics</h2>
        <p className="muted" style={{fontSize:13, marginTop:4}}>Overview of sales performance, revenue metrics, and best-selling items</p>
      </div>

      {/* Sales Stats Grid */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16}}>
        <div className="card" style={{display:'flex', flexDirection:'column', gap:8}}>
          <div className="muted" style={{fontSize:13}}>📦 Total Orders Placed</div>
          <div style={{fontWeight:800, fontSize:28, color:'var(--text-primary)'}}>
            {sales ? sales.totalOrders : '—'}
          </div>
        </div>

        <div className="card" style={{display:'flex', flexDirection:'column', gap:8}}>
          <div className="muted" style={{fontSize:13}}>💰 Total Gross Revenue</div>
          <div style={{fontWeight:800, fontSize:28, color:'var(--accent)'}}>
            ₹{sales ? (sales.totalRevenue || 0).toLocaleString() : '—'}
          </div>
        </div>
      </div>

      {/* Popular Items Table Card */}
      <div className="card" style={{padding:20}}>
        <h3 style={{fontSize:18, fontWeight:700, marginBottom:16}}>🔥 Top Selling Dishes</h3>

        {popular.length === 0 ? (
          <div className="muted" style={{textAlign:'center', padding:16}}>No sales data available yet</div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {popular.map((it, idx) => (
              <div 
                key={it.name || idx} 
                style={{
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center',
                  padding:'10px 14px',
                  borderRadius:10,
                  background:'var(--bg-surface)',
                  border:'1px solid var(--border)'
                }}
              >
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  <span style={{fontWeight:800, color:'var(--accent)', width:20}}>#{idx + 1}</span>
                  <span style={{fontWeight:700, fontSize:15}}>{it.name}</span>
                </div>
                <div className="badge" style={{background:'var(--accent-glow)', color:'var(--accent)', fontWeight:700}}>
                  {it.qty} sold
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

