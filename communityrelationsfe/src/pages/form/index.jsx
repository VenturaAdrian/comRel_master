import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from "config";

export default function AddForm() {
  const [commArea, setCommArea] = useState('');
  const [commAct, setCommAct] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [commVenue, setCommVenue] = useState('');
  const [commGuest, setCommGuest] = useState('');
  const [commDocs, setCommDocs] = useState([]); // file object
  const [commEmps, setCommEmps] = useState('');
  const [commBenef, setCommBenef] = useState('');
  const [createdby, setCreatedBy] = useState('');

  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (empInfo?.user_name) {
      setCreatedBy(empInfo.user_name);
    }
  }, []);

  const handleBack = () => {
    window.location.replace(`${config.baseUrl}/comrel/dashboard`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('comm_Area', commArea);
    formData.append('comm_Act', commAct);
    formData.append('date_Time', dateTime);
    formData.append('comm_Venue', commVenue);
    formData.append('comm_Guest', commGuest);
    formData.append('comm_Emps', commEmps);
    formData.append('comm_Benef', commBenef);
    formData.append('created_by', createdby);

    for (let i = 0; i < commDocs.length; i++) {
      formData.append('comm_Docs', commDocs[i]);
    }

    try {
      const response = await axios.post(`${config.baseApi1}/request/add-request-form`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Response:", response.data);
      alert("Form submitted successfully!");
    } catch (err) {
      console.error('Error submitting form:', err);
      alert("Failed to submit.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add Form Page</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Community Area/Barangay</label>
          <input type="text" value={commArea} onChange={(e) => setCommArea(e.target.value)} required />
        </div>
        <div>
          <label>Type of Community Activity</label>
          <input type="text" value={commAct} onChange={(e) => setCommAct(e.target.value)} required />
        </div>
        <div>
          <label>Date and Time</label>
          <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
        </div>
        <div>
          <label>Venue/Place</label>
          <input type="text" value={commVenue} onChange={(e) => setCommVenue(e.target.value)} required />
        </div>
        <div>
          <label>Guests and People Involved</label>
          <input type="text" value={commGuest} onChange={(e) => setCommGuest(e.target.value)} required />
        </div>
        <div>
          <label>Supporting Document</label>
          <input type="file" multiple onChange={(e) => setCommDocs(e.target.files)} />
        </div>
        <div>
          <label>COMREL Employees Involved</label>
          <input type="text" value={commEmps} onChange={(e) => setCommEmps(e.target.value)} required />
        </div>
        <div>
          <label>Beneficiaries</label>
          <input type="text" value={commBenef} onChange={(e) => setCommBenef(e.target.value)} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div><button onClick={handleBack}>Home</button></div>
    </div>
  );
}
