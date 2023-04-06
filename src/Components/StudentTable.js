import { useEffect, useMemo, useState } from "react";
import './table.css';
import axios from "axios";
import { useTable } from "react-table";
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
        return {
            Header: capitalizeFirstLetter(key.replaceAll("_", " ")),
            Footer: capitalizeFirstLetter(key.replaceAll("_", " ")),
            accessor: key
        }
    }):[],[students]);
    const data = useMemo(()=> [...students],[students] )
    const TableInstance = useTable({columns,data});
    console.log(columns);
    useEffect(()=>{
    fetchStudents()}, []);
    const {getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    } = TableInstance
    return (
        <div className="container">
         <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                    headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>
                            {column.render("Header")}
                        </th>  
                    ))
                }
                
              </tr>  
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {
                    rows.map((row, i) => {
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
            <tfoot>
                {
                    footerGroups.map(footerGroup => (
                        <tr {...footerGroup.getFooterGroupProps()}>
                            {footerGroup.headers.map(column => (
                                <td {...column.getFooterProps()}>{column.render("Footer")}</td>
                            ))}
                        </tr>
                    ))
                }
            </tfoot>
         </table>
        </div>
    )
    
}