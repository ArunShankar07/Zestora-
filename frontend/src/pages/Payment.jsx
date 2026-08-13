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
  const [upiApp, setUpiApp] = useState('qr');
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvv: '' });
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
      paymentMethod: method,
      paymentDetails: method === 'Card' ? cardDetails : method === 'UPI' ? { app: upiApp } : {}
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
    { id: 'UPI', label: 'UPI Payment', icon: '📱' },
    { id: 'Card', label: 'Card Payment', icon: '💳' },
    { id: 'Cash', label: 'Cash on Table', icon: '💵' }
  ];

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', color: '#4285F4', icon: '🔵' },
    { id: 'phonepay', name: 'PhonePe', color: '#5F27CD', icon: '💜' },
    { id: 'paytm', name: 'Paytm', color: '#002970', icon: '🔵' },
    { id: 'bhim', name: 'BHIM', color: '#FF9933', icon: '🟡' },
    { id: 'qr', name: 'QR Code', color: '#000000', icon: '⬛' }
  ];

  return (
    <div className="animate-fade-in" style={{maxWidth:700, margin:'0 auto', display:'flex', flexDirection:'column', gap:20, padding:'20px 16px'}}>
      <div>
        <h2 style={{fontSize:28, fontWeight:800}}>Choose Payment Method</h2>
        <p className="muted" style={{fontSize:14, marginTop:4}}>Select how you would like to complete your order</p>
      </div>

      {/* Payment Method Selection */}
      <div className="card" style={{display:'flex', flexDirection:'column', gap:12, padding:24}}>
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
                <div style={{fontWeight:700, fontSize:16, color: isSelected ? 'var(--accent)' : 'var(--text-primary)'}}>
                  {m.label}
                </div>
              </div>
              <input 
                type="radio" 
                name="payment" 
                checked={isSelected} 
                onChange={() => setMethod(m.id)}
                style={{accentColor:'var(--accent)', width:20, height:20}}
              />
            </div>
          )
        })}
      </div>

      {/* UPI Payment Details */}
      {method === 'UPI' && (
        <div className="card" style={{padding:24}}>
          <h3 style={{fontSize:18, fontWeight:700, marginBottom:16}}>Select Payment App or Scan QR</h3>
          
          {/* QR Code Display */}
          {upiApp === 'qr' && (
            <div style={{background:'var(--bg-surface)', padding:20, borderRadius:12, marginBottom:16, textAlign:'center'}}>
              <div style={{
                width:200,
                height:200,
                margin:'0 auto',
                background:'#fff',
                borderRadius:12,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                border:'2px solid var(--border)',
                fontSize:12,
                color:'var(--text-muted)'
              }}>
                <div>
                  <div style={{fontSize:40, marginBottom:8}}>📱</div>
                  <div>Scan to Pay</div>
                  <div style={{fontSize:11, marginTop:4}}>UPI: zestora@upi</div>
                </div>
              </div>
              <p className="muted" style={{marginTop:12, fontSize:13}}>Scan with any UPI app to complete payment</p>
            </div>
          )}

          {/* App Selection Grid */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(110px, 1fr))', gap:12, marginBottom:16}}>
            {upiApps.map(app => (
              <div
                key={app.id}
                onClick={() => setUpiApp(app.id)}
                style={{
                  padding:16,
                  borderRadius:12,
                  background: upiApp === app.id ? 'var(--accent-glow)' : 'var(--bg-surface)',
                  border: `1.5px solid ${upiApp === app.id ? 'var(--accent)' : 'var(--border)'}`,
                  cursor:'pointer',
                  transition:'all 0.2s ease',
                  textAlign:'center',
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  gap:12,
                  minHeight:140
                }}
              >
                {/* Google Pay Logo */}
                {app.id === 'gpay' && (
                  <svg viewBox="0 0 48 48" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d="M12 8C9.79 8 8 9.79 8 12v24c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4H12z" fill="#F0F0F0"/>
                      <path d="M16 18c-2.21 0-4 1.79-4 4v8c0 2.21 1.79 4 4 4h4v-6h-3v-2h3v-2c0-3.31 2.69-6 6-6h3v2h-3c-2.21 0-4 1.79-4 4v2h7v2h-7v6h3c2.21 0 4-1.79 4-4v-8c0-2.21-1.79-4-4-4h-4z" fill="url(#gpayGradient)"/>
                      <defs>
                        <linearGradient id="gpayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor:'#4285F4', stopOpacity:1}} />
                          <stop offset="33%" style={{stopColor:'#34A853', stopOpacity:1}} />
                          <stop offset="66%" style={{stopColor:'#FBBC04', stopOpacity:1}} />
                          <stop offset="100%" style={{stopColor:'#EA4335', stopOpacity:1}} />
                        </linearGradient>
                      </defs>
                      <circle cx="16" cy="20" r="2" fill="#4285F4"/>
                      <circle cx="24" cy="16" r="2" fill="#34A853"/>
                      <circle cx="32" cy="20" r="2" fill="#FBBC04"/>
                      <circle cx="24" cy="28" r="2" fill="#EA4335"/>
                    </g>
                  </svg>
                )}

                {/* PhonePe Logo */}
                {app.id === 'phonepay' && (
                  <svg viewBox="0 0 48 48" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="22" fill="#5F27CD"/>
                    <text x="24" y="32" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle">₹</text>
                  </svg>
                )}

                {/* Paytm Logo */}
                {app.id === 'paytm' && (
                  <svg viewBox="0 0 48 48" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" fill="#002970" rx="6"/>
                    <text x="24" y="32" fontSize="28" fontWeight="900" fill="#fff" textAnchor="middle">P</text>
                  </svg>
                )}

                {/* BHIM Logo */}
                {app.id === 'bhim' && (
                  <svg viewBox="0 0 48 48" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <text x="6" y="28" fontSize="20" fontWeight="900" fill="#666">BHIM</text>
                      <polygon points="38,16 42,20 38,24" fill="#FF9933"/>
                      <polygon points="42,24 38,28 42,32" fill="#138808"/>
                    </g>
                  </svg>
                )}

                {/* QR Code Logo */}
                {app.id === 'qr' && (
                  <svg viewBox="0 0 48 48" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="8" width="32" height="32" fill="#fff" stroke="#000" strokeWidth="2"/>
                    <rect x="10" y="10" width="8" height="8" fill="#000"/>
                    <rect x="20" y="10" width="4" height="4" fill="#000"/>
                    <rect x="30" y="10" width="8" height="8" fill="#000"/>
                    <rect x="10" y="20" width="4" height="4" fill="#000"/>
                    <rect x="22" y="22" width="2" height="2" fill="#000"/>
                    <rect x="26" y="22" width="2" height="2" fill="#000"/>
                    <rect x="30" y="20" width="4" height="4" fill="#000"/>
                    <rect x="10" y="30" width="8" height="8" fill="#000"/>
                    <rect x="20" y="30" width="4" height="4" fill="#000"/>
                    <rect x="30" y="30" width="8" height="8" fill="#000"/>
                  </svg>
                )}

                <div style={{fontSize:13, fontWeight:600, color: upiApp === app.id ? 'var(--accent)' : 'var(--text-primary)'}}>{app.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Payment Details */}
      {method === 'Card' && (
        <div className="card" style={{padding:24}}>
          <h3 style={{fontSize:18, fontWeight:700, marginBottom:16}}>Enter Card Details</h3>
          
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            <div>
              <label className="muted" style={{fontSize:13, fontWeight:600, display:'block', marginBottom:6}}>Cardholder Name</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
                style={{padding:'10px 14px', fontSize:14, borderRadius:8}}
              />
            </div>

            <div>
              <label className="muted" style={{fontSize:13, fontWeight:600, display:'block', marginBottom:6}}>Card Number</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={e => setCardDetails({...cardDetails, number: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()})}
                maxLength="19"
                style={{padding:'10px 14px', fontSize:14, borderRadius:8, letterSpacing:'2px'}}
              />
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <label className="muted" style={{fontSize:13, fontWeight:600, display:'block', marginBottom:6}}>Expiry Date</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={e => {
                    let val = e.target.value.replace(/\D/g, '');
                    if(val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2,4);
                    setCardDetails({...cardDetails, expiry: val});
                  }}
                  maxLength="5"
                  style={{padding:'10px 14px', fontSize:14, borderRadius:8}}
                />
              </div>
              <div>
                <label className="muted" style={{fontSize:13, fontWeight:600, display:'block', marginBottom:6}}>CVV</label>
                <input 
                  type="password" 
                  className="form-control"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={e => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0,3)})}
                  maxLength="3"
                  style={{padding:'10px 14px', fontSize:14, borderRadius:8}}
                />
              </div>
            </div>

            <div style={{background:'var(--accent-glow)', padding:12, borderRadius:8, marginTop:8}}>
              <p className="muted" style={{fontSize:12}}><strong>🔒 Your payment is secure</strong> - All card data is encrypted</p>
            </div>
          </div>
        </div>
      )}

      {/* Cash Payment Info */}
      {method === 'Cash' && (
        <div className="card" style={{padding:24, background:'var(--bg-surface)'}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{fontSize:32}}>💵</div>
            <div>
              <h3 style={{fontSize:16, fontWeight:700}}>Pay at Table</h3>
              <p className="muted" style={{fontSize:13, marginTop:4}}>Please pay the amount to our staff after dining. Thank you!</p>
            </div>
          </div>
        </div>
      )}

      {/* Amount and Pay Button */}
      <div className="card" style={{
        background:'var(--bg-surface)',
        padding:20,
        borderRadius:12,
        border:'1px solid var(--border)',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        flexWrap:'wrap',
        gap:16
      }}>
        <div>
          <div className="muted" style={{fontSize:13, marginBottom:4}}>Amount to Pay</div>
          <div style={{fontSize:28, fontWeight:800, color:'var(--accent)'}}>₹{grand.toFixed(2)}</div>
        </div>
        <button 
          className="btn-accent" 
          style={{padding:'14px 28px', fontSize:16, fontWeight:700}} 
          onClick={handlePay}
          disabled={loading || (method === 'Card' && (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv))}
        >
          {loading ? '⏳ Processing...' : `PAY NOW • ₹${grand.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}

