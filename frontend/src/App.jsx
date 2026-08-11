import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import Confirmation from './pages/Confirmation'
import AdminLogin from './pages/AdminLogin'
import AdminOrders from './pages/AdminOrders'
import AdminMenu from './pages/AdminMenu'
import AdminCategories from './pages/AdminCategories'
import AdminTables from './pages/AdminTables'
import AdminReports from './pages/AdminReports'
import Header from './components/Header'
import AdminSidebar from './components/AdminSidebar'

import { AppProvider } from './context/AppContext'

export default function App(){
  return (
    <AppProvider>
      <div className="app-root">
        <Header />
        <main className="container py-4">
          <AppRoutes />
        </main>
      </div>
    </AppProvider>
  )
}

function AppRoutes(){
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin')

  if(isAdmin){
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div style={{flex:1}}>
          <Routes>
            <Route path="/admin" element={<AdminLogin/>} />
            <Route path="/admin/orders" element={<AdminOrders/>} />
            <Route path="/admin/menu" element={<AdminMenu/>} />
            <Route path="/admin/categories" element={<AdminCategories/>} />
            <Route path="/admin/tables" element={<AdminTables/>} />
            <Route path="/admin/reports" element={<AdminReports/>} />
          </Routes>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/menu" element={<Menu/>} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/payment" element={<Payment/>} />
      <Route path="/confirmation/:id" element={<Confirmation/>} />
      <Route path="/admin" element={<AdminLogin/>} />
      <Route path="/admin/orders" element={<AdminOrders/>} />
      <Route path="/admin/menu" element={<AdminMenu/>} />
      <Route path="/admin/categories" element={<AdminCategories/>} />
      <Route path="/admin/tables" element={<AdminTables/>} />
      <Route path="/admin/reports" element={<AdminReports/>} />
    </Routes>
  )
}
