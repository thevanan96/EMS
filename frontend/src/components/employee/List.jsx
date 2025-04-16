import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmployeeButtons , columns } from '../../utils/EmployeeHelper'
import DataTable from 'react-data-table-component'
import axios from 'axios'




const List = () => {
  const [employees, setEmployees] = useState([])
  const [empLoading, setEmpLoading] = useState(false)
  const [filterEmployee, setFilterEmployees] = useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true)
      try {
        const responnse = await axios.get('http://localhost:3000/api/employee',{
          headers: {
            "Authorization" : `Bearer ${localStorage.getItem('token')}`
          }
        } )
        console.log(responnse.data)
        if(responnse.data.success){
          let sno = 1;
          console.log(responnse.data)
          const data = await responnse.data.employees.map((emp) => (
           {
             _id: emp._id,
             sno: sno++,
             dep_name: emp.department.dep_name,
             name: emp.userId.name,
             dob: new Date(emp.dob).toLocaleDateString() ,
             profileImage: <img width={40} className='rounded-full' src={`http://localhost:3000/${emp.userId.profileImage}`} /> ,
             action: (<EmployeeButtons Id={emp._id} />),

           }
          ))

          // Update the state with the fetched data
        setEmployees(data);
        setFilterEmployees(data)
       // setFilteredDepartments(data)

        }
      } catch(error){
        if(error.response && !error.response.data.success){
          alert(error.response.data.error)
        }
      } finally {
        setEmpLoading(false)
      }
    };

    fetchEmployees();
  },[])

  // const handleFilter = () => {
  //   const records = employees.filter((emp) =>(
  //     emp.name.toLowerCase().includes(emp.target.value.toLowerCase())
  //   ))
  //   setFilterEmployees(records)
  // }

  const handleFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm)
    );
    setFilterEmployees(records);
  };
  



  return (
    <div className='p-6'>
          <div className='text-center' > 
        <h3 className='text-2xl font-bold'>Manage Employee</h3>
      </div>

      <div className='flex justify-between items-center'>
        <input
         type="text"
         placeholder='Search By Dep Name'
         className='px-4 py-0.5 border' 
         onChange={handleFilter}
         
         />
        <Link
         to="/admin-dashboard/add-employee" 
         className='px-4 py-1 bg-teal-600 rounded text-white'
         >
          Add New Empoyee
          </Link>
      </div>
      <div>
        <DataTable columns={columns} data={filterEmployee} pagination/>
      </div>
    </div>
  )
}

export default List