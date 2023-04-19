import React,{useRef, useState} from 'react'
import './App.css';
import './Components/css/sideprofile.css'
import Stories from './Components/Stories';
import Header from './Components/Header';
import { Login } from './Components/Login';
import { Register } from './Components/Register';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars, faCirclePlus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import {Loggedin} from './Components/Loggedin'
import StickyBox from "react-sticky-box";
import Modal from "react-modal";
import counties from './counties.json';
import axios from 'axios';

function App() {

  // State variables
  const [currentForm, setCurrentForm] = useState('login')
  const [showModal, setShowModal] = useState(false);
  const [currCounty, setCurrCounty] = useState(null);
  const [userCounties, setUserCounties] = useState(JSON.parse(localStorage.getItem('counties')));

  // Reference variables
  const inputRef = useRef();

  // Functions
  const toggleForm = (formName) =>{
    console.log(formName)
    setCurrentForm(formName)
  }

  const getWatchList=(id)=>{
    axios.get('/getWatchlist/'+id)
    .then((response) => {
      // console.log(response.data)
      localStorage.setItem("watchlist",response.data)
    })
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  }

  const getUserCounties = async (userId) => {
    let raw = await fetch(`/userCounties/${userId}`);
    let res = await raw.json();
    res = res.map(c => c.name);
    // console.log('saved counties: ', res);
    localStorage.setItem('counties', JSON.stringify(res));
  }

  const addCounty = async () => {
    const county = inputRef.current.value;
    // console.log(inputRef.current.value);
    // ensure input is a valid county (i.e. is in the counties.keys())
    if(!Object.keys(counties).includes(county)) {
      console.log(`# ERROR input ${county} is not valid`)
      return;
    }
    // ensure input is not already in the users saved counties
    if(JSON.parse(localStorage.getItem('counties')).includes(county)) {
      console.log(`# ERROR input ${county} is already saved or will be saved`)
      return;
    }

    // update saved counties with new county
    await fetch('/saveCounty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: localStorage.getItem('userID'),
        county: inputRef.current.value,
      }),
    });
    getUserCounties(localStorage.getItem('userID'));
    setUserCounties([...userCounties, inputRef.current.value]);
    console.log(`Added ${county}`);
  };

  const deleteCounty = async (county) => {
    await fetch(`/deleteCounty/${localStorage.getItem('userID')}/${county}`);
    setUserCounties(userCounties.filter(c => c !== county));
    console.log(`Removed ${county}`);
  }

  const currentUserDisplay = () =>{
    // console.log(currentForm)
    if(localStorage.getItem('user')){
      getWatchList(localStorage.getItem('userID'))
      return <Loggedin userName = {localStorage.getItem('user')} onFormSwitch={toggleForm}/>
    }
    if(currentForm==="login"){
      return <Login onFormSwitch={toggleForm}/>
    }
    else if(currentForm==="register"){
      return <Register onFormSwitch={toggleForm}/>
    }
    else{
      return <Loggedin userName = {currentForm} onFormSwitch={toggleForm}/>
    }
  }

  const getCountyDisplay = () => {
    if(localStorage.getItem('user')) {
      getUserCounties(localStorage.getItem('userID'));
      return (
        <div className="countySection">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span id="dropdownSelect">{currCounty == null ? 'Your Saved Counties' : currCounty}</span>
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {
                    userCounties.length == 0 ? <span class="dropdown-item">No saved counties!</span>
                    : JSON.parse(localStorage.getItem('counties')).map(county => 
                      <span class="dropdown-item" onClick={() => setCurrCounty(county)}>{county}</span>
                    )
                  }
                </div>
              </div>
                <button id="saveCountyBtn" onClick={toggleModal}>Save a new county?</button>
                <Modal isOpen={showModal} style={{
                    content: {
                      margin: 'auto',
                      width: '40%',
                      height: '60%',
                      backgroundColor: 'rgb(255,255,255)',
                    },}}>
                  <datalist id="countyList">
                    {
                      Object.keys(counties).map(county => 
                        <option value={county} onClick={localStorage.setItem('currCounty', county)}>{county}</option>
                      )
                    }
                  </datalist>

                  <form id="saveCountyForm">
                    <label for="countyInput" className="countyInputLabel"><b>Enter a county:</b></label>

                    <div className="countyInputBlock">
                      <input ref={inputRef} list="countyList" className="countyInput" autoComplete="on"></input>
                      <button type="button" className="saveCountyBtn" onClick={addCounty}><FontAwesomeIcon className="saveCountyPlus" icon={faPlus}/></button>
                    </div>
                    
                    <div className="countiesList">
                      {
                        userCounties.map(county => 
                          <span className="countyItem">
                            {county}
                            <button type="button" className="cancelCountyBtn" onClick={() => deleteCounty(county)}><FontAwesomeIcon className="cancelCountyXmark" icon={faXmark}/></button>
                          </span>
                        )
                      }
                    </div>

                    <div className="modalButtons">
                      <button type="submit" className="saveCountiesBtn" form="saveCountyForm">Save changes</button>
                    </div>
                  </form>
                </Modal>
            </div>
      )
    }
  }

  return (
    <div className="App">
      <Header/>
      <div className="AppContent">
        <StickyBox className = "SideProfile">
          <div className = "innerSideProfile">
            {/* checks if the form name is 'login' then presents the login page, if not then presents register. */}
            {
              currentUserDisplay()
            }

            {
              getCountyDisplay()
            }
            <div className ="watchingSection">
                <div className='font'>
                  <FontAwesomeIcon className="MagnifyingGlass" icon={faBinoculars} />
                </div>
                <b>Watching</b>
                <div className = "watchList">
                </div>
              </div>
          </div>
        </StickyBox>
        <div className="AppStories">
          <Stories/>
        </div>
      </div>
    </div>
  );
}

export default App;
