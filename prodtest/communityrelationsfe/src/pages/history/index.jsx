import axios from "axios";
import config from "config";
import { useEffect, useState } from "react"

export default function History() {

    const [historyData, setHistoryData] = useState([]);
    const [userPosition, setUserPosition] = useState('');

    useEffect(() =>{
        axios.get(`${config.baseApi1}/request/history`)
        .then(response => {
            setHistoryData(response.data);
        })
        .catch(error => {
            console.error('ERROR FETCHING FE:', error);
        })

        const empInfo = JSON.parse(localStorage.getItem('user'));
        setUserPosition(empInfo.emp_positions)
    },[])

    const handleEdit = (item) => {
  const params = new URLSearchParams({
    id: item.request_id,
  });

  window.location.replace(`/comrel/editform?${params.toString()}`);
};

const handleView = (item) => {
const params = new URLSearchParams({
  id: item.request_id,
});

window.location.replace(`/comrel/viewform?${params.toString()}`);

}





   return (
  <div style={{ padding: '20px' }}>
    <h2>Request History</h2>
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <thead>
        <tr style={{ background: '#f5f5f5' }}>
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
        {userPosition !== "encoder" && <th style={thStyle}>Action</th>}
         {userPosition !== "encoder" && <th style={thStyle}>Comment</th>}
        </tr>
      </thead>
      <tbody>
        {historyData.map((item) => (
          <tr key={item.request_id}>
            <td style={tdStyle}>{item.request_id}</td>
            <td style={tdStyle}>{item.request_status}</td>
            <td style={tdStyle}>{item.comm_Act}</td>
            <td style={tdStyle}>{item.comm_Venue}</td>
            <td style={tdStyle}>{item.date_Time}</td>
            <td style={tdStyle}>{item.comm_Area}</td>
            <td style={tdStyle}>{item.comm_Guest}</td>
            <td style={tdStyle}>{item.comm_Docs}</td>
            <td style={tdStyle}>{item.comm_Emps}</td>
            <td style={tdStyle}>{item.comm_Benef}</td>
            <td style={tdStyle}>{item.created_by}</td>
            {userPosition !== "encoder" &&<td style={tdStyle}>
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleView(item)}>View</button>
            </td>}
            {userPosition !== "encoder" &&<td style={tdStyle}>
              <input>
              </input>
            </td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


}const thStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  fontWeight: 'bold',
  textAlign: 'left'
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};