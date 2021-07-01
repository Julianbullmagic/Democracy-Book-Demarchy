import React, { Component } from 'react';
import {Link} from "react-router-dom";

import auth from './../auth/auth-helper'

class ShopList extends Component {


  constructor(props) {
         super(props);
         this.state = {
           shops: props.shops,
         }

   }

   componentWillReceiveProps(nextProps) {
     this.setState({ shops: nextProps.shops });  
   }

  render(props) {
    console.log("shops in render")

console.log(this.state.shops)
    return (
      <React.Fragment>
        <header>
          <h1>Shops</h1>
        </header>
        <section>
          <div >
            {this.state.shops&&this.state.shops.map(item => {


              return(
                <>
                <div key={item._id}>
          <Link exact to={"singlemarketplaceshop/" + item._id}>
                    <div>
                     <h3>{item.title}</h3>
                    <p>{item.description}</p>

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

export default ShopList;
