import React, {useRef,useState} from 'react'
import auth from '../auth/auth-helper'



export default function GroupSearch(props) {

const titleValue = React.useRef('')
const locationValue = React.useRef('')
const levelValue = React.useRef('')




async function handleSubmit(e) {
  e.preventDefault()
  if(titleValue.current.value&&locationValue.current.value&&levelValue.current.value){
    var searchurl=`/groups/searchforgroups/${titleValue.current.value}/${locationValue.current.value}/${levelValue.current.value}`
  }
  if(titleValue.current.value&&locationValue.current.value){
    var searchurl=`/groups/searchforgroupsbytitleandlocation/${titleValue.current.value}/${locationValue.current.value}`
  }
  if(titleValue.current.value){
    var searchurl=`/groups/searchforgroupsbytitle/${titleValue.current.value}`
  }
  if(locationValue.current.value){
    var searchurl=`/groups/searchforgroupsbylocation/${locationValue.current.value}`

  }
  if(levelValue.current.value){
    var searchurl=`/groups/searchforgroupsbylevel/${levelValue.current.value}`

  }
  if(titleValue.current.value&&levelValue.current.value){
    var searchurl=`/groups/searchforgroupsbytitleandlevel/${titleValue.current.value}/${levelValue.current.value}`
  }
  if(locationValue.current.value&&levelValue.current.value){
    var searchurl=`/groups/searchforgroupsbylocationandlevel/${locationValue.current.value}/${levelValue.current.value}`
  }

  console.log("searchurl",searchurl)
      var searchResult=await fetch(searchurl)
              .then(response => response.json()).then(json =>{return json})
              console.log("searchResult",searchResult)
              props.updateGroups(searchResult)
}

  return (
    <section className='section search'>

      <form className='search-form' onSubmit={handleSubmit}>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='titleValue'
          id='titleValue'
          ref={titleValue}

        />
        <label htmlFor='name'>Location</label>
        <input
          type='text'
          name='locationValue'
          id='locationValue'
          ref={locationValue}

        />
        <label htmlFor='name'>Level</label>

        <select
          ref={levelValue}
          name="levelValue">
          <option value=""></option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>




        <button onClick={(e) => handleSubmit(e)}>Search for Groups</button>
        </div>
      </form>
    </section>
  )}
