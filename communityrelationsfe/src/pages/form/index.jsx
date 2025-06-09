// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import config from "config";

// export default function AddForm() {
//   const [commArea, setCommArea] = useState('');
//   const [commAct, setCommAct] = useState('');
//   const [dateTime, setDateTime] = useState('');
//   const [commVenue, setCommVenue] = useState('');
//   const [commGuest, setCommGuest] = useState('');
//   const [commDocs, setCommDocs] = useState('');
//   const [commEmps, setCommEmps ] = useState('');
//   const [commBenef, setCommBenef] = useState('');
// const [createdby, setCreatedBy] = useState('');
// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

//  useEffect(() => {
//     const empInfo = JSON.parse(localStorage.getItem('user'));
//     if (empInfo && empInfo.user_name) {
//       setCreatedBy(empInfo.user_name);
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = [
//         commArea,
//         commAct,
//         dateTime,
//         commVenue,
//         commGuest,
//         commDocs,
//         commEmps,
//         commBenef,
//         createdby
//     ]
//     console.log('Form submitted:', formData);
//     try{
//         const response = await axios.post(`${config.baseApi1}/request/add-request-form`,{
//             comm_Area: commArea,
//             comm_Act: commAct,
//             date_Time: dateTime,
//             comm_Venue: commVenue,
//             comm_Guest: commGuest,
//             comm_Docs: commDocs,
//             comm_Emps: commEmps,
//             comm_Benef: commBenef,
//             created_by: createdby
//         });
//         const requestData = response.data;
//         console.log("Response data:", requestData);
//     }catch(err){
//         console.log('error')
//     }




//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Add Form Page</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '10px' }}>
//           <label>
//             Community Area/Barangay
//             <input
//               type="text"
//               name="commArea"
//               value={commArea}
//               onChange={(e) => setCommArea(e.target.value)}
//               style={{ marginLeft: '10px' }}
//               required
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>
//             Type of Community Activity
//             <input
//               type="text"
//               name="commAct"
//               value={commAct}
//               onChange={(e) => setCommAct(e.target.value)}
//               style={{ marginLeft: '10px' }}
//               required
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>
//             Date and Time:
//             <input
//               type="text"
//               name="name"
//               value={dateTime}
//               onChange={(e) => setDateTime(e.target.value)}
//               style={{ marginLeft: '10px' }}
//               required
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>
//             Venue/Place
//             <input
//               type="text"
//               name="commVenue"
//               value={commVenue}
//               onChange={(e) => setCommVenue(e.target.value)}
//               style={{ marginLeft: '10px' }}
//               required
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>
//             Guests and People Involved
//             <input
//               type="text"
//               name="commGuest"
//               value={commGuest}
//               onChange={(e) => setCommGuest(e.target.value)}
//               style={{ marginLeft: '10px' }}
//               required
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>
//             Supporting documents
//             <input
//               type="text"
//               name="commDocs"
//               value={commDocs}
//               onChange={(e) => setCommDocs(e.target.value)}
//               style={{ marginLeft: '10px' }}
//               required
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>
//             COMREL Employees Involed
//             <input
//               type="text"
//               name="commEmps"
//               value={commEmps}
//               onChange={(e) => setCommEmps(e.target.value)}
//               style={{ marginLeft: '10px' }}
//               required
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>
//             Beneficiaries
//             <input
//               type="text"
//               name="commBenef"
//               value={commBenef}
//               onChange={(e) => setCommBenef(e.target.value)}
//               style={{ marginLeft: '10px' }}
//               required
//             />
//           </label>
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }



import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from "config";

export default function AddForm() {
  const [commArea, setCommArea] = useState('');
  const [commAct, setCommAct] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [commVenue, setCommVenue] = useState('');
  const [commGuest, setCommGuest] = useState('');
  const [commDocs, setCommDocs] = useState(null); // file object
  const [commEmps, setCommEmps] = useState('');
  const [commBenef, setCommBenef] = useState('');
  const [createdby, setCreatedBy] = useState('');

  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (empInfo && empInfo.user_name) {
      setCreatedBy(empInfo.user_name);
    }
  }, []);

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

    if (commDocs) {
      formData.append('comm_Docs', commDocs);
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
          <input type="text" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
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
          <input type="file" onChange={(e) => setCommDocs(e.target.files[0])} />
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
    </div>
  );
}