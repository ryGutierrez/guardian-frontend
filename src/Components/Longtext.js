import React from 'react'
import { Component } from 'react';
import SideStories from './SideStories';

class Longtext extends Component { 
    constructor(props) {
        super(props);
      
        // Initializing the state 
        this.state = { short: 'false',
                       changed:"false"};
      }
    componentDidMount(){
        if(this.props.story.details.length>150){
            console.log(this.props.story.details.length)
            let shortened=this.props.story.details.substring(0,150)+"...";
            this.setState({short:shortened})
            this.setState({changed:"true"})
        }
        else{
            this.setState({short:this.props.story.details})
        }
    }
    render() {
        function showMore(e,s){
            <SideStories story={s}/>
            document.getElementById(s.details).innerHTML= s.details;
        }
        function showBtn(changed){
            if(changed=="false"){
                return true
            }
            return false

        }
        return<p className="storydetails " id={this.props.story.details}>{this.state.short}<button hidden={showBtn(this.state.changed)}><span key={this.props.story.title}onClick={(e)=>showMore(e,this.props.story)}>...see more</span></button></p>
    }
}

export default Longtext