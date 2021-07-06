import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { MapContainer, TileLayer,Circle} from 'react-leaflet'

import auth from './../auth/auth-helper'

class GroupsList extends Component {


  constructor(props) {
         super(props);

         this.state = {
           groups: [],
           higherlevelgroups:[],
           myhigherlevelgroups:[],
           viewallgroups:false,
           viewyourlocalgroup:false,
           viewallhigherlevelgroups:false,
           viewalllocalgroups:false,
           localgroups:[],
          localgroup:{},
           imageIndex:0,

         }

this.viewAllLocalGroups=this.viewAllLocalGroups.bind(this)
this.viewAllGroups=this.viewAllGroups.bind(this)
this.viewAllHigherLevelGroups=this.viewAllHigherLevelGroups.bind(this)
this.viewYourLocalGroup=this.viewYourLocalGroup.bind(this)
           }



viewAllGroups(){
     fetch('/groups/findgroups').then(res => {
        return res.json();
      }).then(blob => {
        this.setState({groups: blob.data,
          viewallgroups:!this.state.viewallgroups,
        viewyourlocalgroup:false,
        viewallhigherlevelgroups:false,
        viewalllocalgroups:false})

      console.log("blob groups",blob.data)
      })
}

viewAllHigherLevelGroups(){

      fetch('/groups/findhigherlevelgroups').then(res => {
         return res.json();
       }).then(blob => {
         console.log(blob.data)
         this.setState({higherlevelgroups: [...blob.data],
           viewallhigherlevelgroups:!this.state.viewallhigherlevelgroups,
           viewallgroups:false,
         viewyourlocalgroup:false,
         viewalllocalgroups:false,})

       console.log("blob higher level groups",blob.data)
       })
}

viewYourLocalGroup(){
console.log("toggling")
      fetch('/localgroup/findlocalgroup/'+auth.isAuthenticated().user.localgroup).then(res => {
         return res.json();
       }).then(blob => {
         console.log("blob local group",blob.data)
         console.log(auth.isAuthenticated().user.localgroup)
         this.setState({localgroup: blob.data,viewyourlocalgroup:!this.state.viewyourlocalgroup,
           viewallgroups:false,
           viewallhigherlevelgroups:false,
           viewalllocalgroups:false,})

})}

viewAllLocalGroups(){
console.log(this.state.viewalllocalgroups)
console.log(this.state.localgroups)
      fetch('/localgroup/findgroups/').then(res => {
         return res.json();
       }).then(blob => {
         console.log("blob local groups",blob.data)
         console.log(auth.isAuthenticated().user.localgroup)
         this.setState({localgroups: [...blob.data],viewalllocalgroups:!this.state.viewalllocalgroups,
           viewallgroups:false,
           viewyourlocalgroup:false,
           viewallhigherlevelgroups:false
           })

})}






  render() {



    var higherlevelgroupsmapped=<h3>no groups</h3>



if(this.state.higherlevelgroups){higherlevelgroupsmapped=this.state.higherlevelgroups.map(item => {

      return(
        <><div key={item._id}>
          <Link exact to={"/groups/" + item._id+"/groups/higher"}>
                      <div>
                       <h3>{item.location}</h3>
                       <h4>Group Level: {item.level}</h4>

                      </div></Link>

                  </div>
                      <MapContainer center={[item.centroid[0],item.centroid[1]]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                          {item.radius&&<Circle center={[item.centroid[0],item.centroid[1]]} radius={item.radius} />}

                      </MapContainer></>
      )
    })}


    var localgroupsmapped=<><h3>no groups</h3></>

    const redOptions = { color: 'red' }
    const fillBlueOptions = { fillColor: 'blue' }
    var zoom_level=9

    if(this.state.localgroups){localgroupsmapped=this.state.localgroups.map(item => {


      return(
        <><div key={item._id}>
          <Link exact to={"/groups/" + item._id+"/localgroup/lower"}>
                      <div>
                       <h3>{item.location}</h3>
                      </div></Link>

                  </div>
                      <MapContainer center={[item.centroid[0],item.centroid[1]]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                            {item.radius&&<Circle center={[item.centroid[0],item.centroid[1]]} radius={item.radius} />}

                      </MapContainer></>
      )
    })}


    var groupsmapped=<h3>no groups</h3>


if(this.state.groups){groupsmapped=this.state.groups.map(item => {

      return(
        <>
        <div key={item._id}>
<Link className="gotogroup" exact to={"/groups/" + item._id+"/groups/lower"}><h3>{item.name}</h3>
            <div>
             <h3>{item.title}</h3>
            <p>{item.description}</p>

            </div></Link>
        </div>
        <MapContainer center={[item.centroid[0],item.centroid[1]]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
            {item.radius&&<Circle center={[item.centroid[0],item.centroid[1]]} radius={item.radius} />}

        </MapContainer>
        </>
      )
    })}

    return (
      <React.Fragment>
        <header>
          <h1>Groups</h1>
          <hr/>
          <hr/>

        </header>
        <section>
          <div >
          <h3>Your Local Group</h3>
          <button id="viewlocalgroup" onClick={this.viewYourLocalGroup}>View Your Local Group?</button>

{this.state.viewyourlocalgroup&& <><div key={this.state.localgroup._id}>
  <Link id="localgrouplink" exact to={"groups/" + this.state.localgroup._id+"/localgroup/lower"}>
              <div>
               <h3>{this.state.localgroup.location||"Your Local Group"}</h3>
              </div>
</Link>
          </div>
              <MapContainer center={[this.state.localgroup.centroid[0],this.state.localgroup.centroid[1]]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.state.localgroup.radius &&  <Circle center={[this.state.localgroup.centroid[0],this.state.localgroup.centroid[1]]} radius={this.state.localgroup.radius} />}
              </MapContainer></>}
              <hr/>

              <h3>All Local Groups</h3>
    <button onClick={this.viewAllLocalGroups}>View All Local Groups?</button>
{this.state.viewalllocalgroups&&localgroupsmapped}

              <hr/>
          <h3>Groups</h3>
          <br/>
          <button id="viewallgroups" onClick={this.viewAllGroups}>View All Groups?</button>
          {this.state.viewallgroups&&groupsmapped}
          <hr/>
          <h3>Higher Level Groups</h3>
          <br/>
          <button onClick={this.viewAllHigherLevelGroups}>View All Higher Level Groups?</button>
          {this.state.viewallhigherlevelgroups&&higherlevelgroupsmapped}
          </div>
        </section>

      </React.Fragment>
    );
  }
}

export default GroupsList;
