import React from 'react'
import { NavLink } from 'react-router-dom'

export default function AdminSidebar(){
  return (
    <aside className="admin-sidebar">
      <div style={{padding:'6px 10px', marginBottom:12}}>
        <div style={{fontWeight:800, fontSize:18, color:'var(--text-primary)', display:'flex', alignItems:'center', gap:8}}>
          <span style={{color:'var(--accent)'}}>⚡</span> ZESTORA ADMIN
        </div>
        <div className="muted" style={{fontSize:11, marginTop:2}}>Restaurant Manager</div>
      </div>

      <nav style={{display:'flex', flexDirection:'column', gap:4}}>
        <NavLink to="/admin/orders" className={({isActive}) => isActive ? 'active' : ''}>
          📦 Orders Queue
        </NavLink>
        <NavLink to="/admin/menu" className={({isActive}) => isActive ? 'active' : ''}>
          🍔 Menu & Pricing
        </NavLink>
        <NavLink to="/admin/categories" className={({isActive}) => isActive ? 'active' : ''}>
          📁 Categories
        </NavLink>
        <NavLink to="/admin/tables" className={({isActive}) => isActive ? 'active' : ''}>
          🪑 Tables & Seating
        </NavLink>
        <NavLink to="/admin/reports" className={({isActive}) => isActive ? 'active' : ''}>
          📊 Analytics & Reports
        </NavLink>
      </nav>

      <div style={{marginTop:'auto', paddingTop:16, borderTop:'1px solid var(--border)', paddingLeft:10}}>
        <div className="muted" style={{fontSize:12, fontWeight:600}}>System Status</div>
        <div style={{display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#4ade80', marginTop:4, fontWeight:700}}>
          <span style={{width:8, height:8, borderRadius:'50%', background:'#22c55e'}} /> Kitchen Online
        </div>
      </div>
    </aside>
  )
}

