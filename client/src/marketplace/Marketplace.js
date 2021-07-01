import React, {useState,useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import {Link} from 'react-router-dom'
import CreateItemForm from './CreateItemForm'
import CreateShopForm from './CreateShopForm'

import ItemList from './ItemList'
import ShopList from './ShopList'

import ShopsSearch from './ShopsSearch'



export default function Marketplace (){


  const [viewForm, setViewForm]=useState(false)
  const [viewShopForm, setViewShopForm]=useState(false)
  const [viewInfo, setViewInfo]=useState(false)
  const [items, setItems]=useState([])
  const [shops, setShops]=useState([])


   const searchValue = React.useRef('')
   const shopOrItemValue = React.useRef('items')

   useEffect(() => {



     fetch("/marketplace/items").then(res => {
        return res.json();
      }).then(blob => {
        console.log("data",blob.data)
        if(blob.data){setItems([...blob.data])}

      })


      fetch("/marketplace/shops").then(res => {
        return res.json();
      }).then(blob => {
        console.log("data",blob.data)

        setShops([...blob.data])
      })

   }, [])







   function handleSubmit(e) {
     e.preventDefault()

     if(searchValue.current.value){
   if(shopOrItemValue.current.value=="item"){

              fetch("/marketplace/getitems/"+searchValue.current.value)
                      .then(response => response.json()).then(blob =>
                        {
                          console.log("shopdata",blob.data)

                          setItems([...blob.data])
                        })
              }

   if(shopOrItemValue.current.value=="shop"){
              fetch("/marketplace/getshops/"+searchValue.current.value)
                      .then(response => response.json()).then(blob => {
                        console.log("shopdata",blob.data)
                        setShops([...blob.data])
                      })
     }
   }else{

          fetch("/marketplace/items").then(res => {
             return res.json();
           }).then(blob => {
             console.log("data",blob.data)
             setItems([...blob.data])
           })


           fetch("/marketplace/shops").then(res => {
             return res.json();
           }).then(blob => {
             console.log("data",blob.data)

             setShops([...blob.data])
           })
   }
 }






    return (
      <div>
      <Card >
        <CardContent>
        <br/>
        <br/>
        <br/>
        <br/>
  <button  onClick={()=>{setViewInfo(!viewInfo)}}>See info?</button>
  <h3>In a socialist society ideally capitalists should not be able to earn passive income from interest, dividends, royalties or rents. There would be no inheritance,
  the wealth of the dead would become publicly owned and invested in public services or infrastructure.</h3>
  {viewInfo && <>
        <h6>Welcome to the marketplace. There is a common misconception about socialism that socialist leaders tried to eliminate markets in the 20th century.
        This was simply not the case. While this may have been a very longterm goal, with the information and communications technologies of their time, This
        was totally impractical. Instead they created rules and restrictions on markets in order to try to create a fairer distribution of wealth
        and resources, planning their economy to ensure human needs were being met. Human labour is the source of economic value, ownership of capital does not create value. Rents and loans are prohibited
        on Democracy Book. Only individuals sole traders, cooperatives, not for profits and charities can list their goods or services here.
        Other listings will be deleted. Also, if you've found a decent place to squat, empty homes or vacant buildings but no longer need it, list it here in order to help
        homeless people find somewhere to stay. This may seem like a charitable action, but really it helps everyone as it reduces the cost of housing.
        Capitalists artificually maintain a lack of supply of housing deliberately to massively inflate the cost. Houseing costs at least five more times than it should.
         Squatting is not a crime as
        long as you don't break anything in order to enter the property and leave if the owner asks you to, otherwise you will be guilty of
        trespassing or breaking and entering. Noone deserves to live on the
        street, the problem could be easily resolved if our politcians were decent human beings. There are 7 vacant homes for each homeless
        person, we already have more than enough buildings to house these people. This does not include all the vacant buildings that could
        be easily converted into homes.

        Human labour is the root source of economic value.
        The national accounts of all countries that gather the necessary data show a strong correlation between human labour time and value, roughly 95%. You can check
        this yourself on the Australian Bureau of Statistics Website.

        </h6></>  }
        <br/>
        <br/>
        <button  onClick={()=>{setViewForm(!viewForm)}}>Create Listing?</button>
        {viewForm && <CreateItemForm />}
        <button  onClick={()=>{setViewShopForm(!viewShopForm)}}>Create Cooperative?</button>
        {viewShopForm && <CreateShopForm />}


<h2>Search</h2>
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
    name="shopOrItemValue"
    type='text'
    id='shopOrItemValue'>
    <option value="item">Item</option>
    <option value="shop">Shop</option>
  </select>




    <input type="submit" value="Submit" />
  </div>
</form>
<hr/>
<ItemList items={items}/>
<hr/>
<ShopList shops={shops}/>
          </CardContent>
        </Card>


    </div>)
}
