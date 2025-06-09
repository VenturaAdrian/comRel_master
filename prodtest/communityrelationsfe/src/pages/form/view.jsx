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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Request ID: {requestID}</h2>
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
              <h3>Supporting Document:</h3>
              <iframe
                src={`${config.baseApi1}/files/${formData.comm_Docs}`}
                width="100%"
                height="600px"
                title="Supporting Document"
              />
              <p>
                <a href={`${config.baseApi1}/files/${formData.comm_Docs}`} download>
                  Download Document
                </a>
              </p>
            </div>
          )}
        </div>
      ) : (
        <p>Loading request data...</p>
      )}
    </div>
  );
}
