import React,{useEffect, useRef, useState} from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash} from '@fortawesome/free-solid-svg-icons'
import './css/watchlist.css';
export default function Watchlist(props) {
    // console.log(JSON.parse(props.watching),"watchlist")

    const [stories, setStories] = useState([])
    const [changeState,setState] = useState(1)
    let story = []

    class watchStory{
        constructor(title,id){
            this.title = title
            this.id = id
        }


    }

    useEffect(() => {
        // const watchIdlist = JSON.parse(props.watching)
        // console.log(localStorage.getItem('watchlist'))
        console.log("GOING INTO AFFECTR")
        if(localStorage.getItem('user')!==null && localStorage.getItem('watchlist')!==null){
            axios.get('/getStory/'+localStorage.getItem('watchlist'))
            .then((response) =>{
                let stor = []
                for(let i = 0; i<response.data.length;i++){
                    stor.push(new watchStory(response.data[i].header,response.data[i].incidentID))
                }
                setStories(stor)
            })
            console.log(localStorage.getItem('watchlist'),"ORDER")
        }
      },[localStorage.getItem('watchlist'),changeState]);
    if(localStorage.getItem('userID')===null){
        return(
            <div>
                login to add stories to watchlist
            </div>
        )
    }
    const sendStory = (e,id)=>{
        console.log(id,"WASSUP")
        props.toggleSideView(id)
    }
    const deleteWatching = async (e,id) =>{
        console.log("DELETE WATCHING")
        await axios.post('/removewatching/'+id+"/"+localStorage.getItem('userID'))
        .then((response) =>{
            axios.get('/getwatchlist/'+localStorage.getItem("userID"))
            .then((response) =>{
              console.log(response)
              if(response.data==='NO RECORDS'){
                console.log("WTF")
                localStorage.setItem("watchlist",null)
              }
              else{
                const res = response.data.map(obj => obj.IncidentId);
                localStorage.setItem("watchlist",JSON.stringify(res))
                console.log(localStorage.getItem('watchlist'),"ELSE")
              }
            })
        })
        setState(changeState*-1)
    }
    const displayWatchList = ()=>{
        if(stories[0]==="Loading"){
            return (<div>"loading"</div>)
        }
        else{
            return(
                <div class="watchItem">
                    {stories.map(s=>
                    <div class="item" key = {s.id} >
                        <p class="watchTitle" onClick={(e)=>sendStory(e,s.id)}>{s.title}</p>
                        <div classname="fonticon"><FontAwesomeIcon icon={faTrash} onClick={(e)=>deleteWatching(e,s.id)}/></div>
                    </div>)}
                </div>
            )
        }
    }
  return (
    <div>
        {displayWatchList()}
    </div>
  )
}
