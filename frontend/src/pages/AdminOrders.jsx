import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminOrders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const token = localStorage.getItem('admin_token')
    api.get('/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  },[])

  async function updateStatus(id, status){
    const token = localStorage.getItem('admin_token')
    try {
      await api.put(`/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } })
      setOrders(prev => prev.map(o => o._id === id ? {...o, orderStatus: status} : o))
    } catch(e) {
      console.error(e)
      alert('Failed to update status')
    }
  }

  const getStatusBadgeClass = (st) => {
    switch(st) {
      case 'Completed': return { bg:'rgba(34, 197, 94, 0.15)', color:'#4ade80', border:'rgba(34, 197, 94, 0.3)' };
      case 'Preparing': return { bg:'rgba(234, 179, 8, 0.15)', color:'#facc15', border:'rgba(234, 179, 8, 0.3)' };
      case 'Ready': return { bg:'rgba(59, 130, 246, 0.15)', color:'#60a5fa', border:'rgba(59, 130, 246, 0.3)' };
      case 'Cancelled': return { bg:'rgba(239, 68, 68, 0.15)', color:'#f87171', border:'rgba(239, 68, 68, 0.3)' };
      default: return { bg:'var(--bg-surface)', color:'var(--text-secondary)', border:'var(--border)' };
    }
  };

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <h2 style={{fontSize:24, fontWeight:800}}>Live Kitchen Orders</h2>
        <p className="muted" style={{fontSize:13, marginTop:4}}>Manage incoming table orders, kitchen queue status, and bill invoices</p>
      </div>

      <div className="card" style={{padding:0, overflow:'hidden'}}>
        {loading ? (
          <div style={{padding:32, textAlign:'center'}} className="muted">Loading live orders...</div>
        ) : orders.length === 0 ? (
          <div style={{padding:32, textAlign:'center'}} className="muted">No orders found</div>
        ) : (
          <div style={{display:'flex', flexDirection:'column'}}>
            {orders.map((o, i) => {
              const badgeStyle = getStatusBadgeClass(o.orderStatus);
              return (
                <div 
                  key={o._id} 
                  style={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'space-between',
                    padding:16,
                    borderBottom: i < orders.length - 1 ? '1px solid var(--border)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    gap:16,
                    flexWrap:'wrap'
                  }}
                >
                  <div>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <span style={{fontWeight:800, fontSize:15, color:'var(--text-primary)'}}>{o.orderId}</span>
                      <span className="badge" style={{background:'var(--accent-glow)', color:'var(--accent)', fontWeight:700}}>
                        Table #{o.tableNumber || 'N/A'}
                      </span>
                    </div>
                    <div className="muted" style={{fontSize:13, marginTop:4}}>
                      👤 {o.customerName || 'Guest'} • {new Date(o.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    </div>
                  </div>

                  <div style={{display:'flex', alignItems:'center', gap:16}}>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontWeight:800, fontSize:16, color:'var(--accent)'}}>₹{o.grandTotal}</div>
                      <div className="muted" style={{fontSize:12, marginTop:2}}>
                        {o.paymentMethod} ({o.paymentStatus})
                      </div>
                    </div>

                    <select 
                      value={o.orderStatus} 
                      onChange={e => updateStatus(o._id, e.target.value)} 
                      style={{
                        background: badgeStyle.bg,
                        color: badgeStyle.color,
                        border: `1px solid ${badgeStyle.border}`,
                        padding: '8px 12px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="Received">Received</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Served">Served</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <a 
                      className="btn-outline" 
                      style={{padding:'7px 12px', fontSize:13}}
                      href={`http://localhost:5000/api/orders/${o._id}/invoice`} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      Invoice
                    </a>
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

