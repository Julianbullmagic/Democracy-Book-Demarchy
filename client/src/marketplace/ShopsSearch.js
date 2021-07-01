import React, {useRef,useState} from 'react'
import auth from '../auth/auth-helper'



export default function ShopsSearch() {

const searchValue = React.useRef('')
const shopOrItemValue = React.useRef('items')




function handleSubmit(e) {


console.log("refs",searchValue,shopOrItemValue)

if(shopOrItemValue=="items"){
      // fetch("/getitems")
      //         .then(response => response.json()).then(json => console.log(json))
      //
           }

if(shopOrItemValue=="shops"){
// fetch("/getshops")
//         .then(response => response.json()).then(json => console.log(json))
}
}

  return (
    <section className='section search'>

      <form className='search-form' onSubmit={handleSubmit}>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='searchValue'
          id='searchValue'
          ref={searchValue}

        />

        <select
          ref={shopOrItemValue}
          name="shopOrItemValue">
          <option value="item">Item</option>
          <option value="shop">Shop</option>
        </select>




          <input type="submit" value="Submit" />
        </div>
      </form>
    </section>
  )}
