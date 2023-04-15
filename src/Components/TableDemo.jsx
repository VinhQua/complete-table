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
import React from 'react';

 
const Styles = styled.div`
  .table {
    border: 1px solid #ddd;
 
    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }
 
    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;
 
      :last-child {
        border-right: 0;
      }
    }
 
    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }
 
      .header {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }
 
      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }
 
      .body {
        position: relative;
        z-index: 0;
      }
 
      [data-sticky-td] {
        position: sticky;
      }
 
      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }
 
      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`;
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
 function TableDemo() {
    const [students, setStudents] = useState([]);
    const fetchStudents = async () => {
     const response = await axios.get("http://localhost:3000/database/Student_info.json")
     .catch(err => console.log(err));
     if (response) {
         //console.log(response.data);
         setStudents(response.data);
    }
     }
     fetchStudents()
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
 
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useBlockLayout,
    useSticky,
  );
 
  // Workaround as react-table footerGroups doesn't provide the same internal data than headerGroups
  const footerGroups = headerGroups.slice().reverse();
 
  return (
    <Styles>
      <div {...getTableProps()} className="table sticky" style={{ width: 1000, height: 500 }}>
        <div className="header">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="body">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => (
                  <div {...cell.getCellProps()} className="td">
                    {cell.render('Cell')}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="footer">
          {footerGroups.map((footerGroup) => (
            <div {...footerGroup.getHeaderGroupProps()} className="tr">
              {footerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="td">
                  {column.render('Footer')}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Styles>
  );
}
 export default TableDemo;