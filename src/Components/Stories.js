import React from 'react'
import './css/stories.css';
import { useState } from 'react'
import StickyBox from "react-sticky-box";
import SideProfile from './SideProfile';
import SideStories from './SideStories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFire} from '@fortawesome/free-solid-svg-icons'
export default function Stories() {

    return (
        <div className = "MainWindow">
            <StickyBox className = "SideProfile">
                <SideProfile/>
            </StickyBox>
            <div className = "MainContent">
                <div class = "searchbox">
                    <FontAwesomeIcon className="MagnifyingGlass" icon={faMagnifyingGlass} />
                    <input type = "text" placeholder='Search'></input>
                </div>
                <div className="homeselection">
                    <button>
                        Latest
                    </button>
                    <button>
                        Popular
                    </button>
                    <button>
                        Mine
                    </button>
                </div>
                <div className="storysection">
                    <div className="storycontainer">
                        <div className="story">
                            <div className="storyTD">
                                <p className="Title">Clay Fire</p>
                                <p className="Date">Reported 2/17/23</p>
                            </div>
                            <div className="storyDT">
                                <p className="storydetails">Command continues to release engines from the incident. This will be the final update unless conditions change.</p>
                                <FontAwesomeIcon className="icon" icon={faFire} />
                            </div>
                        </div>
                        <div className="interactions">

                        </div>
                    </div>
                    <div className="storycontainer">
                        <div className="story">

                        </div>
                    </div>
                </div>
            </div>
            <StickyBox className = "SideStories">
                <SideStories/>
            </StickyBox>
        </div>
  )
  
}
