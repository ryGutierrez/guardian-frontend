import React from 'react'
import './css/stories.css';
import { useState,useEffect } from 'react'
import StickyBox from "react-sticky-box";
import SideStories from './SideStories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFire,faComment, faHouseFloodWater} from '@fortawesome/free-solid-svg-icons'
export default function Stories() {
    const [storiesState, setStories] = useState([])
    const [currStory,setCurr] = useState([])
    //story class
    class story {
        constructor(date,title,details,tag,id) {
            this.date = date
            this.title = title
            this.details = details
            this.tag = tag
            if(tag == "fire"){
                this.tag=faFire
            }
            else if(tag == "flood"){
                this.tag=faHouseFloodWater
            }
            this.id = id
            this.shortenedDetails = details
            this.hideBtn = true
            if(this.details.length>=150){
                this.shortenedDetails=this.details.substring(0,150)+"...";
                this.hideBtn = false
            }
        }
      }
    //test data
    let example_story = new story("2/13/22","Clay Fire", "Command continues to release engines from the incident. This will be the final update unless conditions change.","fire",0)
    let story2 = new story("2/20/23","Flood-La Paz","The NASA Global Flood Model has issued a Flood Warning on February 20, 2023, 02:33:00 UTC for La Paz, Baja Calif. This will be the final update unless conditions change NASA Global Flood Model has issued a Flood Warning on February 20","flood",1)

    const stories = [example_story,story2]
    // setStories(stories)
    //Heres where it loads the stories onto the html
    //It gets the stories from the stories array
    //returnStories function is being used by the second return statement.
    //1. we need to load stories from the database and put them into an array and pass the array into this function
    function returnStories(story){
        function showMore(id,s){
            document.getElementById(id).innerHTML= s.details;
            setCurr(s)
        }
        return(
            <div className="storysection">
                {
                    
                    //gets the stories from the array and maps each one onto the html page like this.
                    story.map(s =>
                    <div className="storycontainer" key={s.title}>
                        <div className="story">
                            <div className="storyTD">
                                <p className="Title">{s.title}</p>
                                <p className="Date">Reported {s.date}</p>
                            </div>
                            <div className="storyDT">
                                <p className="storydetails " id={s.id}>{s.shortenedDetails}<button id ="seeMore" hidden={s.hideBtn}><span key={s.title}onClick={()=>showMore(s.id,s)}>see more</span></button></p>
                                <FontAwesomeIcon className="icon" icon={s.tag} />
                            </div>
                        </div>
                        <div className="interactions">
                            <div className="comment">
                                <FontAwesomeIcon className="icon" icon={faComment} />
                                <p>1289</p>
                            </div>
                        </div>
                    </div>
                         )
                }
            </div>
        )
    }

    useEffect(() => {
        setStories(stories)
        setCurr(stories[0])
      }, []);

    return (
        <div className = "MainWindow">
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
                {returnStories(stories)}
            </div>
            <StickyBox className = "SideStories">
                <SideStories story={currStory}/>
            </StickyBox>
        </div>
  )
  
}
