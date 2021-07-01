import React, {useRef,useState} from 'react'
import auth from '../auth/auth-helper'



export default function CreateLocalGroupForm() {



const [toggle, setToggle] = useState(false);

function getLocationName(){
  console.log(auth.isAuthenticated().user.coordinates[0],auth.isAuthenticated().user.coordinates[1])


fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${auth.isAuthenticated().user.coordinates[0]},${auth.isAuthenticated().user.coordinates[1]}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
                  .then(response => response.json())
                    .then(data =>{
                      console.log("DATA",data["features"][2]["place_name"])
                      postGroup(data["features"][2]["place_name"])
                    })
}


function postGroup(location){
  const newPost={
    location:location,
    centroid:auth.isAuthenticated().user.coordinates,
  }
  console.log(newPost)
  const options={
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}


    fetch("groups/createlocalgroup/", options).then(response => response.json()).then(json => console.log(json));
}


function handleSubmit(e) {
  e.preventDefault()
getLocationName()
}


  return (
    <section className='section search'>

      <form className='search-form' onSubmit={handleSubmit}>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>



          <input type="submit" value="Submit" />
        </div>
      </form>
    </section>
  )}
