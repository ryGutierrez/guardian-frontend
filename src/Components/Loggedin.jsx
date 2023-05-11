import React,{useEffect, useState, useRef} from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import './css/loggedin.css';

export const Loggedin = (props) =>{

  const [showAccount, setShowAccount] = useState(false);
  const [editNumber, setEditNumber] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [notifyPhone, setNotifyPhone] = useState(localStorage.getItem('notificationStyle') ? localStorage.getItem('notificationStyle').includes('phone') : '');
  const [editNotifyPhone, setEditNotifyPhone] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(localStorage.getItem('notificationStyle') ? localStorage.getItem('notificationStyle').includes('email') : '');
  const [editNotifyEmail, setEditNotifyEmail] = useState(false);


  const emailRef = useRef();
  const passwordRef = useRef();
  const numberRef = useRef();

  const toggleAccount = () => {
    setShowAccount(!showAccount)
    setEditEmail(false);
    setEditNumber(false);
  }

  const toggleEditEmail = () => {
    setEditEmail(!editEmail);
  }

  const toggleEditNumber = () => {
    setEditNumber(!editNumber);
  }

  const saveAccount = async () => {
    if(!editEmail && !editNumber && !editNotifyEmail && !editNotifyPhone) {
      toggleAccount();
      return;
    }

    if(passwordRef.current.value === '') {
      alert("Please enter your password to make changes to your account.");
      return;
    }

    let newEmail = emailRef.current ? emailRef.current.value : null;
    let newNumber = numberRef.current ? numberRef.current.value : null;
    let password = passwordRef.current.value;
    let notificationStyle = `${notifyEmail ? 'email' : ''}${notifyEmail && notifyPhone ? ',' : ''}${notifyPhone ? 'phone' : ''}`;    

    let res = await fetch('/editAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: localStorage.getItem('userID'),
        password: password,
        email: newEmail,
        number: newNumber,
        notificationStyle: notificationStyle,
      }),
    });
    console.log('res: '+res.status);
    if(res.status == 200) {
      if(newEmail){
        localStorage.setItem('email', newEmail);
      } if(newNumber) {
        localStorage.setItem('phone', newNumber);
      }
    } if(res.status == 401) {
      alert('The password you entered was incorrect.\nPlease try again.');
      return;
    }
    localStorage.setItem('notificationStyle', notificationStyle);


    toggleAccount();
  }

  const LogOut =()=>{
    console.log("logOut");
    props.onFormSwitch('login');
    localStorage.clear();
  }

  return (
    <div className="LoggedIn">
      <div className='accountContainer'>
        <b id = "username">{props.userName}</b>
        <span className='editAccount' onClick={toggleAccount}>edit account</span>
      </div>
        
      <button id ="logOut" onClick={LogOut}>Logout</button>

      <Modal isOpen={showAccount} style={{
      content: {
          margin: 'auto',
          width: '40%',
          height: '60%',
          backgroundColor: 'rgb(255,255,255)',
      },}}>

        <h4>Your account</h4>
        <div className='editContainer'>
          <span className='editTitle'>Username</span><br />
          <span className='username'>{localStorage.getItem('user')}</span>
        </div>

        <div className='editContainer'>
          <span className='editTitle'>Email</span><br />
          <FontAwesomeIcon className="editIcon" icon={faPenToSquare} onClick={toggleEditEmail}/>
          {
            editEmail ? <input ref={emailRef} type='email' id='newEmail' placeholder='enter an email...'></input>
            : <span className='email'>{localStorage.getItem('email')}</span>
          }
        </div>

        <div className='editContainer'>
          <span className='editTitle'>Phone Number</span><br />
          <FontAwesomeIcon className="editIcon" icon={faPenToSquare} onClick={toggleEditNumber}/>
          {
            editNumber ? <input ref={numberRef} type='tel' id='newNumber' placeholder='xxx-xxx-xxxx' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'></input>
            : <span className='phoneNumber'>{localStorage.getItem('phone') ? localStorage.getItem('phone') : 'no phone number'}</span>
          }
        </div>

        <div className='editContainer'>
          <span className='editTitle'>Notifications:</span><br />
          <label>
            <input className='notifyPhone' type='checkbox' checked={notifyPhone} onChange={() => setNotifyPhone(!notifyPhone)} onClick={() => setEditNotifyPhone(!editNotifyPhone)}/>
            Phone
          </label><br/>

          <label>
            <input className='notifyPhone' type='checkbox' checked={notifyEmail} onChange={() => setNotifyEmail(!notifyEmail)} onClick={() => setEditNotifyEmail(!editNotifyEmail)}/>
            Email
          </label>

        </div>

        <div className='accountButtons'>
          {
            editNumber || editEmail || editNotifyEmail || editNotifyPhone ? <div>
              <span className='passwordAlert'>Enter your password to save changes:</span><br />
              <input ref={passwordRef} id='passwordField' type='password'></input><br />
            </div>
              : ""
          }
          
          <button className='saveAccountButton' type='button' onClick={saveAccount}>Save Changes</button>
          <button className='closeAccountButton' type='button' onClick={toggleAccount}>Cancel</button>
        </div>
      </Modal>
    
    </div>
  )
}
