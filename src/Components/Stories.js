import React from 'react'
import './css/stories.css';
import { useState,useEffect } from 'react'
import StickyBox from "react-sticky-box";
import SideProfile from './SideProfile';
import SideStories from './SideStories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFire,faComment} from '@fortawesome/free-solid-svg-icons'
export default function Stories() {
    const [showAll, setShowAll] = useState(false);
    //story class
    class story {
        constructor(date,title,details,tag) {
            this.date = date
            this.title = title
            this.details = details
            this.tag = tag
        }
      }
    function showMore(){
        console.log("HI")
    }
    //test data
    let example_story = new story("2/13/22","Clay Fire", "Command continues to release engines from the incident. This will be the final update unless conditions change.","fire")
    let story2 = new story("2/20/23","Flood-La Paz","The NASA Global Flood Model has issued a Flood Warning on February 20, 2023, 02:33:00 UTC for La Paz, Baja Calif....","flood")

    const stories = [example_story,story2]
    //Heres where it loads the stories onto the html
    //It gets the stories from the stories array
    //returnStories function is being used by the second return statement.

    //1. we need to load stories from the database and put them into an array and pass the array into this function
    function returnStories(story){
        return(
            <div className="storysection">
                {
                    //gets the stories from the array and maps each one onto the html page like this.
                    story.map(s =>
                    <div className="storycontainer">
                        <div className="story">
                            <div className="storyTD">
                                <p className="Title">{s.title}</p>
                                <p className="Date">Reported {s.date}</p>
                            </div>
                            <div className="storyDT">
                                <p className="storydetails">{s.details}<button><span onClick={showMore}>...see more</span></button></p>
                                <FontAwesomeIcon className="icon" icon={faFire} />
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
        console.log("Stories component loaded...");
        
        // Server fetch example:
        const fetchData = async() => {
            const data = await fetch(new URL("http://localhost:3001/api"));
            const json = await data.json();
            console.log(json);
            return json;
        };
        fetchData().catch(console.error);

      }, []);
      
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
                {returnStories(stories)}
            </div>
            <StickyBox className = "SideStories">
                <SideStories/>
            </StickyBox>
        </div>
  )
  
}
