import React from 'react'

export const GlobalFilter = ({filterValue,setFilter}) => {
    return (
    <span> 
        Search: 
        <input type="text" value={filterValue || ''} onChange={(e)=> setFilter(e.target.value)} />
    </span>
  )
}
