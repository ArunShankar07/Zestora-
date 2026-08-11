import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate, Link } from 'react-router-dom'
import imageFor from '../assets/images'

export default function Checkout(){
  const { cart, table } = useApp();
  const [form, setForm] = useState({ name:'', phone:'', email:'', special:'' });
  const nav = useNavigate();

  function handleProceed(){
    if (!form.name || !form.phone) return alert('Please enter your Name and Phone number');
    nav('/payment', { state: { customer: form } });
  }

  const subtotal = cart.reduce((a,b)=> a + b.price * b.qty, 0);
  const gst = +(subtotal * 0.05).toFixed(2);
  const service = +(subtotal * 0.02).toFixed(2);
  const grand = +(subtotal + gst + service).toFixed(2);

  if (cart.length === 0) {
    return (
      <div className="card animate-fade-in" style={{textAlign:'center', padding:40}}>
        <div style={{fontSize:48, marginBottom:12}}>🛒</div>
        <h3>No items in cart</h3>
        <p className="muted" style={{marginTop:6}}>Please add items to your cart before proceeding to checkout.</p>
        <Link to="/menu" className="btn-accent" style={{marginTop:16}}>Go to Menu</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <h2 style={{fontSize:26, fontWeight:800}}>Checkout Information</h2>
        <p className="muted" style={{fontSize:14, marginTop:4}}>Provide customer details to finalize your restaurant order</p>
      </div>

      <div className="grid-2">
        {/* Customer Form */}
        <div className="card" style={{display:'flex', flexDirection:'column', gap:18}}>
          <h3 style={{fontSize:18, fontWeight:700, borderBottom:'1px solid var(--border)', paddingBottom:10}}>
            👤 Customer Details
          </h3>

          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            <div>
              <label className="muted" style={{fontSize:13, fontWeight:600, display:'block', marginBottom:6}}>Full Name *</label>
              <input 
                className="form-control" 
                placeholder="E.g., Rahul Sharma" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required
              />
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <label className="muted" style={{fontSize:13, fontWeight:600, display:'block', marginBottom:6}}>Phone Number *</label>
                <input 
                  className="form-control" 
                  placeholder="E.g., 9876543210" 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})} 
                  required
                />
              </div>
              <div>
                <label className="muted" style={{fontSize:13, fontWeight:600, display:'block', marginBottom:6}}>Email Address (Optional)</label>
                <input 
                  className="form-control" 
                  placeholder="name@domain.com" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <label className="muted" style={{fontSize:13, fontWeight:600, display:'block', marginBottom:6}}>Kitchen Notes / Delivery Requests</label>
              <textarea 
                className="form-control" 
                placeholder="Any dietary preferences or table requests..." 
                rows={3} 
                value={form.special}
                onChange={e => setForm({...form, special: e.target.value})} 
                style={{resize:'none'}}
              />
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="card cart-summary" style={{display:'flex', flexDirection:'column', gap:14, height:'fit-content'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--border)', paddingBottom:10}}>
            <h3 style={{fontSize:18, fontWeight:800}}>Order Items Summary</h3>
            <span className="badge" style={{background:'var(--accent-glow)', color:'var(--accent)', fontWeight:700}}>
              {table ? `Table #${table}` : 'No Table'}
            </span>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:10, maxHeight:260, overflowY:'auto', paddingRight:4}}>
            {cart.map(it => (
              <div key={it.food} style={{display:'flex', gap:10, alignItems:'center'}}>
                <img src={imageFor(it.name)} alt={it.name} style={{width:54, height:42, objectFit:'cover', borderRadius:8, flexShrink:0}} />
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:700, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{it.name}</div>
                  <div className="muted" style={{fontSize:12}}>{it.qty} × ₹{it.price}</div>
                </div>
                <div style={{fontWeight:800, fontSize:14, color:'var(--accent)'}}>
                  ₹{(it.qty * it.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{borderTop:'1px dashed var(--border)', paddingTop:10, display:'flex', flexDirection:'column', gap:6, fontSize:13}}>
            <div style={{display:'flex', justifyContent:'space-between'}} className="muted">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}} className="muted">
              <span>GST & Taxes (5%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}} className="muted">
              <span>Service Charge (2%)</span>
              <span>₹{service.toFixed(2)}</span>
            </div>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:'1px solid var(--border)'}}>
            <span style={{fontSize:16, fontWeight:800}}>Total Payable</span>
            <span style={{fontSize:22, fontWeight:800, color:'var(--accent)'}}>₹{grand.toFixed(2)}</span>
          </div>

          <button className="btn-accent" style={{width:'100%', padding:12, marginTop:6}} onClick={handleProceed}>
            PROCEED TO PAYMENT • ₹{grand.toFixed(2)} →
          </button>
        </aside>
      </div>
    </div>
  )
}

