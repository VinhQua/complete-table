import { useEffect, useMemo, useState } from "react";
import './table.css';
import axios from "axios";
import { useSortBy, useTable,useGlobalFilter, useFilters,usePagination, useRowSelect, useColumnOrder, useBlockLayout } from "react-table";
import {format} from 'date-fns'
import {  GlobalFilter } from "./GlobalFilter";
import { ColumnsFilter } from "./ColumnsFilter";
import { CheckBox } from "./CheckBox";
import { useSticky } from "react-table-sticky";
import styled from "styled-components";
import TableStyle from "./TableStyle";
function capitalizeFirstLetter(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
}
export const StudentTable = () => {
   const [students, setStudents] = useState([]);
   const [isActive, setIsActive] = useState(false);
   const fetchStudents = async () => {
    const response = await axios.get("http://localhost:3000/database/Student_info.json")
    .catch(err => console.log(err));
    if (response) {
        //console.log(response.data);
        setStudents(response.data);
   }
    }
    const columns = useMemo(()=> (students[0])? Object.keys(students[0]).map((key) => {
        if (key === "date_of_birth") {
            return {
                Header: capitalizeFirstLetter(key.replaceAll("_", " ")),
                Footer: capitalizeFirstLetter(key.replaceAll("_", " ")),
                accessor: key,
                Cell: ({value}) => {return format(new Date(value), "dd/MM/yyyy")},
                Filter: ColumnsFilter,
                stick:'left',
            
            }
        }
        return {
            Header: capitalizeFirstLetter(key.replaceAll("_", " ")),
            Footer: capitalizeFirstLetter(key.replaceAll("_", " ")),
            accessor: key,
            Filter: ColumnsFilter
        }
    }):[],[students]);
    const data = useMemo(()=> [...students],[students] )
    const TableInstance = useTable({columns,
        data,
        initialState:{pageIndex:0}}
        ,useFilters, 
        useGlobalFilter, 
        useSortBy,
        useColumnOrder,
        usePagination,
        useRowSelect,
        useBlockLayout,
        (hooks)=>{
            hooks.visibleColumns.push((columns)=>{
                return [
                    {
                        id:'selection',
                        Header: ({getToggleAllRowsSelectedProps}) => (
                            <CheckBox {...getToggleAllRowsSelectedProps()}/>
                        ),
                        Cell: ({row}) => (
                            <CheckBox {...row.getToggleRowSelectedProps()} type="checkbox"/>
                        )
                    },
                    ...columns
                ]
            });
        },
        useSticky);
    console.log(columns);
    useEffect(()=>{
    fetchStudents()}, []);
    const {getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    setGlobalFilter,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
    setColumnOrder,
    selectedFlatRows,
    } = TableInstance
    const {globalFilter} = state
    const {pageIndex, pageSize}= state
    const ChangeOrder = () => {
        console.log(columns.map(column => column.accessor).sort())
        setColumnOrder(columns.map(column => column.accessor).sort())
    }
    const hideToggle=() => {
        const value =!isActive
        setIsActive(value)
    }
    return (
        <div className="container">
            
            <div className="columns-panel" >
                <button className="pannel-btn" onClick={hideToggle}>Column Panel</button>
                <div className={isActive? 'hide':''} >
                    <div>
                        <CheckBox {...getToggleHideAllColumnsProps()}/> Toggle All
                    </div>
                    {
                        allColumns.map(column=>(
                            <div key={column.id}>
                                <label>
                                    <CheckBox type="checkbox" {...column.getToggleHiddenProps()}/>
                                    {column.Header}
                                </label>
                            </div>
                        ))
                    }
                </div>
            </div>

            <button onClick={ChangeOrder}>Change Column Order</button>
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}/>
        <TableStyle>


         <div className="table sticky" {...getTableProps()} style={{width:"100%",height:500}}>
            <div className="header">
                {headerGroups.map(headerGroup => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {
                    headerGroup.headers.map(column => (
                        <div {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                            {column.render("Header")}
                            <span>{column.isSorted? column.isSortedDesc? "▼" : "▲" : ""}</span>
                            {/* <div>{column.canFilter? column.render('Filter'):null}</div> */}
                        </div>  
                    ))
                }
                
              </div>  
              ))}
            </div>
            <div {...getTableBodyProps()} className="body">
                {
                    page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <div {...row.getRowProps()} className="tr">
                                {row.cells.map(cell => {
                                    return <div {...cell.getCellProps()} className="td">{cell.render("Cell")}</div>
                                })}
                            </div>
                        )
                    })
                }

            </div>

         </div>
         </TableStyle>
            <pre>
                <code>
                    {JSON.stringify(
                        {
                            selectedFlatRows: selectedFlatRows.map(row => row.original),
                        },
                        null,
                        2
                    )}
                </code>
            </pre>
         <div>
            <span>
                Page{' '}
                <strong>
                    {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
            </span>
            <span>
                | Go to page:{' '}
                <input type="number" defaultChecked={pageIndex + 1} onChange={e=>{
                    const pageNumber = e.target.value? e.target.value - 1 : 0
                    gotoPage(pageNumber)
                }} style={{width:'50px'}}/>
            </span>
            <select value={pageSize} onChange={e=> setPageSize(Number(e.target.value))}>
                {
                    [10, 25, 50 ].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))
                }
            </select>
            <button onClick={()=>gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
            <button onClick={()=>previousPage()} disabled={!canPreviousPage}>Previous</button>
            <button onClick={()=>nextPage()} disabled={!canNextPage}>Next</button>
            <button onClick={()=>gotoPage(pageCount-1)} disabled={!canNextPage}>{'>>'}</button>
         </div>
        </div>

    )
    
}