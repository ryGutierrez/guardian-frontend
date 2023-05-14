import React from 'react'
import './css/stories.css';
import { useState, useEffect, useRef } from 'react'
import StickyBox from "react-sticky-box";
import SideStories from './SideStories';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFire,faComment, faHouseFloodWater,faBinoculars,faShare,faTrafficLight,faPersonDigging,faCloudBolt, faHeartCircleCheck, faXmark,faTriangleExclamation,faCarBurst} from '@fortawesome/free-solid-svg-icons'
import moment from "moment"
import Modal from "react-modal";
import { isCompositeComponent } from 'react-dom/test-utils';

export default function Stories(props) {
    const [storiesState, setStories] = useState([])
    const [currStory,setCurr] = useState([])
    const [currTab,setTab] = useState("Popular")
    const [watchlistStory,setWatchStory] = useState("loading")
    const [newUser,setnewUser] = useState(true)
    const [checkUserDone, setCheck] = useState(-1)
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [currIncidentId, setCurrIncidentId] = useState(-1);

    // Reference variables
    const inputRef = useRef();
    console.log(props.county,"COUNTY")
    let county = props.county
    if(props.county==null){
        county = "ANY"
    }
    //Story Tabs {Latest, Popular, Mine}
    if(props.loadSideView!=null){
        console.log(props.loadSideView,"Stories LOADING PROPS SIDE")
    }

    const getcurrStory = () => {
        // console.log("RUNNING CURRENT STORY")
        if(props.loadSideView!=null && localStorage.getItem("currWatchStory")!==props.loadSideView.toString()){
            console.log("GETTING STORY")
            axios.get('/getStory/'+props.loadSideView)
            .then((response) => {
                let s = response.data[0] 
                console.log(s)
                s = new story(s.date,s.header,s.content,"fire",s.incidentID,false)
                localStorage.setItem("currWatchStory",props.loadSideView)
                setWatchStory(s)
                console.log(watchlistStory,"WATCH31")
                setCurr(s)
            })
            if(watchlistStory==="loading"){
                return currStory
            }
            else{
                return watchlistStory
            }

        }
        else{
            return currStory
        }
    }

    //Latest backend query goes in this function 
    const TabSwitch = async (e) =>{
        e.preventDefault()
        console.log(currTab)
        document.getElementById(currTab+"-active").id = currTab
        setTab(e.target.getAttribute("id"))
        document.getElementById(e.target.getAttribute("id")).id = e.target.getAttribute("id")+"-active"
    }

    const toggleComments = async (incidentId) => {
        if(showComments) {
            setShowComments([])
            setCurrIncidentId(-1);
        } else {
            fetchComments(incidentId)
        }
        setShowComments(!showComments);
        // console.log('commentIncidentId = ' + commentIncidentId)
    }

    const fetchComments = async (incidentId) => {
        let res = await fetch('/getComments/'+incidentId)
        let comments = await res.json();
        console.log('comments -> ' + JSON.stringify(comments))
        setComments(comments)
        setCurrIncidentId(incidentId);
    }

    const postComment = async () => {
        const content = inputRef.current.value;

        let res = await fetch('/postComment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: localStorage.getItem('userID'),
              incidentId: currIncidentId,
              content: inputRef.current.value,
            }),
        })
        fetchComments(currIncidentId);
    }

    const deleteComment = async (comment) => {
        await fetch('/deleteComment/'+comment.commentID);
        setComments(comments.filter(c => c != comment));
    }

    const padNum = (num, n) => {
        return '0'.repeat(n - (num+'').length)+num
    }
    
    const getDateTime = () => {
        let now = new Date();
        return `${now.getFullYear()}-${padNum(now.getMonth() + 1, 2)}-${padNum(now.getDate(), 2)} ${padNum(now.getHours(), 2)}:${padNum(now.getMinutes(), 2)}:${padNum(now.getSeconds(), 2)}.${padNum(now.getMilliseconds(), 3)}`
    }

    // Returns a string representing aproximately how long ago the date was from the current time (i.e. "1 hour ago", "1 month ago", etc)
    // @param datetime (String) a mssql datetime object represented as a string
    const convertDate = (datetime) => {
        let now = getDateTime().split(/[-\s:.TZ]+/);
        datetime = datetime.split(/[-\s:.TZ]+/);
        let names = ["year", "month", "day", "hour", "minute", "second"];
    
        for(let i=0; i<6; i++) {
            if(now[i] != datetime[i]) {
                let diff = parseInt(now[i]) - parseInt(datetime[i])
                let name = names[i]
                return `${diff} ${diff == 1 ? name : name+'s'} ago`
            }
        }
        return 'now';
    }
    
    //story class
    class story {
        constructor(date,title,details,tag,id,watching) {
            this.date = date
            this.title = title
            this.details = details
            this.tag = tag
            this.watching = watching
            if(tag == null){
                tag = this.title
            }
            if(tag == "Fire"){
                this.tag=faFire
            }
            else if(tag === "flood"){
                this.tag=faHouseFloodWater
            }
            else if(tag.includes("DROUGHT") || tag.includes("ROAD/WEATHER")){
                this.tag = faCloudBolt
            }
            else if(tag.includes("Trfc") || tag.includes("Traffic") || this.title.includes("Traffic")){
                this.tag = faTrafficLight
            }
            else if(tag.includes("CLOSURE")){
                this.tag = faXmark
            }
            else if(tag.includes("Construction") || this.title.includes("Construction")){
                this.tag = faPersonDigging
            }
            else if(tag.includes("Hazard") || this.title.includes("Hazard")){
                this.tag = faTriangleExclamation
            }
            else if(tag.includes("Hit and Run") || this.title.includes("Hit and Run")){
                this.tag = faCarBurst
            }
            else{
                this.tag=faFire
            }
            this.id = id
            this.shortenedDetails = details
            this.hideBtn = true
            if(this.details.length>=150){
                this.shortenedDetails=this.details.substring(0,150)+"...";
                this.hideBtn = false
            }
            if(tag === "fire"){
                this.tag=faFire
            }
            else if(tag === "flood"){
                this.tag=faHouseFloodWater
            }
            this.id = id
            this.shortenedDetails = details
            this.hideBtn = true
            if(this.details.length>=160){
                this.shortenedDetails=this.details.substring(0,160)+"...";
                this.hideBtn = false
            }
        }
      }

    //Heres where it loads the stories onto the html
    //It gets the stories from the stories array
    //returnStories function is being used by the second return statement.
    //1. we need to load stories from the database and put them into an array and pass the array into this function
    function returnStories(story){
        const tagsDone = ()=>{
            setCheck(checkUserDone*-1)
        }
        const subToTag = (e)=>{
            console.log(e.target)
            if(e.target.className === "tagButtonSelected"){
                axios.post('/removesubscription/'+localStorage.getItem('userID')+"/"+e.target.id)
                .then((response) => {
                    console.log(response)
                    e.target.className="tagButton"
                })
            }
            else{
                e.target.className="tagButtonSelected"
                axios.post('/addsubscription/'+localStorage.getItem('userID')+"/"+e.target.id)
                .then((response) => {
                    console.log(response)
                })
            }
        }
        if(currTab==="Mine" && localStorage.getItem("userID")===null){
            return(
            <div Style="margin-top:5em; font-weight:600">
                Login or Create an account for personal stories
            </div>)
        }
        else if(currTab==="Mine" && newUser===true){
            return(
                <div className="storysection">
                    <div className="newUser">
                        <span id = "title">Subscribe to Tags</span>
                        <button className="tagButton" id="Fire"Style="color:red" onClick={(e)=>{subToTag(e)}}><FontAwesomeIcon className="tagicon" icon={faFire} />Fires</button>
                        <button className="tagButton" id="Flood"Style="color:#6d96ef" onClick={(e)=>{subToTag(e)}}><FontAwesomeIcon className="tagicon" icon={faHouseFloodWater} />Flooding</button>
                        <button className="tagButton" id="Traffic"Style="color:yellow"onClick={(e)=>{subToTag(e)}}><FontAwesomeIcon className="tagicon" icon={faTrafficLight} />Traffic Hazards</button>
                        <button className="tagButton" id="Construction"Style="color:brown"onClick={(e)=>{subToTag(e)}}><FontAwesomeIcon className="tagicon" icon={faPersonDigging} />Construction</button>
                        <button className="tagButton" id="Weather" Style="color:grey"onClick={(e)=>{subToTag(e)}}><FontAwesomeIcon className="tagicon" icon={faCloudBolt} />Weather</button>
                        <button onClick={tagsDone}>Done</button>
                    </div>
                </div>)

        }
        function showMore(id,s){
            document.getElementById(id).innerHTML = s.details;
            setCurr(s)
        }
        const interaction = async (e,id)=>{
            e.preventDefault()
            console.log(e.target.getAttribute('id'))
            // e.target.getAttribute('id')
            if(e.target.id === "watching-inter"){
                document.getElementById("watchingNum"+id).innerHTML = parseInt(document.getElementById("watchingNum"+id).innerHTML)-1
                e.target.id = "watching"
                console.log("REMOVE WATCHING",localStorage.getItem("user"))
                let response = await fetch('/removewatching', { // send username and incident id through POST body.
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  storyID: id,
                  userID:localStorage.getItem('userID')
                }),
              });
            }
            else{
                document.getElementById("watchingNum"+id).innerHTML = parseInt(document.getElementById("watchingNum"+id).innerHTML)+1
                e.target.id = "watching-inter"
                console.log("ADD TO WATCHLIST FUNCTION")
                props.addToWatchlist(id)
                let response = await fetch('/watching', { // send username and incident id through POST body.
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        storyID: id,
                        userID:localStorage.getItem('userID')
                    }),
                });
                console.log(response,"WORKING response in stories")
            }
            
        }
        return(
            <div className="storysection">
                {
                    
                    //gets the stories from the array and maps each one onto the html page like this.
                    story.map(s =>
                        <div className="storycontainer" key={s.id}>
                            <div className="story">
                                <div className="storyTD">
                                    <p className="Title">{s.title}</p>
                                    <p className="Date">Reported {s.date}</p>
                                </div>
                                <div className="storyDT">
                                    <p className="storydetails " id={s.id}>{s.shortenedDetails}<button id ="seeMore" hidden={s.hideBtn}><span key={s.title} onClick={()=>showMore(s.id,s)}>see more</span></button></p>
                                    <FontAwesomeIcon className="icon" icon={s.tag} />
                                </div>
                            </div>
                            <div className="interactions">
                                <div id = {"comment"+s.id} className="action" onClick={() => { setCurr(s); toggleComments(s.id);}}>
                                    <FontAwesomeIcon className="icon" icon={faComment}/>
                                    <p>1289</p>
                                </div>
                                <div id = {"watching"+s.id} className="action" onClick={(e)=>interaction(e,s.id)}>
                                    <FontAwesomeIcon className="icon" icon={faBinoculars} />
                                    <p id = {"watchingNum"+s.id}>{s.watching}</p>
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
        if(currTab === "Mine"){
            axios.get('/getsubscriptions/'+localStorage.getItem("userID"))
            .then((response) => {
                if(response.data==="F"){
                    console.log(response.data,"DATA")
                    return
                }
                else{
                    let stories = []
                    for(let i = 0; i<response.data.length;i++){
                     let s = response.data[i]
                     s.date=moment(s.date).utc().format('YYYY-MM-DD')
                     stories.push(new story(s.date,s.header,s.content,s.tag,s.incidentID,s.watching))
                     // console.log(response.data[i].details)
                    }
                    setnewUser(false)
                    setCurr(stories[0])
                    setStories(stories);
                    console.log(response.data)
                }
            })
        }
        else{
            axios.get('/'+currTab+'/'+county)
            .then((response) => {
               let stories = []
               for(let i = 0; i<response.data.length;i++){
                let s = response.data[i]
                s.date=moment(s.date).utc().format('YYYY-MM-DD')
                stories.push(new story(s.date,s.header,s.content,s.tag,s.incidentID,s.watching))
                // console.log(response.data[i].details)
               }
               setCurr(stories[0]);
               setStories(stories);
            //    console.log(response.data)
            })
        }
        console.log("Stories component loaded...");       
      
      }, [currTab,checkUserDone,props.county]);

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
                {returnStories(storiesState)}

            </div>
            <StickyBox className = "SideStories">
                {/* <SideStories story={currStory}/> */}
                <SideStories story={getcurrStory()} />
            </StickyBox>

            <Modal isOpen={showComments} style={{
                content: {
                    margin: 'auto',
                    width: '40%',
                    height: '90%',
                    backgroundColor: 'rgb(255,255,255)',
                    overflowY: 'hidden',
                },}}>

                {/* Show comments here */}
                <h5>{comments.length} Comment{comments.length != 1 ? 's' : ''}</h5>
                
                {
                    localStorage.userID ? 
                    <div className='commentSubmissionContainer'>
                        <textarea className="commentTextArea" maxLength={500} placeholder='Leave a comment...' ref={inputRef}></textarea>
                        <button className="submitCommentButton" type="button" onClick={() => postComment()}>Submit</button>                    
                    </div>
                    :
                    ""
                }

                <div className='commentSection'>
                    {
                        comments.map(comment =>
                            <div className='commentContainer'>
                                <div>
                                    <div className='commentTopSection'>
                                        <span className='commentAuthor'>{comment.username}</span>
                                        <span className='commentDate'>{convertDate(comment.datePosted)}</span>
                                    </div>
                                    <p className='commentContent'>{comment.content}</p>
                                </div>
                                <div>
                                    { comment.username == localStorage.getItem('user') ? 
                                    <button className='deleteCommentButton'>
                                        <FontAwesomeIcon className="deleteCommentXmark" icon={faXmark} onClick={() => deleteComment(comment)}/>
                                    </button>
                                    :
                                    ""}
                                </div>
                            </div>
                        )
                    }
                </div>

                <button className='closeCommentButton' type='button' onClick={toggleComments}>Close</button>

  
            </Modal>
        </div>
  )
  
}

