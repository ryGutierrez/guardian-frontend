import React,{useState} from 'react'
import './css/loggedin.css';

export const Loggedin= (props) =>{
  
  const LogOut =()=>{
    console.log("logOUt")
    localStorage.removeItem('user')
    props.onFormSwitch('login')
    localStorage.removeItem("watchlist")
  }
  return (
    <div className="LoggedIn">
        <b id = "username">{props.userName}</b>
        <button id ="logOut" onClick={LogOut}>Logout</button>
    </div>
  )
}
