import React from 'react'
import "./css/sidestories.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink} from '@fortawesome/free-solid-svg-icons'
export default function SideStories(s) {
  const story = s.story
  return (
    <div className="SideWindow">
      <b>{story.title} - Past Updates</b>
      <div className="pastStories">
        <div className="oldStory">
          <p id="date">Posted on: {story.date}</p>
          <div className="oldStoryDetails"><p>{story.details}</p></div>
          <span><FontAwesomeIcon className="icon" icon={faLink} /><span>Source: https://app.watchduty.org/incident/1876#allow-back</span></span>
        </div>
      </div>
    </div>
  )
}
