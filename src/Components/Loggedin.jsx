import React,{useState,useEffect} from 'react'
import './css/loggedin.css';

export const Loggedin= (props) =>{

  const LogOut =()=>{
    console.log("logOut");
    props.onFormSwitch('login');
    localStorage.clear();
  }

  return (
    <div className="LoggedIn">
        <b id = "username">{props.userName}</b>
        <button id ="logOut" onClick={LogOut}>Logout</button>
    </div>
  )
}
