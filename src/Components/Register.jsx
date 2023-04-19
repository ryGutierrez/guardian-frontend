import React,{useState} from 'react'
import './css/register.css';

export const Register= (props) =>{
    const [email,setEmail] = useState('');
    const [pass,setPass] = useState('');
    const [name,setName] = useState('');

    //this is where you would send the register to the backend.
    const handleSubmit = async (e) =>{
        e.preventDefault();
        let response = await fetch('/signup', { // send username, email, and plaintext password through POST body to be encrypted server-side
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: name,
            email: email,
            password: pass,
          }),
        });
        //persistant login for the user.
        console.log(await response.json());
        props.onFormSwitch('login')
    }
  return (
    <div className = "register">
      <form onSubmit = {handleSubmit}> 
        <label htmlFor="name">Name</label>
        <input value = {name} onChange={(e) => setName(e.target.value)} type="name" placeholder='name' id="name" name = "name"></input>

        <label htmlFor="email">email</label>
        <input value = {email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='email@gmail.com' id="email" name = "email"></input>

        <label htmlFor="password">password</label>
        <input value = {pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder='*********' id = "password" name = "password"></input>

        <button id = "registerbtn">Register</button>
      </form>
      <button id ="switchbtn" onClick={()=>props.onFormSwitch('login')}>Already have an account?</button>
    </div>
  )
}