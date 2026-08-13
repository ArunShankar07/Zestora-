import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

export default function Confirmation(){
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  
  useEffect(()=>{ 
    if(id) api.get(`/orders/${id}`).then(r=>setOrder(r.data)).catch(err=>console.error(err)); 
  },[id])

  if(!order) return (
    <div className="card animate-fade-in" style={{textAlign:'center', padding:40}}>
      <div className="muted">Fetching order details...</div>
    </div>
  )

  return (
    <div className="animate-fade-in" style={{maxWidth:680, margin:'0 auto', display:'flex', flexDirection:'column', gap:20}}>
      <div className="card" style={{padding:32, display:'flex', flexDirection:'column', gap:24, textAlign:'center', alignItems:'center'}}>
        <div style={{
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 38,
          color: '#fff',
          boxShadow: '0 8px 24px var(--accent-glow)'
        }}>
          ✓
        </div>

        <div>
          <span className="badge" style={{background:'rgba(34, 197, 94, 0.15)', color:'#4ade80', borderColor:'rgba(34, 197, 94, 0.3)', marginBottom:8}}>
            ORDER CONFIRMED
          </span>
          <h2 style={{fontSize:30, fontWeight:800, color:'var(--text-primary)'}}>Thank You For Ordering!</h2>
          <p className="muted" style={{fontSize:14, marginTop:6}}>
            Your order has been received by our kitchen staff and is being prepared.
          </p>
        </div>

        {/* Order Info Grid */}
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16,
          background: 'var(--bg-surface)',
          padding: 20,
          borderRadius: 14,
          border: '1px solid var(--border)',
          textAlign: 'left'
        }}>
          <div>
            <div className="muted" style={{fontSize:12}}>Bill Number</div>
            <div style={{fontWeight:800, fontSize:16, marginTop:2}}>{order.billNumber}</div>
          </div>
          <div>
            <div className="muted" style={{fontSize:12}}>Order Ref ID</div>
            <div style={{fontWeight:800, fontSize:14, marginTop:2, wordBreak:'break-all'}}>{order.orderId}</div>
          </div>
          <div>
            <div className="muted" style={{fontSize:12}}>Assigned Table</div>
            <div style={{fontWeight:800, fontSize:16, marginTop:2, color:'var(--accent)'}}>
              Table #{order.tableNumber || 'N/A'}
            </div>
          </div>
          <div>
            <div className="muted" style={{fontSize:12}}>Payment Status</div>
            <div style={{fontWeight:800, fontSize:15, marginTop:2, color:'#4ade80'}}>
              {order.paymentMethod} ({order.paymentStatus || 'Paid'})
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div style={{
          width: '100%',
          background: 'var(--bg-surface)',
          padding: 20,
          borderRadius: 14,
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{fontWeight:800, fontSize:18, marginBottom:8}}>ZESTORA</div>
          <div style={{display:'flex', flexDirection:'column', gap:6}}>
            <div className="muted" style={{fontSize:13}}>📍 Nagercoil, Tamil Nadu</div>
            <div className="muted" style={{fontSize:13}}>📱 +91-XXXX-XXXX-XXX</div>
            <div className="muted" style={{fontSize:13}}>✉️ info@zestora.com</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center'}}>
          <a 
            className="btn-outline" 
            href={`http://localhost:5000/api/orders/${order._id}/invoice`} 
            target="_blank" 
            rel="noreferrer"
            style={{padding:'10px 18px'}}
          >
            🧾 Download / View Bill Invoice
          </a>
          <Link className="btn-accent" to="/menu" style={{padding:'10px 18px'}}>
            🍔 Order More Items
          </Link>
        </div>
      </div>
    </div>
  )
}

