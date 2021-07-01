import React, { Component } from 'react';
import {Link} from "react-router-dom";
import CreateItemForm from './CreateItemForm'
import auth from './../auth/auth-helper'
import {Image} from 'cloudinary-react'

class SingleMarketPlaceShop extends Component {



  constructor(props) {
         super(props);
console.log(props)
         this.state = {
          items:[],
          toggleForm:false,
          cooperativeId:props.match.params.shopId,
          searchTerm:'',
         }
this.handleSubmit=this.handleSubmit.bind(this)
           }

componentDidMount(){
  fetch("/marketplace/shopitems/"+this.state.cooperativeId).then(res => {
     return res.json();
   }).then(blob => {
     console.log("data",blob.data)
     this.setState({items:[...blob.data]})
   })

}

handleClick(){
this.setState({toggleForm:!this.state.toggleForm})
}

handleChange = (e) =>{
   this.setState({searchTerm: e.target.value});
   console.log(this.state.searchTerm)
 }







   handleSubmit(e) {
     e.preventDefault()

     if(this.state.searchTerm){

              fetch("/marketplace/getshopitems/"+this.state.searchTerm+"/"+this.state.cooperativeId)
                      .then(response => response.json()).then(blob =>
                        {
                          console.log("shopdata",blob.data)

                          this.setState({items:[...blob.data]})
                        })



   }else{

          fetch("/marketplace/shopitems/"+this.state.cooperativeId).then(res => {
             return res.json();
           }).then(blob => {
             console.log("data",blob.data)
             this.setState({items:[...blob.data]})
           })
   }
 }








  render(props) {



    return (
      <>
      <br/>
      <br/>
      <br/>
      <br/>
      <button  onClick={()=>{this.handleClick()}}>Create Item?</button>
      {this.state.toggleForm && <CreateItemForm cooperativeId={this.state.cooperativeId}/>}

      <h2>Items</h2>

      <h2>Search</h2>
      <form className='search-form' onSubmit={this.handleSubmit}>
        <div className='form-control'>
        <label htmlFor='name'>Search for Items</label>
        <input type="text" onChange={this.handleChange} />


          <input type="submit" value="Submit" />
        </div>
      </form>





      {this.state.items&&this.state.items.map(item => {


        return(
          <>
          <div key={item._id}>
    <Link exact to={"/singlemarketplaceitem/" + item._id}>
              <div>
               <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>{item.priceorrate}</p>
              <Image style={{width:40}} cloudName="julianbullmagic" publicId={item.images[0]} />

              </div></Link>
          </div>
          </>
        )
      })}

      </>

    )
  }
}

export default SingleMarketPlaceShop;
