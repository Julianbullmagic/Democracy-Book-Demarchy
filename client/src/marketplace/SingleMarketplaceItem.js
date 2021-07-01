import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { MapContainer, TileLayer,Circle} from 'react-leaflet'
import {Image} from 'cloudinary-react'


import auth from './../auth/auth-helper'

class SingleMarketPlaceItem extends Component {


  constructor(props) {
         super(props);

         this.state = {
        item:{},
        current:0

         }
         this.nextSlide=this.nextSlide.bind(this)
         this.prevSlide=this.prevSlide.bind(this)
         fetch('/marketplace/getoneitem/'+props.match.params.itemId).then(res => {
            return res.json();
          }).then(blob => {
this.setState({item:blob.data[0]})

          console.log("blob one item",blob.data)
          })
           }


           nextSlide(){
             console.log(this.state.item.images)
             if (this.state.item.images) {
             const length = this.state.item.images.length
             this.setState({current:this.state.current === length - 1 ? 0 : this.state.current + 1});}
           };

           prevSlide(){
             if (this.state.item.images) {
               const length = this.state.item.images.length
                this.setState({current:this.state.current === 0 ? length - 1 : this.state.current - 1});
             }
           };








  render() {




console.log(this.state.item.images)
    var slides=<h3>no slides</h3>
if(this.state.item.images){





             if (!Array.isArray(this.state.item.images) || slides.length <= 0) {
               return null;
             }



}




    return (
      <>
      <hr/>
      <hr/>
      <hr/>
      <hr/>
          <h1>{this.state.item.title}</h1>
          <h2>{this.state.item.description}</h2>
          <h2>{this.state.item.priceorrate}</h2>


    <section className='slider'>
      <button className='left-arrow' onClick={this.prevSlide}>Next Image</button>
      <button className='right-arrow' onClick={this.nextSlide}>Previous Image</button>
      {this.state.item.images&&this.state.item.images.map((slide, index) => {
        return (
          <div className='image'
            className={index === this.state.current ? 'slide active' : 'slide'}
            key={index}
          >
            {index === this.state.current && (
              <Image style={{width:500}} cloudName="julianbullmagic" publicId={slide} />
            )}
          </div>
        );
      })}
    </section>



      </>
    )

}}

export default SingleMarketPlaceItem;
