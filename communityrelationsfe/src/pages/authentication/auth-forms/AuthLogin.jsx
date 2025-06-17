
import axios from "axios";
import config from "config";
import { useState } from "react";




export default function AuthLogin() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState([]);


  const Auth = async (e) => {
    e.preventDefault();
    try{
    await axios.get(`${config.baseApi}/users/login`,{
      params: {
              user_name: username,
              password: password
      }         
      }).then((res) => {

        if(!res.error){
          const items = [];
          console.log("Response data:", res.data)
          setUserInfo({...res.data});

          localStorage.setItem('user', JSON.stringify(res.data)); //to store in local storage'user'

          console.log("GETTING USER CREDENTIALS", localStorage.getItem('user'))
          if(localStorage.getItem('user')){
            const checkUser = JSON.parse(localStorage.getItem('user'));
          if(checkUser.role === 'Admin'){
            setUserInfo({...checkUser})
          }
          }
            items.push({id:0, value: 'Login'})
            localStorage.setItem('status', JSON.stringify(items));
            console.log("User info: " ,localStorage.getItem('user'))
            window.location.replace(`${config.baseUrl}/comrel/dashboard`);
            

        }
      });


    }catch(err){
      console.log('error')
    }
  }



 const handleRoute = () => {
    window.location.replace(`${config.baseUrl}/comrel/register`);
  };


  return (
    <div>
      <h2>TEST LOG IN ROUTE :::::</h2>

      <form onSubmit={Auth}>
        <div>
          <input
            type="text"
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ border: '1px solid lightgray', padding: '10px' }}
          />
        </div>
       <div>
          <input
            type="text"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ border: '1px solid lightgray', padding: '10px' }}
          />
        </div>
        <div>
          <button
            type="submit"
            style={{
              fontSize: "13px",
              fontWeight: "bolder",
              color: "#354dd7",
              background: "#cdd5df",
              padding: "8px"
            }}
          >
            Login
          </button>

        </div>
         
      </form>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleRoute}
          style={{
            fontSize: "13px",
            fontWeight: "bolder",
            color: "#ffffff",
            background: "#4CAF50",
            padding: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          REGISTER
        </button>
      </div>
    </div>
   
  );
}