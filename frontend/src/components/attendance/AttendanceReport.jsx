


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceReport = () => {
  const [report, setReport] = useState({});
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ limit, skip });
      if (dateFilter) {
        query.append('date', dateFilter);
      }
      const response = await axios.get(`http://localhost:3000/api/attendance/report?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('API Response:', response.data);

      if (response.data.success) {
        if (skip === 0) {
          setReport(response.data.groupData);
        } else {
          setReport((prevData) => ({ ...prevData, ...response.data.groupData }));
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Error fetching report: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [skip, dateFilter]);

  const handleLoadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  return (
    <div className="min-h-screen p-10 bg-white">
      <h2 className="text-center text-2xl font-bold">Attendance Report</h2>
      <div>
        <h2 className="text-xl font-semibold">Filter by Date</h2>
        <input
          type="date"
          className="border bg-gray-100 p-2 rounded"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        Object.entries(report).map(([date, record]) => (
          <div className="mt-4 border-b" key={date}>
            <h2 className="text-xl font-semibold">{date}</h2>
            <table className="" border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {record.map((data, i) => (
                  <tr key={data.employeeId}>
                    <td>{i + 1}</td>
                    <td>{data.employeeId}</td>
                    <td>{data.employeeName}</td>
                    <td>{data.departmentName}</td>
                    <td>{data.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
      <button
        className="px-4 py-2 border bg-gray-100 text-lg font-semibold mt-4"
        onClick={handleLoadMore}
      >
        Load More
      </button>
    </div>
  );
};

export default AttendanceReport;