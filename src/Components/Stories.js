import React from 'react'
import './css/stories.css';
import { useState,useEffect } from 'react'
import StickyBox from "react-sticky-box";
import SideStories from './SideStories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFire,faComment, faHouseFloodWater,faBinoculars,faShare} from '@fortawesome/free-solid-svg-icons'
export default function Stories() {
    const [storiesState, setStories] = useState([])
    const [currStory,setCurr] = useState([])
    const [currTab,setTab] = useState("Popular")

     //Story Tabs {Latest, Popular, Mine}

    //Latest backend query goes in this function 
    function TabSwitch(e){
        e.preventDefault()
        console.log(currTab)
        document.getElementById(currTab+"-active").id = currTab
        setTab(e.target.getAttribute("id"))
        document.getElementById(e.target.getAttribute("id")).id = e.target.getAttribute("id")+"-active"
    }
    
    //story class
    class story {
        constructor(date,title,details,tag,id) {
            this.date = date
            this.title = title
            this.details = details
            this.tag = tag
            if(tag === "fire"){
                this.tag=faFire
            }
            else if(tag === "flood"){
                this.tag=faHouseFloodWater
            }
            this.id = id
            this.shortenedDetails = details
            this.hideBtn = true
            if(this.details.length>=150){
                this.shortenedDetails=this.details.substring(0,150)+"...";
                this.hideBtn = false
            }
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
    let example_story = new story("2/13/22","Clay Fire", "Command continues to release engines from the incident. This will be the final update unless conditions change.","fire")
    let story2 = new story("2/20/23","Flood-La Paz","The NASA Global Flood Model has issued a Flood Warning on February 20, 2023, 02:33:00 UTC for La Paz, Baja Calif....","flood")

    const stories = [example_story,story2]
    //Heres where it loads the stories onto the html
    //It gets the stories from the stories array
    //returnStories function is being used by the second return statement.
    //1. we need to load stories from the database and put them into an array and pass the array into this function
    function returnStories(story){
        function showMore(id,s){
            document.getElementById(id).innerHTML= s.details;
            setCurr(s)
        }
        function interaction(e,id){
            e.preventDefault()
            console.log(e.target.getAttribute('id'))
            // e.target.getAttribute('id')
            if(e.target.id == "watching-inter"){
                e.target.id = "watching"
            }
            else{
                e.target.id = "watching-inter"
            }
            
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
                            <div id = {"comment"+s.id} className="action">
                                <FontAwesomeIcon className="icon" icon={faComment}/>
                                <p>1289</p>
                            </div>
                            <div id = {"watching"+s.id} className="action" onClick={(e)=>interaction(e,s.id)}>
                                <FontAwesomeIcon className="icon" icon={faBinoculars} />
                                <p>1289</p>
                            </div>
                            <div id = "share" className = "action">
                                <FontAwesomeIcon icon={faShare} />
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

        console.log("Stories component loaded...");
        
        // Server fetch example:
        // const fetchData = async() => {
        //     const data = await fetch(new URL("http://localhost:3001/ping"));
        //     const json = await data.json();
        //     console.log(json);
        //     return json;
        // };
        // fetchData().catch(console.error);
      
      }, []);

    return (
        <div className = "MainWindow">
            <div className = "MainContent">
                <div class = "searchbox">
                    <FontAwesomeIcon className="MagnifyingGlass" icon={faMagnifyingGlass} />
                    <input type = "text" placeholder='Search'></input>
                </div>
                <div className="homeselection">
                    <button id = "Latest" onClick={(e)=>TabSwitch(e)}>
                        Latest
                    </button>
                    <button id = "Popular-active" onClick={(e)=>TabSwitch(e)}>
                        Popular
                    </button>
                    <button id = "Mine" onClick={(e)=>TabSwitch(e)}>
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
