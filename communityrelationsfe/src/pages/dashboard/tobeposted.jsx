import axios from "axios";
import config from "config";
import { useEffect, useState } from "react";

export default function ToBePosted() {
  const [historyData, setHistoryData] = useState([]);
  const [userPosition, setUserPosition] = useState('');

  useEffect(() => {
    axios.get(`${config.baseApi1}/request/history`)
      .then(response => setHistoryData(response.data))
      .catch(error => console.error('ERROR FETCHING FE:', error));

    const empInfo = JSON.parse(localStorage.getItem('user'));
    setUserPosition(empInfo?.emp_position || '');
  }, []);

  const handleEdit = (id) => {
    window.location.replace(`/comrel/editform?id=${id}`);
  };

  const handleView = (id) => {
    window.location.replace(`/comrel/viewform?id=${id}`);
  };

  const handleReview = (id) => {
    window.location.replace(`/comrel/review?id=${id}`);
  };

  const handleBack = () => {
    window.location.replace(`${config.baseUrl}/comrel/dashboard`);
  };

  return (
    <div style={feedContainerStyle}>
      <div style={headerStyle}>
        <h2>📄 Request Feed</h2>
        <button onClick={handleBack} style={backButtonStyle}>← Back</button>
      </div>

      {historyData.map(item => (
        <div key={item.request_id} style={postCardStyle}>
          <div style={postHeaderStyle}>
            <strong>{item.created_by}</strong> · <span>{new Date(item.date_Time).toLocaleString()}</span>
          </div>

          <SupportingDocs docsString={item.comm_Docs} requestId={item.request_id} />

          <div style={postContentStyle}>
            <p><strong>Status:</strong> {item.request_status}</p>
            <p><strong>Activity:</strong> {item.comm_Act}</p>
            <p><strong>Venue:</strong> {item.comm_Venue}</p>
            <p><strong>Area:</strong> {item.comm_Area}</p>
            <p><strong>Guest:</strong> {item.comm_Guest}</p>
            <p><strong>Emps:</strong> {item.comm_Emps}</p>
            <p><strong>Beneficiaries:</strong> {item.comm_Benef}</p>
          </div>

          <div style={dummySocialBar}>
            <button style={dummyButton}>👍 Like</button>
            <button style={dummyButton}>💬 Comment</button>
            <button style={dummyButton}>↗️ Share</button>
          </div>

          <div style={postActionsStyle}>
            {(userPosition !== "encoder" || item.request_status === "Reviewed") && (
              <>
                <button onClick={() => handleEdit(item.request_id)} style={actionButtonStyle}>✏️ Edit</button>
                <button onClick={() => handleView(item.request_id)} style={actionButtonStyle}>🔍 View</button>
              </>
            )}
            {userPosition !== "encoder" && (
              <button onClick={() => handleReview(item.request_id)} style={reviewButtonStyle}>✅ Review</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportingDocs({ docsString, requestId }) {
  if (!docsString) return null;

  const docs = docsString.split(',').map(f => f.trim());
  const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: docs.length === 1 ? '1fr' : docs.length === 2 ? '1fr 1fr' : '1fr 1fr',
        gridTemplateRows: docs.length === 3 ? '1fr 1fr' : 'auto',
        gap: '6px',
        width: '100%',
        aspectRatio: '1/1',
        overflow: 'hidden',
        borderRadius: '12px'
      }}>
        {docs.slice(0, 4).map((file, index) => {
          const defaultUrl = `${config.baseApi1}/files/${file}`;
          const fallbackUrl = `${config.baseApi1}/files/request_${requestId}/images/${file}`;

          return (
            <div key={index} style={{ width: '100%', height: '100%', position: 'relative' }}>
              {isImage(file) ? (
                <img
                  src={defaultUrl}
                  alt={`doc-${index}`}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = fallbackUrl;
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              ) : (
                <iframe
                  src={defaultUrl}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = fallbackUrl;
                  }}
                  title={`Document ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const feedContainerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f0f2f5',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const backButtonStyle = {
  background: '#4267B2',
  color: '#fff',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const postCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '15px',
  marginBottom: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
};

const postHeaderStyle = {
  fontSize: '14px',
  color: '#606770',
  marginBottom: '10px',
};

const postContentStyle = {
  fontSize: '15px',
  color: '#1c1e21',
  marginBottom: '10px',
};

const postActionsStyle = {
  marginTop: '10px',
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
};

const actionButtonStyle = {
  backgroundColor: '#1877F2',
  color: '#fff',
  padding: '6px 12px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const reviewButtonStyle = {
  backgroundColor: '#42b72a',
  color: '#fff',
  padding: '6px 12px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const dummySocialBar = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '10px',
  paddingTop: '10px',
  borderTop: '1px solid #ddd'
};

const dummyButton = {
  background: 'none',
  border: 'none',
  color: '#1877F2',
  fontWeight: 'bold',
  cursor: 'pointer'
};
