import React, {useState,useRef, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import auth from './../auth/auth-helper'
import PostList from './PostList'
import {listNewsFeed} from './api-post.js'
import NewPost from './NewPost'
const mongoose = require("mongoose");


export default function Newsfeed (props) {
  const postArea = React.useRef('')
  const [posts, setPosts] = useState([]);

  const [post, setPost] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
console.log("props",props)
    fetch("/posts/getposts/"+props.groupId)
    .then(res => {
      return res.json();
    }).then(posts => {
      console.log("posts",posts)
  setPosts(posts.data)})
},[props])

  useEffect(() => {

    var urlRegex = /(https?:\/\/[^ ]*)/;
if (post.match(urlRegex)){
  var url = post.match(urlRegex)[0]
  getPreview(url)
}


  },[post])



  function getId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      return (match && match[2].length === 11)
        ? match[2]
        : null;
  }


async function getPreview(url){
  var data = {key: '567204aab52f43be1f7bbd3573ff4875', q: url}

if (url.includes("youtube")){
  const videoId = getId(url);
  const iframesrc = `http//www.youtube.com/embed/${videoId}`
  data = {key: '567204aab52f43be1f7bbd3573ff4875', q: iframesrc}

}


  var prev=await fetch('https://api.linkpreview.net', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(response => {return response})
    console.log("preview",prev)
    setPreview(prev)
}


  async function handleSubmit(e) {
      var d = new Date();
      var n = d.getTime();
      var postId=mongoose.Types.ObjectId()

      const newPost={
        groupid:props.groupId,
        post:post,
        preview:preview,
        timecreated:n,
        createdby:auth.isAuthenticated().user._id
      }

      var postscopy=JSON.parse(JSON.stringify(posts))
      postscopy.push(newPost)
      setPosts(postscopy)
      console.log(posts)
      const options={
          method: "POST",
          body: JSON.stringify(newPost),
          headers: {
              "Content-type": "application/json; charset=UTF-8"}}


        await fetch("/posts/createpost/"+postId, options)
                .then(response => response.json()).then(json => console.log(json));

  }


    async function deletePost(e,id) {
      var postscopy=JSON.parse(JSON.stringify(posts))
      var filteredarray = postscopy.filter(function( obj ) {
   return obj._id !== id;
   });
      setPosts(filteredarray);

        console.log(filteredarray)
        const options={
            method: "Delete",
            body: '',
            headers: {
                "Content-type": "application/json; charset=UTF-8"}}


          await fetch("/posts/deletepost/"+id, options)
                  .then(response => response.json()).then(json => console.log(json));

    }


if(preview){
  if(preview.image){
    var previewmapped=<><h2>{preview.title}</h2><img src={preview.image}></img></>
  }

if(preview.url){
  var previewmapped=<><h2>{preview.title}</h2><iframe src={preview.url}></iframe></>
}
}

var postsmapped=posts.map((item,i)=>{return (
  <>
  <div key={i}>
  <p>{item.post}</p>
  <h2>{item.preview.title}</h2>
  {item.preview.url&&<iframe src={item.preview.url}></iframe>}
  {item.preview.image&&<img src={item.preview.image}></img>}
  <button onClick={(e)=>this.deletePost(e,item._id)}>Delete Post?</button>
  </div>
  </>
)})

    return (
  <>
        <form className='search-form' onSubmit={handleSubmit}>
          <div className='form-control'>
          <label htmlFor='name'>Write Post</label>

          <textarea onChange={(e) => setPost(e.target.value)} ref={postArea} id="story" rows="5" cols="33" />

            <input type="submit" value="Submit" />

            {preview&&previewmapped}
          </div>
        </form>
        {postsmapped}
        </>
    )
}
