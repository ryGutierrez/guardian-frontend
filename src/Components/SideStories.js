import React from 'react'
import { useState, useEffect, useRef } from 'react'
import "./css/sidestories.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
export default function SideStories(s) {
  
  const story = s.story
  const [pastStories,setPast] = useState([])

  useEffect(()=>{
    if(story.length!==0){
      console.log(story,"STORYCHECK")
      async function fetchPast(){
        let response = await fetch('/getPastStory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            storyTitle: story.title,
          }),
        })
        const data = await response.json()
        return data
      }
      fetchPast().then(data=>{
        setPast(data.pastStory)
      })
    }
  },[s])
  function displayStories(){
    console.log(pastStories,"PAST")
    if(story.length!==0){
      return (<div>
        {
            pastStories.map(s=>
                <div className="oldStory">
                  <p id="date">Posted on: {s.date}</p>
                  <div className="oldStoryDetails"><p>{s.content}</p></div>
                  <span><FontAwesomeIcon className="icon" icon={faLink} />Source:<span> {s.source}</span></span>
                </div>
            )
        }
      </div>)
    }
    return (
      <div>No Stories</div>
    )

  }
  return (
    <div  className="SideWindow">
      <div clasName="headerSection"><header></header></div>
       {displayStories()}
    </div>

  )
}

