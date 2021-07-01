import React, { Component } from 'react'
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import { getChats, getGroupChats, afterPostMessage } from "./../actions/chat_actions"
import ChatCard from "./Sections/ChatCard"
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { CHAT_SERVER } from './Config.js';
import auth from './../auth/auth-helper'


export class ChatPage extends Component {

constructor(props){
  super(props)
  this.state = {
      chatMessage: "",
      groups:[],
      chosengroup:'',
      group:{},
  }
  this.handleGroupChange=this.handleGroupChange.bind(this)
  this.getGroupChat=this.getGroupChat.bind(this)

  // fetch(`/api/chat/getGroups`).then(res => {
  //         return res.json();
  //       }).then(info=>{
  //         console.log("groups")
  //         console.log(info)
  //         this.setState({groups:info})
  //       })
  fetch(`${CHAT_SERVER}/getChats`)
      .then(response => response.json())
      .then(data=>this.props.dispatch(getGroupChats(data)))
}

handleGroupChange(event){

  var group=event.target.value
  this.setState({chosengroup: event.target.value });
  console.log(CHAT_SERVER)
this.getGroupChat(event.target.value)

}

getGroupChat(group){
  fetch(`${CHAT_SERVER}/getChats/${group}`)
      .then(response => response.json())
      .then(data=>this.props.dispatch(getGroupChats(data)))
}

    componentDidMount() {
        let server = "http://localhost:5000";

        this.props.dispatch(getChats());

        this.socket = io(server);


        this.socket.on("Output Chat Message", messageFromBackEnd => {
            console.log(messageFromBackEnd)
            this.props.dispatch(afterPostMessage(messageFromBackEnd));
        })
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    handleSearchChange = (e) => {
        this.setState({
            chatMessage: e.target.value
        })


    }




    onDrop = (files) => {
        console.log(files)


        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }



        let formData = new FormData();

        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append("file", files[0])

        Axios.post('api/chat/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    let chatMessage = response.data.url;
                    let userId = auth.isAuthenticated().user._id;
                    let userName = auth.isAuthenticated().user.name;
                    let nowTime = moment();
                    let type = "VideoOrImage"
                    this.socket.emit("Input Chat Message", {
                        chatMessage,
                        userId,
                        userName,
                        nowTime,
                        type
                    });
                }
            })
    }






    submitChatMessage = (e) => {
        e.preventDefault();

        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }



        let groupId=this.state.chosengroup
        let chatMessage = this.state.chatMessage
        let userId = auth.isAuthenticated().user._id
        let userName = auth.isAuthenticated().user.name;
        let nowTime = moment();
        let type = "Text"

        this.socket.emit("Input Chat Message", {
            chatMessage,
            userId,
            userName,
            groupId,
            nowTime,
            type
        });
        this.setState({ chatMessage: "" })
    }





    render() {
      var chats=  <p>No conversation so far.</p>

if(this.props.chats.chats){
  chats=this.props.chats.chats.map(chat =>{
    return (
      <ChatCard key={chat._id}  {...chat} />
    )
  })}


      var mappedgroups=  <option value="no groups">no groups</option>
      if(this.state.groups){
        mappedgroups=this.state.groups.map(group=>{
          return(
              <option key={group._id} value={group._id}>{group.title}</option>
          )
        })
      }return (
            <React.Fragment>
            <div className="chat">

                <div className="chatcoloumn1">
<div className="chatrow1">
<h2 style={{margin:"10px"}}>Choose a Group to chat with</h2>
<form onSubmit={this.setGroup}>
  <div >
    <label style={{margin:"5px"}} htmlFor="room">Room</label>
    <select style={{margin:"5px"}} name="room" id="room" onChange={this.handleGroupChange}>
      {mappedgroups}
    </select>
  </div>
  </form>
  </div>

<div className="chatrow2">
<form onSubmit={this.submitChatMessage}>
<input style={{margin:"5px"}}
placeholder="Let's start talking"
type="text"
value={this.state.chatMessage}
onChange={this.handleSearchChange}></input>



        <button onClick={this.submitChatMessage}>Submit Message</button>

    </form>
    </div>
</div>
                <div style={{border:"white", borderStyle: "solid",borderWidth:"5px",margin:"10px"}} className="chatcoloumn2">

                    <div style={{ width:"90%",height: "90%",background:"#efefef",margin:"10px",  overflowY: 'scroll' }}>
                        {chats}
                        <div
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                            style={{clear: "both" }}
                        />
                    </div>


                            </div>
                            </div>



            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        chats: state.chat
    }
}


export default connect(mapStateToProps)(ChatPage);
