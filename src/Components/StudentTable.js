import { useEffect, useMemo, useState } from "react";
import './table.css';
import axios from "axios";
import { useSortBy, useTable,useGlobalFilter, useFilters,usePagination, useRowSelect } from "react-table";
import {format} from 'date-fns'
import {  GlobalFilter } from "./GlobalFilter";
import { ColumnsFilter } from "./ColumnsFilter";
import { CheckBox } from "./CheckBox";

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
                Filter: ColumnsFilter
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
        usePagination,
        useRowSelect,
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
        });
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
    selectedFlatRows,
    } = TableInstance
    const {globalFilter} = state
    const {pageIndex, pageSize}= state
    return (
        <div className="container">
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}/>
         <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                    headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render("Header")}
                            <span>{column.isSorted? column.isSortedDesc? "▼" : "▲" : ""}</span>
                            {/* <div>{column.canFilter? column.render('Filter'):null}</div> */}
                        </th>  
                    ))
                }
                
              </tr>  
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {
                    page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                })}
                            </tr>
                        )
                    })
                }

            </tbody>

         </table>
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