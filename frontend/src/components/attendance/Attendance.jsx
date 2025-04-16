import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AttendanceHelper, columns } from '../../utils/AttendanceHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterAttendance, setFilterAttendance] = useState([]);

  // Function to fetch attendance data
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/attendance', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data);
      if (response.data.success) {
        let sno = 1;
        const data = response.data.attendance.map((att) => ({
          employeeId: att.employeeId.employeeId,
          sno: sno++,
          department: att.employeeId.department.dep_name,
          name: att.employeeId.userId.name,
          action: (
            <AttendanceHelper
              status={att.status}
              employeeId={att.employeeId.employeeId}
              statusChange={fetchAttendance} // Refresh attendance data after status change
            />
          ),
        }));

        // Update the state with the fetched data
        setAttendance(data);
        setFilterAttendance(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance data on component mount
  useEffect(() => {
    fetchAttendance();
  }, []);

  // Handle filtering of attendance data
  const handleFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const records = attendance.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm)
    );
    setFilterAttendance(records);
  };

  if (!filterAttendance) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Attendance</h3>
      </div>

      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search By Dep Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />

        <p className="text-2xl">
          Mark Employees for{' '}
          <span className="text-zxl font-bold underline">
            {new Date().toISOString().split('T')[0]}{' '}
          </span>
        </p>
        <Link
          to="/admin-dashboard/attendance-report"
          className="px-4 py-1 bg-teal-600 rounded text-white"
        >
          Attendance Report
        </Link>
      </div>
      <div>
        <DataTable columns={columns} data={filterAttendance} pagination />
      </div>
    </div>
  );
};

export default Attendance;