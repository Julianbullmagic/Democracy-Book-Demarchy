import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { MapContainer, TileLayer,Circle} from 'react-leaflet'
import GroupSearch from './GroupSearch'
import auth from './../auth/auth-helper'
import ChatPage from "./../ChatPage/ChatPage"
var geodist = require('geodist')

class GroupsList extends Component {


  constructor(props) {
         super(props);

         this.state = {
           groups: [],
           yourgroups:[],
           specificgroups:[],
           viewallgroups:false,
           viewyourgroups:false,
           viewyourlocalgroup:false,
           viewallsupergroups:false,
           supergroups:[],
          localgroup:{},
           imageIndex:0,

         }

this.viewAllGroups=this.viewAllGroups.bind(this)
this.viewYourLocalGroup=this.viewYourLocalGroup.bind(this)
this.viewYourGroups=this.viewYourGroups.bind(this)
this.viewAllSuperGroups=this.viewAllSuperGroups.bind(this)
this.updateGroups=this.updateGroups.bind(this)
           }

           async updateGroups(searchresults){
             console.log("searchresults",searchresults)

             this.setState({ groups:searchresults.data})
           }

viewAllGroups(e){
  e.preventDefault()

     fetch('/groups/findgroups').then(res => {
        return res.json();
      }).then(blob => {
        this.setState({groups: blob.data,
          viewallgroups:!this.state.viewallgroups,
        viewyourgroups:false,
        viewallsupergroups:false,
        viewyourlocalgroup:false})

      console.log("blob groups",blob.data)
      })
}


async viewAllSuperGroups(e){
  e.preventDefault()

     const supergroups=await fetch('/groups/findsupergroups').then(res => {
        return res.json();
      }).then(blob => {
        this.setState({supergroups: blob.data,
          viewallsupergroups:!this.state.viewallsupergroups,
          viewallgroups:false,
        viewyourlocalgroup:false,
        viewyourgroups:false})
        return blob.data
      })

console.log("supergroups",supergroups)
var specificgroups=[]
for (var supergroup of supergroups){
  const groupswithtitle=await fetch('/groups/findgroupsbytitle/'+supergroup.title).then(res => {
     return res.json();
   }).then(blob => {
     return blob.data
   })
   var localgroups=groupswithtitle.filter(group => {return group.level==0})
   console.log("localgroup",localgroups)


   const distances=localgroups.map(group=>{
     let dist=this.calculatedist(group['centroid'],auth.isAuthenticated().user.coordinates)
     return {
       group:group,
       distance:dist,
     }}
   )
   distances.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
   console.log("distances",distances)
specificgroups.push(distances[0]["group"])
}
this.setState({specificgroups:specificgroups})
}

    calculatedist(groupcoords,usercoords){
      return geodist({lat: usercoords[0], lon: usercoords[1]}, {lat: groupcoords[0], lon: groupcoords[1]})
    }


viewYourLocalGroup(e){
  e.preventDefault()

console.log("toggling")
      fetch('/groups/findlocalgroup/'+auth.isAuthenticated().user.localgroup).then(res => {
         return res.json();
       }).then(blob => {
         console.log("blob local group",blob.data)
         console.log(auth.isAuthenticated().user.localgroup)
         this.setState({localgroup: blob.data,
           viewyourlocalgroup:!this.state.viewyourlocalgroup,
           viewallgroups:false,
           viewallsupergroups:false,
           viewyourgroups:false
           })

})}



viewYourGroups(e){
e.preventDefault()
        fetch('/groups/findyourgroups/'+auth.isAuthenticated().user._id).then(res => {
           return res.json();
         }).then(blob => {
           console.log("blob local groups",blob['data'][0]['groupstheybelongto'])
           console.log(auth.isAuthenticated().user.localgroup)
           this.setState({yourgroups: [...blob['data'][0]['groupstheybelongto']],
             viewyourgroups:!this.state.viewyourgroups,
             viewallgroups:false,
             viewyourlocalgroup:false,
             viewallsupergroups:false
             })

  })
}




  render() {


    const redOptions = { color: 'red' }
    const fillBlueOptions = { fillColor: 'blue' }
    var zoom_level=9






    var yourgroupsmapped=<><h3>no groups</h3></>



    if(this.state.yourgroups){yourgroupsmapped=this.state.yourgroups.map(item => {


      return(
        <><div key={item._id}>
          <Link exact to={"/groups/" + item._id}>
                      <div>
                      <h2>{item.title&&item.title}</h2>
                      {item.description&&<h3>Description:{item.description}</h3>}
                      {item.level&&<h3>Level:{item.level}</h3>}
                       {item.location&&<h3>Location:{item.location}</h3>}

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
<Link className="gotogroup" exact to={"/groups/" + item._id}>
            <div>
            <h2>{item.title&&item.title}</h2>
            {item.description&&<h3>Description:{item.description}</h3>}
            {item.level&&<h3>Level:{item.level}</h3>}
             {item.location&&<h3>Location:{item.location}</h3>}

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
    var supergroupsmapped=<h3>no groups</h3>


    if(this.state.specificgroups){supergroupsmapped=this.state.specificgroups.map(item => {

          return(
            <>
            <div key={item._id}>
            <Link exact to={"/groups/" + item._id}>

                <div>
                <h2>{item.title&&item.title}</h2>
                {item.description&&<h3>Description:{item.description}</h3>}
                 {item.location&&<h3>Location:{item.location}</h3>}
                </div>
                </Link>
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
          <h1>Groups</h1>
          <br/>
          <br/>

        <section>
          <div >

          <button id="viewlocalgroup" onClick={(e)=>this.viewYourLocalGroup(e)}>View Your Local Group?</button>
          <button id="viewyourgroups" onClick={(e)=>this.viewYourGroups(e)}>View Your Groups?</button>
          <button id="viewallgroups" onClick={(e)=>this.viewAllGroups(e)}>View All Groups?</button>
          <button id="viewallsupergroups" onClick={(e)=>this.viewAllSuperGroups(e)}>View All Specfic Groups?</button>

{this.state.viewyourlocalgroup&& <><div key={this.state.localgroup._id}>
  <Link id="localgrouplink" exact to={"groups/" + this.state.localgroup._id}>
              <div>
               <h3>Your Local Group: {this.state.localgroup.location}</h3>
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


{this.state.viewyourgroups&&yourgroupsmapped}
{this.state.viewallsupergroups&&supergroupsmapped}
          {this.state.viewallgroups&&<GroupSearch updateGroups={this.updateGroups}/>}

          {this.state.viewallgroups&&groupsmapped}
          <br/>
          <br/>
          </div>
        </section>

      </React.Fragment>
    );
  }
}

export default GroupsList;
