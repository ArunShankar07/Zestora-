import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import imageFor from '../assets/images'

export default function Cart(){
  const { cart, updateQty, removeItem, table } = useApp();
  const nav = useNavigate();
  const subtotal = cart.reduce((a,b)=> a + b.price * b.qty, 0);
  const gst = +(subtotal * 0.05).toFixed(2);
  const service = +(subtotal * 0.02).toFixed(2);
  const grand = +(subtotal + gst + service).toFixed(2);

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{fontSize:26, fontWeight:800}}>Your Dining Cart</h2>
          <p className="muted" style={{fontSize:14, marginTop:4}}>Review selected items before proceeding to checkout</p>
        </div>
        {table && (
          <div className="badge" style={{background:'var(--accent-glow)', color:'var(--accent)', borderColor:'var(--accent)', padding:'8px 14px', fontSize:14, fontWeight:700}}>
            📍 Table #{table}
          </div>
        )}
      </div>

      <div className="grid-2">
        {/* Cart Items List */}
        <div className="card" style={{display:'flex', flexDirection:'column', gap:16}}>
          {cart.length === 0 ? (
            <div style={{textAlign:'center', padding:'40px 20px'}}>
              <div style={{fontSize:48, marginBottom:12}}>🛒</div>
              <h3>Your cart is empty</h3>
              <p className="muted" style={{marginTop:6}}>Looks like you haven't added any delicious meals yet.</p>
              <Link to="/menu" className="btn-accent" style={{marginTop:16}}>
                🍔 Browse Menu & Add Food
              </Link>
            </div>
          ) : (
            cart.map(it => {
              const imgUrl = imageFor(it.name);
              return (
                <div 
                  key={it.food} 
                  style={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'space-between',
                    padding:'12px',
                    borderRadius:12,
                    background:'var(--bg-surface)',
                    border:'1px solid var(--border)',
                    gap:14,
                    flexWrap:'wrap'
                  }}
                >
                  <div style={{display:'flex', gap:14, alignItems:'center', flex: '1 1 240px'}}>
                    <img 
                      src={imgUrl} 
                      alt={it.name} 
                      style={{width:80, height:64, objectFit:'cover', borderRadius:10, flexShrink:0}}
                    />
                    <div>
                      <h4 style={{fontSize:16, fontWeight:700}}>{it.name}</h4>
                      <div className="muted" style={{fontSize:13, marginTop:2}}>₹{it.price} per item</div>
                      {it.notes && <div style={{fontSize:12, color:'var(--accent)', marginTop:2}}>Note: {it.notes}</div>}
                    </div>
                  </div>

                  <div style={{display:'flex', alignItems:'center', gap:14}}>
                    <div style={{display:'flex', alignItems:'center', gap:8, background:'var(--bg-card)', padding:4, borderRadius:10, border:'1px solid var(--border)'}}>
                      <button className="btn-outline" style={{width:30, height:30, padding:0}} onClick={() => updateQty(it.food, Math.max(1, it.qty - 1))}>-</button>
                      <span style={{minWidth:24, textAlign:'center', fontWeight:800}}>{it.qty}</span>
                      <button className="btn-outline" style={{width:30, height:30, padding:0}} onClick={() => updateQty(it.food, it.qty + 1)}>+</button>
                    </div>

                    <div style={{width:80, textAlign:'right', fontWeight:800, fontSize:16, color:'var(--accent)'}}>
                      ₹{(it.price * it.qty).toFixed(2)}
                    </div>

                    <button 
                      onClick={() => removeItem(it.food)} 
                      style={{background:'none', border:'none', color:'var(--nonveg-color)', cursor:'pointer', padding:4, fontSize:16}}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Summary Card */}
        <aside className="card cart-summary" style={{display:'flex', flexDirection:'column', gap:14, height:'fit-content'}}>
          <h3 style={{fontSize:18, fontWeight:800, paddingBottom:10, borderBottom:'1px solid var(--border)'}}>
            Bill Breakdown
          </h3>

          <div style={{display:'flex', flexDirection:'column', gap:8, fontSize:14}}>
            <div style={{display:'flex', justifyContent:'space-between'}} className="muted">
              <span>Items Total ({cart.reduce((a,b)=>a+b.qty,0)})</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}} className="muted">
              <span>GST Tax (5%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}} className="muted">
              <span>Restaurant Service (2%)</span>
              <span>₹{service.toFixed(2)}</span>
            </div>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px dashed var(--border)'}}>
            <span style={{fontSize:16, fontWeight:800}}>Grand Total</span>
            <span style={{fontSize:22, fontWeight:800, color:'var(--accent)'}}>₹{grand.toFixed(2)}</span>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:10}}>
            <button 
              className="btn-accent" 
              style={{width:'100%', padding:12}} 
              onClick={() => nav('/checkout')} 
              disabled={cart.length === 0}
            >
              PROCEED TO CHECKOUT →
            </button>
            <Link to="/menu" className="btn-outline" style={{width:'100%', textAlign:'center'}}>
              + Add More Items
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

