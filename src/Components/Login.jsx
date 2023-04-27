import React,{useState} from 'react'
import './css/login.css';
import axios from 'axios';
export const Login= (props) =>{
    const [username,setUsername] = useState('');
    const [pass,setPass] = useState('');

    const getWatchList=async (id)=>{
      await axios.get('/getwatchlist/'+id)
      .then((response) =>{
        const res = response.data.map(obj => obj.IncidentId);
        localStorage.setItem("watchlist",JSON.stringify(res))
      })
    }
    //this is where you would send the login to the backend.
    const handleSubmit = async (e) =>{
        e.preventDefault();
        let response = await fetch('/login', { // responds 200 OK if login successful, otherwise 400 error
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
          
          await getWatchList(data.user.userID)
          let raw = await fetch(`http://localhost:3001/userCounties/${data.user.userID}`);
          let res = await raw.json();
          res = res.map(c => c.name);
          // console.log('saved counties: ', res);
          localStorage.setItem('counties', JSON.stringify(res));
          console.log(localStorage.getItem('watchlist'),"watchlist")
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
