import React,{useEffect, useRef, useState} from 'react'
import axios from 'axios';
import './css/watchlist.css';
export default function Watchlist(props) {
    // console.log(JSON.parse(props.watching),"watchlist")

    const [stories, setStories] = useState([])
    const [storyIds,setStoryIds] = useState(JSON.parse(props.watching))
    let story = []
    useEffect(() => {
        // const watchIdlist = JSON.parse(props.watching)
        if(localStorage.getItem('user')!==null && props.watching!==null){
            axios.get('/getStory/'+props.watching)
            .then((response) =>{
                let stor = []
                for(let i = 0; i<response.data.length;i++){
                    stor.push(response.data[i].header)
                    console.log(response.data[i],"IIII")
                }
                setStories(stor)
            })
        }
      }, [props.watching]);
    if(localStorage.getItem('userID')===null){
        return(
            <div>
                login to add stories to watchlist
            </div>
        )
    }
    const displayWatchList = ()=>{
        if(stories[0]==="Loading"){
            return (<div>"loading"</div>)
        }
        else{
            return(
                <div class="watchItem">
                    {stories.map(title=>
                    <div class="item">
                        {title}
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
