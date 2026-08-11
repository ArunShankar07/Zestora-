import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useApp } from '../context/AppContext'

export default function Payment(){
  const loc = useLocation();
  const nav = useNavigate();
  const { cart, table } = useApp();
  const customer = loc.state?.customer || {};
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((a,b)=> a + b.price * b.qty, 0);
  const gst = +(subtotal * 0.05).toFixed(2);
  const service = +(subtotal * 0.02).toFixed(2);
  const grand = +(subtotal + gst + service).toFixed(2);

  async function handlePay(){
    setLoading(true);
    const payload = {
      customerName: customer.name || 'Guest',
      phone: customer.phone || 'N/A',
      email: customer.email || '',
      tableNumber: table,
      items: cart,
      discount: 0,
      paymentMethod: method
    };
    try{
      const res = await api.post('/orders', payload);
      const id = res.data.order._id;
      nav(`/confirmation/${id}`);
    }catch(err){
      console.error(err); 
      alert('Order payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const paymentMethods = [
    { id: 'UPI', label: 'UPI / QR Code', icon: '📱', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
    { id: 'Card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
    { id: 'Cash', label: 'Cash on Table', icon: '💵', desc: 'Pay with cash after dining' }
  ];

  return (
    <div className="animate-fade-in" style={{maxWidth:600, margin:'0 auto', display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <h2 style={{fontSize:26, fontWeight:800}}>Choose Payment Method</h2>
        <p className="muted" style={{fontSize:14, marginTop:4}}>Select how you would like to complete your order</p>
      </div>

      <div className="card" style={{display:'flex', flexDirection:'column', gap:20, padding:24}}>
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {paymentMethods.map(m => {
            const isSelected = method === m.id;
            return (
              <div 
                key={m.id}
                onClick={() => setMethod(m.id)}
                style={{
                  display:'flex',
                  alignItems:'center',
                  gap:14,
                  padding:16,
                  borderRadius:12,
                  background: isSelected ? 'var(--accent-glow)' : 'var(--bg-surface)',
                  border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  cursor:'pointer',
                  transition:'all 0.2s ease'
                }}
              >
                <div style={{fontSize:24}}>{m.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700, fontSize:15, color: isSelected ? 'var(--accent)' : 'var(--text-primary)'}}>
                    {m.label}
                  </div>
                  <div className="muted" style={{fontSize:12, marginTop:2}}>{m.desc}</div>
                </div>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={isSelected} 
                  onChange={() => setMethod(m.id)}
                  style={{accentColor:'var(--accent)', width:18, height:18}}
                />
              </div>
            )
          })}
        </div>

        <div style={{
          background:'var(--bg-surface)',
          padding:16,
          borderRadius:12,
          border:'1px solid var(--border)',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center'
        }}>
          <div>
            <div className="muted" style={{fontSize:13}}>Amount to Pay</div>
            <div style={{fontSize:24, fontWeight:800, color:'var(--accent)'}}>₹{grand.toFixed(2)}</div>
          </div>
          <button 
            className="btn-accent" 
            style={{padding:'12px 24px', fontSize:15}} 
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? 'Processing...' : `PAY NOW • ₹${grand.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  )
}

