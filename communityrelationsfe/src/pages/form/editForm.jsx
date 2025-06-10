import axios from "axios";
import config from "config";
import { useEffect, useState } from "react";

export default function EditForm() {
  const params = new URLSearchParams(window.location.search);
  const requestID = params.get("id");

  const [formData, setFormData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]); // multiple files
   const [createdby, setCreatedBy] = useState('');

  useEffect(() => {
    if (requestID) {
      axios.get(`${config.baseApi1}/request/editform`, {
        params: { id: requestID }
      })
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => {
        console.error("Error fetching request data:", error);
      });
    }
    //GET CURRENT USER
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (empInfo?.user_name) {
      setCreatedBy(empInfo.user_name);
    }

    const formData = new FormData();
    formData.append('created_by', createdby)
  }, [requestID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]); // convert FileList to array
  };

  const handleBack = () => {
    window.location.replace(`${config.baseUrl}/comrel/history`);
  };

  const handleSave = () => {
    const data = new FormData();

    for (const key in formData) {
      if (formData[key] !== undefined && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }
      data.append("created_by", createdby);


    if (selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("comm_Docs", selectedFiles[i]);
      }
    } else {
      // If no new files, send existing file info to preserve
      data.append("existingFileName", formData.comm_Docs);
    }

    axios.post(`${config.baseApi1}/request/updateform`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      alert('Request updated successfully!');
    })
    .catch(err => {
      console.error("Update error:", err);
      alert("Failed to update request.");
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Request: {requestID}</h2>
      {formData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
          <label>
            Request Status:
            <input name="request_status" value={formData.request_status} onChange={handleChange} />
          </label>
          <label>
            Community Area:
            <input name="comm_Area" value={formData.comm_Area} onChange={handleChange} />
          </label>
          <label>
            Community Activity:
            <input name="comm_Act" value={formData.comm_Act} onChange={handleChange} />
          </label>
          <label>
            Date & Time:
            <input name="date_Time" value={formData.date_Time} onChange={handleChange} />
          </label>
          <label>
            Venue:
            <input name="comm_Venue" value={formData.comm_Venue} onChange={handleChange} />
          </label>
          <label>
            Guest:
            <input name="comm_Guest" value={formData.comm_Guest} onChange={handleChange} />
          </label>
          <label>
            Replace Documents:
            <input type="file" name="comm_Docs" multiple onChange={handleFileChange} />
            {formData.comm_Docs && selectedFiles.length === 0 && (
              <small>Current: {formData.comm_Docs}</small>
            )}
          </label>
          <label>
            Employees:
            <input name="comm_Emps" value={formData.comm_Emps} onChange={handleChange} />
          </label>
          <label>
            Beneficiaries:
            <input name="comm_Benef" value={formData.comm_Benef} onChange={handleChange} />
          </label>

          <div style={{ marginTop: '20px' }}>
            <button onClick={handleSave}>SAVE</button>
            <button onClick={handleBack} style={{ marginLeft: '10px' }}>BACK</button>
          </div>
        </div>
      ) : (
        <p>Loading request data...</p>
      )}
    </div>
  );
}
