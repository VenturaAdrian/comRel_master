import axios from "axios";
import config from "config";
import { useEffect, useState } from "react";

export default function ViewForm() {
  const params = new URLSearchParams(window.location.search);
  const requestID = params.get("id");

  const [formData, setFormData] = useState(null);

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
  }, [requestID]);
  
  const handleback = () => {
    window.location.replace(`${config.baseUrl}/comrel/history`);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Request ID: {requestID}</h2>
      <button onClick={handleback}>back</button>
      {formData ? (
        <div>
          <h3>Status: {formData.request_status}</h3>
          <h3>Community/Barangay: {formData.comm_Area}</h3>
          <h3>Type of Activity: {formData.comm_Act}</h3>
          <h3>Date and Time: {formData.date_Time}</h3>
          <h3>Venue: {formData.comm_Venue}</h3>
          <h3>Guests: {formData.comm_Guest}</h3>
          <h3>Employees: {formData.comm_Emps}</h3>
          <h3>Beneficiaries: {formData.comm_Benef}</h3>

          {formData.comm_Docs && (
            <div>
              <h3>Supporting Documents:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {formData.comm_Docs.split(',').map((file, index) => {
                  const fileTrimmed = file.trim();
                  const fileUrl = `${config.baseApi1}/files/${fileTrimmed}`;
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileTrimmed);

                  return (
                    <div key={index} style={{ width: '200px' }}>
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={`Document ${index + 1}`}
                          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                      ) : (
                        <iframe
                          src={fileUrl}
                          width="100%"
                          height="200px"
                          title={`Document ${index + 1}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading request data...</p>
      )}
    </div>
  );
}
