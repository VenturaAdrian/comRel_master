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
        </div>
      ) : (
        <p>Loading request data...</p>
      )}

      {/* Conditionally render comment section */}
      {showComments && (
        <>
          <div>
            <label>Comment / Feedback</label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>Submit Comment</button>
          </div>

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
        </>
      )}

      <div>
        <button onClick={HandleBack}>BACK</button>
      </div>
      <div>
        <button onClick={handleDecline}>DECLINE</button>
        <button>ACCEPT</button>
      </div>
    </div>
  );
}
