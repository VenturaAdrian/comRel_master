import axios from "axios";
import config from "config";
import { useEffect, useState } from "react";

export default function Reports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${config.baseApi1}/request/history`)
      .then(response => {
        setData(response.data); // Expecting an array of records
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const thStyle = { border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" };
  const tdStyle = { border: "1px solid #ddd", padding: "8px" };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Activity</th>
            <th style={thStyle}>Venue</th>
            <th style={thStyle}>Date/Time</th>
            <th style={thStyle}>Area</th>
            <th style={thStyle}>Guest</th>
            <th style={thStyle}>Docs</th>
            <th style={thStyle}>Emps</th>
            <th style={thStyle}>Beneficiaries</th>
            <th style={thStyle}>Created By</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={tdStyle}>{row.request_id}</td>
              <td style={tdStyle}>{row.request_status}</td>
              <td style={tdStyle}>{row.comm_Act}</td>
              <td style={tdStyle}>{row.comm_Venue}</td>
              <td style={tdStyle}>{row.date_Time}</td>
              <td style={tdStyle}>{row.comm_Area}</td>
              <td style={tdStyle}>{row.comm_Guest}</td>
              <td style={tdStyle}>{row.comm_Docs}</td>
              <td style={tdStyle}>{row.comm_Emps}</td>
              <td style={tdStyle}>{row.comm_Benef}</td>
              <td style={tdStyle}>{row.created_by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
