import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useApp } from '../context/AppContext'
import imageFor from '../assets/images'
import FoodModal from '../components/FoodModal'
import SkeletonCard from '../components/SkeletonCard'

export default function Menu(){
  const [foods, setFoods] = useState([])
  const { addToCart } = useApp()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [vegOnly, setVegOnly] = useState(false)

  useEffect(()=>{ 
    setLoading(true); 
    api.get('/foods')
      .then(r => setFoods(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false)); 
  },[])

  function handleAdd(f, e){
    e.stopPropagation();
    addToCart({ food: f._id, name: f.name, price: f.price, qty: 1 })
  }

  // Categories list
  const categories = ['All', ...new Set(foods.map(f => f.category).filter(Boolean))];

  // Filtered food list
  const filteredFoods = foods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          (f.description && f.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'All' || f.category === category;
    const matchesVeg = !vegOnly || f.veg === true;
    return matchesSearch && matchesCategory && matchesVeg;
  });

  return (
    <div className="animate-fade-in" style={{display:'flex', flexDirection:'column', gap:20}}>
      {/* Header & Controls */}
      <div className="card" style={{padding: 24}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16}}>
          <div>
            <h2 style={{fontSize:26, fontWeight:800}}>Our Culinary Menu</h2>
            <p className="muted" style={{fontSize:14, marginTop:4}}>Explore fresh & handcrafted delicacies cooked to perfection</p>
          </div>

          {/* Search bar */}
          <div style={{minWidth: 260, flex: '0 1 320px'}}>
            <input 
              type="text"
              className="form-control"
              placeholder="🔍 Search dishes, burgers, pizza..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12}}>
          <div className="filter-bar" style={{marginBottom: 0}}>
            {categories.map(cat => (
              <button 
                key={cat}
                className={`filter-chip ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer', userSelect:'none', fontSize:13, fontWeight:600}} className="muted">
            <input 
              type="checkbox" 
              checked={vegOnly} 
              onChange={e => setVegOnly(e.target.checked)}
              style={{accentColor:'var(--veg-color)', width:16, height:16}}
            />
            🌱 Pure Veg Only
          </label>
        </div>
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="food-grid">
          {Array.from({length: 8}).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="card" style={{textAlign:'center', padding:40}}>
          <div style={{fontSize:40, marginBottom:12}}>🍽️</div>
          <h3>No dishes found</h3>
          <p className="muted" style={{marginTop:6}}>Try adjusting your search query or category filter.</p>
          <button className="btn-outline" style={{marginTop:16}} onClick={() => { setSearch(''); setCategory('All'); setVegOnly(false); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="food-grid">
          {filteredFoods.map(f => {
            const imgUrl = imageFor(f.name, f.image);
            return (
              <div key={f._id} className="food-card" onClick={() => setSelected(f)} style={{cursor:'pointer'}}>
                {f.popular && <span className="badge-popular">⭐ POPULAR</span>}
                <div className="food-card-img-wrapper">
                  <img src={imgUrl} alt={f.name} loading="lazy" />
                </div>
                <div className="food-card-body">
                  <div className="meta">
                    <div style={{display:'flex', alignItems:'center', gap:6}}>
                      <span className={`badge ${f.veg ? 'badge-veg' : 'badge-nonveg'}`}>
                        ● {f.veg ? 'VEG' : 'NON-VEG'}
                      </span>
                      {f.category && <span className="badge">{f.category}</span>}
                    </div>
                    <span style={{fontSize:12, fontWeight:700, color:'#eab308'}}>
                      ★ {f.rating || 4.5}
                    </span>
                  </div>

                  <h5>{f.name}</h5>
                  <p>{f.description || 'Delicious gourmet preparation crafted with fine ingredients.'}</p>

                  <div className="food-card-footer">
                    <div className="price">₹{f.price}</div>
                    <button className="btn-accent" onClick={(e) => handleAdd(f, e)} style={{padding:'7px 14px', fontSize:13}}>
                      + ADD
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && <FoodModal food={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

