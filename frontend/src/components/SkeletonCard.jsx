import React from 'react'

export default function SkeletonCard(){
  return (
    <div className="food-card card" style={{opacity:0.6}}>
      <div style={{width:'100%',height:140,background:'linear-gradient(90deg,#0e1113,#121418)'}} />
      <div style={{height:12,background:'#0f1417',marginTop:12,borderRadius:6}} />
      <div style={{height:10,background:'#0f1417',marginTop:8,borderRadius:6,width:'60%'}} />
      <div style={{marginTop:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{height:36,width:90,background:'#0f1417',borderRadius:8}} />
        <div style={{height:36,width:60,background:'#0f1417',borderRadius:8}} />
      </div>
    </div>
  )
}
