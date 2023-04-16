import React,{useState} from 'react'
import './css/login.css';

export const Login= (props) =>{
    const [username,setUsername] = useState('');
    const [pass,setPass] = useState('');


    //this is where you would send the login to the backend.
    const handleSubmit = async (e) =>{
        e.preventDefault();
        let response = await fetch('http://localhost:3001/login', { // responds 200 OK if login successful, otherwise 400 error
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: pass,
          }),
        });
        const data = await response.json(); // use await response.json() to extract detailed messages from response
        console.log(data.user.userID)
        if(response.status===200){
          localStorage.setItem('user', username)
          localStorage.setItem('userID',data.user.userID)
          props.onFormSwitch(username)
        }
    }
  return (
    <div className = "login">
      <form onSubmit = {handleSubmit}> 
        <label htmlFor="username">Username</label>
        <input value = {username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder='username' id="username" name = "username"></input>

        <label htmlFor="password">Password</label>
        <input value = {pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder='*********' id = "password" name = "password"></input>

        <button id = "loginbtn">Login</button>
      </form>
      <button id ="switchbtn" onClick={()=>props.onFormSwitch('register')}>Don't have an account?</button>
    </div>
  )
}
