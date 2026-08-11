import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminCategories(){
  const [cats, setCats] = useState([])
  const [name, setName] = useState('')
  const token = localStorage.getItem('admin_token')

  useEffect(()=>{ load() },[])
  async function load(){ 
    try {
      const res = await api.get('/categories'); 
      setCats(res.data) 
    } catch(e) {
      console.error(e)
    }
  }

  async function add(){ 
    if(!name) return; 
    try {
      await api.post('/categories', { name }, { headers:{ Authorization:`Bearer ${token}` } }); 
      setName(''); 
      load() 
    } catch(e) {
      console.error(e)
    }
  }

  async function remove(id){ 
    if(!confirm('Delete category?')) return; 
    try {
      await api.delete(`/categories/${id}`, { headers:{ Authorization:`Bearer ${token}` } }); 
      load() 
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <h2 style={{fontSize:24, fontWeight:800}}>Menu Categories</h2>
        <p className="muted" style={{fontSize:13, marginTop:4}}>Manage food category tags for navigation and filtering</p>
      </div>

      <div className="card">
        <h3 style={{fontSize:16, fontWeight:700, marginBottom:12}}>➕ Add Category</h3>
        <div style={{display:'flex', gap:10}}>
          <input className="form-control" placeholder="Category name (e.g. Desserts)" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn-accent" onClick={add} style={{whiteSpace:'nowrap'}}>Create Category</button>
        </div>
      </div>

      <div className="card" style={{padding:0, overflow:'hidden'}}>
        {cats.length === 0 ? (
          <div style={{padding:24, textAlign:'center'}} className="muted">No categories created yet</div>
        ) : (
          cats.map((c, i) => (
            <div key={c._id} style={{
              display:'flex',
              justifyContent:'space-between',
              alignItems:'center',
              padding:'14px 18px',
              borderBottom: i < cats.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{fontWeight:700, fontSize:15}}>📁 {c.name}</div>
              <button 
                className="btn-outline" 
                style={{padding:'6px 12px', fontSize:12, color:'var(--nonveg-color)', borderColor:'rgba(239,68,68,0.3)'}}
                onClick={()=> remove(c._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

