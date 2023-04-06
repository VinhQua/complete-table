import React from 'react'

export const GlobalFilter = ({globalFilter,setGlobalFilter}) => {
  
    return (
    <span> 
        Search: 
        <input type="text" value={globalFilter || ''} onChange={(e)=> setGlobalFilter(e.target.value)} />
    </span>
  )
}
