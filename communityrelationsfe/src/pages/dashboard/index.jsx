import { useEffect, useState } from "react";
import axios from "axios";
import config from "config";


export default function DashboardDeafult() {
   const [position, setPosition] = useState('');

        const empInfo = JSON.parse(localStorage.getItem('user'));
        console.log(empInfo);
        console.log(empInfo.emp_position);

        const logout = () =>{
            localStorage.removeItem('user');
            window.location.replace('/');
        }   

        const checkPosition = () => {
            if(empInfo.emp_position === 'encoder'){
            window.location.replace(`${config.baseUrl}/comrel/addform`);
            }
            else{
                return;
            }
        }

        const handleHistory = () => {
            
            window.location.replace(`${config.baseUrl}/comrel/history`);
            
        }

        const handleReports = () => {
            window.location.replace(`${config.baseUrl}/comrel/reports`);
        }

        const handleToBePosted = () => {
            window.location.replace(`${config.baseUrl}/comrel/tobeposted`);
        }
        const handletestpage = () => {
            window.location.replace(`${config.baseUrl}/comrel/test`);
        }

    return(
     <div>
        <text>'WELCOME' {empInfo.first_name}{empInfo.last_name}</text>
        <text>{position}</text>
        <button onClick={logout}>
            LOGOUT
        </button>
        <button onClick={checkPosition}>
            ADD FORM 
        </button>
        <button onClick={handleHistory}>
            History 
        </button>
        <button onClick={handleReports}>
            Reports 
        </button>
        <button onClick={handleToBePosted}>
            To Be Posted
        </button>
        <button onClick={handletestpage}>
            TEST LOGIN
        </button>
     </div>   
    )
    
}