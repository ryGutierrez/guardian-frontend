import React from 'react'
import './css/sideprofile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars} from '@fortawesome/free-solid-svg-icons'
export default function SideProfile() {
  function login(){

  }
  return (
    <div className = "innerSideProfile">
      <div className="profName">
        <b>Derockenthis</b>
        {/* {login()} */}
      </div>
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
  )
}
