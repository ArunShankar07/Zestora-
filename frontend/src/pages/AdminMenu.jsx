import React, { useEffect, useState } from 'react'
import api from '../services/api'
import imageFor from '../assets/images'

export default function AdminMenu(){
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name:'', price:'', category:'', description:'', image:'', veg:false })

  useEffect(()=>{ load() },[])
  async function load(){
    setLoading(true)
    try {
      const res = await api.get('/foods')
      setFoods(res.data)
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const token = localStorage.getItem('admin_token')

  async function handleAdd(){
    if (!form.name || !form.price) return alert('Name and Price are required');
    try{
      await api.post('/foods', { ...form, price: parseFloat(form.price) }, { headers:{ Authorization: `Bearer ${token}` } })
      setForm({ name:'', price:'', category:'', description:'', image:'', veg:false })
      load()
      alert('Food item added successfully!')
    }catch(e){ 
      console.error(e); 
      alert('Add failed - Make sure you are logged in as admin') 
    }
  }

  async function handleDelete(id){
    if(!confirm('Delete item permanently?')) return
    try {
      await api.delete(`/foods/${id}`, { headers:{ Authorization: `Bearer ${token}` } })
      load()
    } catch(e) {
      console.error(e)
    }
  }

  async function toggleAvailability(f){
    try {
      await api.put(`/foods/${f._id}`, { available: !f.available }, { headers:{ Authorization: `Bearer ${token}` } })
      load()
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <h2 style={{fontSize:24, fontWeight:800}}>Menu & Food Items</h2>
        <p className="muted" style={{fontSize:13, marginTop:4}}>Manage dishes, pricing, real photos, and availability status</p>
      </div>

      {/* Add Item Form Card */}
      <div className="card">
        <h3 style={{fontSize:16, fontWeight:700, marginBottom:14}}>➕ Quick Add New Dish</h3>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12}}>
          <input className="form-control" placeholder="Dish Name *" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="form-control" placeholder="Category (e.g. Burgers)" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
          <input className="form-control" placeholder="Price (₹) *" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
          <input className="form-control" placeholder="Image URL (Optional)" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} />
        </div>
        <div style={{marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12}}>
          <input className="form-control" style={{flex:1, minWidth:200}} placeholder="Description..." value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer', userSelect:'none'}} className="muted">
            <input type="checkbox" checked={form.veg} onChange={e=>setForm({...form, veg:e.target.checked})}/> 🌱 Veg Item
          </label>
          <button className="btn-accent" onClick={handleAdd}>Save Dish</button>
        </div>
      </div>

      {/* Food Items List */}
      <div className="card" style={{padding:0, overflow:'hidden'}}>
        {loading ? (
          <div style={{padding:24, textAlign:'center'}} className="muted">Loading dishes...</div>
        ) : (
          <div style={{display:'flex', flexDirection:'column'}}>
            {foods.map((f, i) => {
              const imgUrl = imageFor(f.name, f.image);
              return (
                <div 
                  key={f._id} 
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:16,
                    padding:16,
                    borderBottom: i < foods.length - 1 ? '1px solid var(--border)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    flexWrap:'wrap'
                  }}
                >
                  <img src={imgUrl} alt={f.name} style={{width:84, height:60, objectFit:'cover', borderRadius:10, flexShrink:0}}/>
                  
                  <div style={{flex:1, minWidth:200}}>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <span style={{fontWeight:800, fontSize:15, color:'var(--text-primary)'}}>{f.name}</span>
                      <span className={`badge ${f.veg ? 'badge-veg' : 'badge-nonveg'}`} style={{fontSize:11}}>
                        {f.veg ? 'VEG' : 'NON-VEG'}
                      </span>
                      {f.category && <span className="badge" style={{fontSize:11}}>{f.category}</span>}
                    </div>
                    <div className="muted" style={{fontSize:12, marginTop:4}}>{f.description || 'No description provided'}</div>
                  </div>

                  <div style={{textAlign:'right', minWidth:100}}>
                    <div style={{fontWeight:800, fontSize:16, color:'var(--accent)'}}>₹{f.price}</div>
                    <div style={{fontSize:12, color: f.available ? '#4ade80' : 'var(--nonveg-color)', fontWeight:600, marginTop:2}}>
                      ● {f.available ? 'Available' : 'Disabled'}
                    </div>
                  </div>

                  <div style={{display:'flex', gap:8, marginLeft:8}}>
                    <button 
                      className="btn-outline" 
                      style={{padding:'6px 12px', fontSize:12}}
                      onClick={() => toggleAvailability(f)}
                    >
                      {f.available ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{padding:'6px 12px', fontSize:12, color:'var(--nonveg-color)', borderColor:'rgba(239,68,68,0.3)'}}
                      onClick={() => handleDelete(f._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

