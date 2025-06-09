import React from 'react'

function testpafe() {
  const logout = () =>{
            localStorage.removeItem('user');
            window.location.replace('/');
        }   



  return (
    <div>

      <text>TEST PAGE</text>

      <button onClick={logout}>
            LOGOUT
        </button>
    </div>
  )
}

export default testpafe
