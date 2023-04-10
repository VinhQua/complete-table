import React, { useState } from 'react'
import { useAsyncDebounce, useTable } from 'react-table'

export const GlobalFilter = ({filterValue,setGlobalFilter}) => {
  const [value, setValue] = useState(filterValue)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 1000)
    return (
    <span> 
        Search: 
        <input type="text" value={value || ''} onChange={(e)=> {
          setValue(e.target.value)
          onChange(e.target.value)
          }} />
    </span>
  )
}
