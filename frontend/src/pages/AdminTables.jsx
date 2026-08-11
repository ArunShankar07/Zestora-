import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminTables(){
  const [tables, setTables] = useState([])
  const [form, setForm] = useState({ tableNumber:'', capacity:4 })
  const token = localStorage.getItem('admin_token')

  useEffect(()=> load(), [])
  async function load(){ 
    try {
      const res = await api.get('/tables'); 
      setTables(res.data) 
    } catch(e) {
      console.error(e)
    }
  }

  async function add(){ 
    if(!form.tableNumber) return alert('Table number is required'); 
    try {
      await api.post('/tables', form, { headers:{ Authorization:`Bearer ${token}` } }); 
      setForm({ tableNumber:'', capacity:4 }); 
      load() 
    } catch(e) {
      console.error(e)
    }
  }

  async function update(id, upd){ 
    try {
      await api.put(`/tables/${id}`, upd, { headers:{ Authorization:`Bearer ${token}` } }); 
      load() 
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <h2 style={{fontSize:24, fontWeight:800}}>Tables & Seating Layout</h2>
        <p className="muted" style={{fontSize:13, marginTop:4}}>Manage restaurant table numbers, seat capacity, and availability status</p>
      </div>

      <div className="card">
        <h3 style={{fontSize:16, fontWeight:700, marginBottom:12}}>➕ Add Table</h3>
        <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
          <input className="form-control" style={{flex:1, minWidth:140}} placeholder="Table Number (e.g. 11)" value={form.tableNumber} onChange={e=>setForm({...form, tableNumber:e.target.value})} />
          <input className="form-control" style={{width:140}} type="number" placeholder="Seats (e.g. 4)" value={form.capacity} onChange={e=>setForm({...form, capacity:parseInt(e.target.value||4)})} />
          <button className="btn-accent" onClick={add}>Create Table</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:14}}>
        {tables.map(t => {
          const isAvailable = t.status === 'Available';
          return (
            <div key={t._id} className="card" style={{display:'flex', flexDirection:'column', gap:12, padding:18}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontWeight:800, fontSize:18, color:'var(--text-primary)'}}>TABLE {t.tableNumber}</span>
                <span className="badge" style={{
                  background: isAvailable ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: isAvailable ? '#4ade80' : '#f87171',
                  borderColor: isAvailable ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                }}>
                  {t.status}
                </span>
              </div>

              <div className="muted" style={{fontSize:13}}>🪑 Capacity: <strong>{t.capacity} seats</strong></div>

              <div style={{display:'flex', gap:8, marginTop:4}}>
                <button 
                  className="btn-outline" 
                  style={{flex:1, padding:'6px', fontSize:12}}
                  onClick={() => update(t._id, { status: t.status === 'Available' ? 'Reserved' : 'Available' })}
                >
                  Toggle Status
                </button>
                <button 
                  className="btn-outline" 
                  style={{padding:'6px 10px', fontSize:12}}
                  onClick={() => update(t._id, { capacity: (t.capacity % 8) + 2 })}
                  title="Cycle seating capacity"
                >
                  Seats +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

