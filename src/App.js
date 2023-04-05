import React,{useState} from 'react'
import './App.css';
import './Components/css/sideprofile.css'
import Stories from './Components/Stories';
import Header from './Components/Header';
import { Login } from './Components/Login';
import { Register } from './Components/Register';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars} from '@fortawesome/free-solid-svg-icons'
import StickyBox from "react-sticky-box";
function App() {

  //this is how it switches forms from login to signup
  const [currentForm, setCurrentForm] = useState('login')

  const toggleForm = (formName) =>{
    setCurrentForm(formName)
  }
  return (
    <div className="App">
      <Header/>
      <div className="AppContent">
        <StickyBox className = "SideProfile">
          <div className = "innerSideProfile">
            {/* checks if the form name is 'login' then presents the login page, if not then presents register. */}
            {
              currentForm=="login"? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
            }
            <div className="zipSection">
              <b>Zip</b>
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  95355
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">93933</a>
                  <a class="dropdown-item" href="#">90210</a>
                </div>
              </div>
            </div>
            <div className ="watchingSection">
                <div className='font'>
                  <FontAwesomeIcon className="MagnifyingGlass" icon={faBinoculars} />
                </div>
                <b>Watching</b>
                <div className = "watchList">
                  <a>clay</a>
                  <a>clay</a>
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
