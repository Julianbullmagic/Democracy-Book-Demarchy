import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {Image} from 'cloudinary-react'
import auth from './../auth/auth-helper'

class ItemList extends Component {


  constructor(props) {
         super(props);
         this.state = {
           items: props.items,
           imageIndex:0
         }
     }

     componentWillReceiveProps(nextProps) {
       this.setState({ items: nextProps.items });
     }


  render(props) {

    console.log("items in render")
console.log(this.state.items)
    return (
      <React.Fragment>
        <header>
          <h1>Items</h1>
        </header>
        <section>
          <div >
            {this.state.items&&this.state.items.map(item => {


              return(
                <>
                <div key={item._id}>
          <Link exact to={"singlemarketplaceitem/" + item._id}>
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
          </div>
        </section>

      </React.Fragment>
    );
  }
}

export default ItemList;
