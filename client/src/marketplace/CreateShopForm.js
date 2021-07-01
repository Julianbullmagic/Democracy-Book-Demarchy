import React, {useRef} from 'react'
import auth from './../auth/auth-helper'



export default function CreateItemForm() {
const titleValue = React.useRef('')
const descriptionValue = React.useRef('')




function handleSubmit(e) {

e.preventDefault()

    const newItem={
      title: titleValue.current.value,
      description:descriptionValue.current.value
    }
    console.log(newItem)
    const options={
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}


      fetch("marketplace/addshop", options)
              .then(response => response.json()).then(json => console.log(json));


}

  return (
    <div>
    <section className='section search'>
      <form className='search-form' onSubmit={handleSubmit}>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={titleValue}

        />
        <label htmlFor='name'>Description</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={descriptionValue}

        />


          <input type="submit" value="Submit" />
        </div>
      </form>
    </section>
    </div>
  )}
