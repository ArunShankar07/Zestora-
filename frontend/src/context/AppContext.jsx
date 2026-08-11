import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AppContext = createContext();

export function AppProvider({ children }){
  const [table, setTable] = useState(null)
  const [cart, setCart] = useState([])
  const [tables, setTables] = useState([])

  useEffect(()=>{ api.get('/tables').then(r=>setTables(r.data)).catch(()=>{}); },[])

  function addToCart(item){
    setCart(prev=>{
      const found = prev.find(p=>p.food===item.food);
      if(found) return prev.map(p=> p.food===item.food ? {...p, qty: p.qty + item.qty} : p);
      return [...prev, item];
    })
  }

  function updateQty(foodId, qty){ setCart(prev=> prev.map(p=> p.food===foodId? {...p, qty}:p)) }
  function removeItem(foodId){ setCart(prev=> prev.filter(p=> p.food!==foodId)) }

  return <AppContext.Provider value={{ table, setTable, cart, addToCart, updateQty, removeItem, tables }}>
    {children}
  </AppContext.Provider>
}

export const useApp = ()=> useContext(AppContext)
