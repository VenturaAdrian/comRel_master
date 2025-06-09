import React, { useState } from 'react';
import axios from 'axios';
import config from "config";

export default function AuthRegister () {
    const [empFirstName, setEmpFirstName] = useState('');
    const [empLastName, setEmpLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [empPosition, setEmpPosition] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [empRole, setEmpRole] = useState('');

    const Register = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword ){
            console.log("passowrd not matched");
            return;
        }
        try{
            const response = await axios.post(`${config.baseApi}/users/register`,{
                    emp_firstname: empFirstName,
                    emp_lastname: empLastName,
                    user_name: userName,
                    emp_position: empPosition,
                    pass_word: password,
                    emp_role: empRole            
           });
           const userData = response.data;
                console.log("Response data: ", userData);
        }
        catch(error){
            console.error("Registration failed:", error.response?.data || error.message);
        }
    }





    return (

        <div>
            <form onSubmit={Register}>
                <div>
                   
                        <div>
                            <input
                                type="text"
                                className="input"
                                placeholder="First Name"
                                value={empFirstName}
                                onChange={(e) => setEmpFirstName(e.target.value)}
                                style={{ border: '1px solid lightgray', padding: '10px' }}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="input"
                                placeholder="Last Name"
                                value={empLastName}
                                onChange={(e) => setEmpLastName(e.target.value)}
                                style={{ border: '1px solid lightgray', padding: '10px' }}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="input"
                                placeholder="Username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                style={{ border: '1px solid lightgray', padding: '10px' }}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="input"
                                placeholder="Position"
                                value={empPosition}
                                onChange={(e) => setEmpPosition(e.target.value)}
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
                            <input
                                type="text"
                                className="input"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ border: '1px solid lightgray', padding: '10px' }}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="input"
                                placeholder="Role"
                                value={empRole}
                                onChange={(e) => setEmpRole(e.target.value)}
                                style={{ border: '1px solid lightgray', padding: '10px' }}
                            />
                        </div>
                        <div>
                            <button style={{ "fontSize":"13px","fontWeight":"bolder","color":"#354dd7",background:'##cdd5df',padding:'8px' }}>
                                Register
                            </button>
                        </div>
                   
                </div>
            </form>
        </div>
    )
    
  
}

