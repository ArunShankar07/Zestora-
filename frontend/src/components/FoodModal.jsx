import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import imageFor from '../assets/images'
import { useApp } from '../context/AppContext'

export default function FoodModal({ food, onClose }){
  const { addToCart } = useApp()
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')

  if(!food) return null

  function handleAdd(){
    addToCart({ food: food._id, name: food.name, price: food.price, qty, notes })
    onClose()
  }

  const imgUrl = imageFor(food.name, food.image);

  return createPortal(
    <div 
      style={{
        position:'fixed',
        inset:0,
        background:'rgba(5, 7, 12, 0.8)',
        backdropFilter:'blur(8px)',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        zIndex:1200,
        padding: '16px',
        overflowY: 'auto'
      }} 
      onClick={onClose}
      className="animate-fade-in"
    >
      <div 
        className="card" 
        style={{
          width:'min(680px, 95vw)',
          maxHeight:'90vh',
          display:'flex',
          gap:20,
          flexWrap: 'wrap',
          padding: 20,
          border: '1px solid var(--border-hover)',
          overflow: 'hidden',
          minHeight: 0
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{flex:'1 1 280px', minWidth:240, maxHeight:280, borderRadius: 14, overflow: 'hidden', background: 'var(--bg-surface)'}}>
          <img src={imgUrl} alt={food.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
        </div>

        <div style={{flex:'1 1 300px', minWidth:240, display:'flex', flexDirection:'column', maxHeight:'calc(90vh - 60px)', minHeight:0}}>
          <div style={{overflowY:'auto', paddingRight:8, minHeight:0, paddingBottom:16}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12}}>
              <div>
                <span className={`badge ${food.veg ? 'badge-veg' : 'badge-nonveg'}`} style={{marginBottom:8}}>
                  ● {food.veg ? 'VEG' : 'NON-VEG'}
                </span>
            <h2 style={{fontSize:22, fontWeight:800, color:'var(--text-primary)'}}>{food.name}</h2>
              </div>
              <button 
                onClick={onClose} 
                style={{background:'none', border:'none', color:'var(--text-muted)', fontSize:24, cursor:'pointer'}}
              >
                ✕
              </button>
            </div>

            <p className="muted" style={{marginTop:6, fontSize:13, lineHeight:1.5}}>
              {food.description || 'Specially crafted dish with fresh organic ingredients and rich flavors.'}
            </p>

            <div style={{marginTop:12, display:'flex', alignItems:'baseline', gap:12}}>
              <span style={{fontSize:24, fontWeight:800, color:'var(--accent)'}}>₹{food.price}</span>
              <span className="muted" style={{fontSize:13}}>per portion</span>
            </div>

            <div style={{marginTop:14}}>
              <label className="muted" style={{fontSize:13, fontWeight:600}}>Quantity</label>
              <div style={{display:'flex', alignItems:'center', gap:10, marginTop:6}}>
                <button className="btn-outline" style={{width:36, height:36, borderRadius:8, fontSize:16}} onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span style={{minWidth:32, textAlign:'center', fontWeight:800, fontSize:16}}>{qty}</span>
                <button className="btn-outline" style={{width:36, height:36, borderRadius:8, fontSize:16}} onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            <div style={{marginTop:12}}>
              <label className="muted" style={{fontSize:13, fontWeight:600}}>Special instructions (Optional)</label>
              <textarea 
                className="form-control" 
                rows={1} 
                placeholder="E.g., Less spicy, no onions..." 
                value={notes} 
                onChange={e => setNotes(e.target.value)}
                style={{marginTop:4, resize:'none', fontSize:12}}
              />
            </div>
          </div>

          <div style={{display:'flex', flexWrap:'wrap', gap:10, marginTop:16, flexShrink:0, zIndex:1}}>
            <button className="btn-accent" style={{flex:'1 1 180px', padding:10, minWidth:120, fontSize:13}} onClick={handleAdd}>
              ADD TO CART • ₹{(food.price * qty).toFixed(2)}
            </button>
            <button className="btn-outline" style={{flex:'0 1 120px', minWidth:120}} onClick={onClose}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>, 
    document.body
  )
}

