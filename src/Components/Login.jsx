import React,{useState} from 'react'
import './css/login.css';
export const Login= (props) =>{
    const [email,setEmail] = useState('');
    const [pass,setPass] = useState('');
    //this is where you would send the login to the backend.
    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(email);

    }
  return (
    <div className = "login">
      <form onSubmit = {handleSubmit}> 
        <label htmlFor="email">Email</label>
        <input value = {email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='email@gmail.com' id="email" name = "email"></input>

        <label htmlFor="password">Password</label>
        <input value = {pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder='*********' id = "password" name = "password"></input>

        <button id = "loginbtn">Login</button>
      </form>
      <button id ="switchbtn" onClick={()=>props.onFormSwitch('register')}>Don't have an account?</button>
    </div>
  )
}
