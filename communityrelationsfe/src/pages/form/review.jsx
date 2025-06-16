import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';


export default function Review() {
  const requestID = new URLSearchParams(window.location.search).get('id');
  const [formData, setFormData] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState('');

  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  

  // Get form data + comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestRes = await axios.get(`${config.baseApi1}/request/editform`, {
          params: { id: requestID }
        });
        setFormData(requestRes.data);

        const commentsRes = await axios.get(`${config.baseApi1}/request/comment/${requestID}`);
        setComments(commentsRes.data);
    
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (requestID) {
      fetchData();
    }

    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (empInfo?.user_name) 
        setCurrentUser(empInfo.user_name);

  }, [requestID]);



const handleCommentSubmit = async (e) => {
  e.preventDefault();

  try {
    // First, add the comment
    await axios.post(`${config.baseApi1}/request/comment`, {
      comment,
      created_by: currentUser,
      request_id: requestID
    });

    setComment('');

    // Refresh comments list
    const res = await axios.get(`${config.baseApi1}/request/comment/${requestID}`);
    setComments(res.data);

    // Then, update the request status to 'declined'
    const declineRes = await axios.post(`${config.baseApi1}/request/comment-decline`, {
      request_status: 'Reviewed',      // Set the new status explicitly
      request_id: requestID,
      currentUser: currentUser
    });

    console.log('Decline response:', declineRes.data);

    // Refresh the request form data (optional)
    const requestRes = await axios.get(`${config.baseApi1}/request/editform`, {
      params: { id: requestID }
    });
    setFormData(requestRes.data);

  } catch (err) {
    console.error('Error submitting comment or declining request:', err);
  }
};

  const HandleBack = () => {
    window.location.replace(`${config.baseUrl}/comrel/history`);
  }

  const handleDecline = () => {
    setShowComments(true); // Show comments and input
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true);  
  }

  const confirmDelete = async () => {

    try{
      await axios.get(`${config.baseApi1}/request/delete-request`,{
        params: {request_id: requestID, 
          comm_Docs: formData.comm_Docs,
          
        }
      })
      alert("Request deleted successfully.");
      window.location.replace(`${config.baseUrl}/comrel/history`);
    }catch(err){
      console.error('Failed to delete request:', err);
      alert('Failed to delete this request')
    }
  }


  const handleAccept = async () => {
  try {
    const res = await axios.post(`${config.baseApi1}/request/accept`, {
      request_status: 'Accepted',
      request_id: requestID,
      currentUser: currentUser
    });

    alert(res.data.message || "Request accepted successfully.");
    
    // Refresh form data
    const requestRes = await axios.get(`${config.baseApi1}/request/editform`, {
      params: { id: requestID }
    });
    setFormData(requestRes.data);
    
  } catch (error) {
    console.error('Failed to accept request:', error);
    alert('Failed to accept this request.');
  }
};

   return (
    <div>
      <h2>Review Page</h2>

      {formData ? (
        <div>
          <h3>ID: {formData.request_id}</h3>
          <h3>Status: {formData.request_status}</h3>
          <h3>Community: {formData.comm_Area}</h3>
          <h3>Activity: {formData.comm_Act}</h3>
          <h3>Date/Time: {formData.date_Time}</h3>
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
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileTrimmed);
                            
                            const fileUrl = `${config.baseApi1}/files/${fileTrimmed}`;
                            const fileUrl1 = `${config.baseApi1}/files/request_${formData.request_id}/images/${fileTrimmed}`;

                            return (
                              <div key={index} style={{ width: '200px' }}>
                                {isImage ? (
                                  <img
                                    src={fileUrl}
                                    alt={`Document ${index + 1}`}
                                    onError={(e)=> {
                                      e.target.onerror = null; 
                                      e.target.src = fileUrl1;
                                    }}
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

      {/* All comments always visible */}
      <div>
        <h3>All Comments</h3>
        {comments.length > 0 ? (
          <ul>
            {comments.map((cmt) => (
              <li key={cmt.comment_id}>
                <strong>{cmt.created_by}</strong> ({new Date(cmt.created_at).toLocaleString()}):<br />
                {cmt.comment}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      {/* Show comment input only when declining */}
      {showComments && (
        <div>
          <label>Comment / Feedback</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>Submit Comment</button>
        </div>
      )}

      <div>
        <button onClick={HandleBack}>BACK</button>
      </div>
      <div>
        <button onClick={handleDecline}>DECLINE</button>
        <button onClick={handleDelete}>DELETE</button>
        <button onClick={handleAccept}>ACCEPT</button>
      </div>

      {showDeleteConfirm && (
        <div style={{ marginTop: '10px', backgroundColor: '#eee', padding: '10px', border: '1px solid #ccc' }}>
          <p>Are you sure you want to delete this request?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={() => setShowDeleteConfirm(false)}>No</button>
        </div>
      )}
    </div>
  );
}
