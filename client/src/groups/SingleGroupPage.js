import React, { Component } from 'react';
import auth from './../auth/auth-helper'
import Newsfeed from './../post/Newsfeed'
import NewRuleForm from './newRuleForm'
import Kmeans from 'node-kmeans';
const KmeansLib = require('kmeans-same-size');
const kmeans = require('node-kmeans');
const mongoose = require("mongoose");
const geolib = require('geolib');
var geocluster = require("geocluster");






class SingleGroupPage extends Component {

    constructor(props) {
           super(props);
           this.state = {
             location:"",
             grouptype:props.match.params.grouptype,
             highorlow:props.match.params.higherlower,
             centroid:"",
             members:[],
             radius:0,
             leaders:[],
             candidates:[],
             allmembers:[],
             higherlevelgroup:'',
             groupData:{},
             newLowerGroupIds:[],
             id:'',
             rules: [],
             redirect: false,
             updating:false
           }



    }





componentDidMount(){

if(this.state.highorlow=="higher"){

               fetch("/"+this.state.grouptype+'/populatehighergroupmembers/'+this.props.match.params.groupId).then(res => {
                 return res.json();
               }).then(blob => {
                 console.log("blob in single group page",blob)

            this.setState({groupData:blob['data'][0],
            id:this.props.match.params.groupId,
            location:blob['data'][0]['location'],
            higherlevelgroup:blob['data'][0]['higherlevelgroup'],
            allmembers:blob['data'][0]['allmembers'],
            location:blob['data'][0]['location'],
            rules: blob['data'][0]['rules'],
            centroid: blob['data'][0]['centroid'],
            members: blob['data'][0]['members']})


          })
}




if(this.state.highorlow=="lower"){
console.log("this.props.match.params.groupId",this.props.match.params.groupId)
               fetch("/"+this.state.grouptype+'/populatemembers/'+this.props.match.params.groupId).then(res => {
                 return res.json();
               }).then(blob => {
                 console.log("blob in single group page",blob)


            this.setState({groupData:blob['data'][0],
            id:this.props.match.params.groupId,
            location:blob['data'][0]['location'],
            expertcandidates:blob['data'][0]['expertcandidates'],
            higherlevelgroup:blob['data'][0]['higherlevelgroup'],
            leaders:blob['data'][0]['leaders'],
            rules: blob['data'][0]['rules'],
            centroid: blob['data'][0]['centroid'],
            members: blob['data'][0]['members']})


          })
}






}





       approve(e,id){
var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
function checkRule() {
  return id!==auth.isAuthenticated().user._id
}
for (var rule of rulescopy){
  if (rule._id==id){

 if(!rule.approval.includes(auth.isAuthenticated().user._id)){
   rule.approval.push(auth.isAuthenticated().user._id)
 }

this.setState({rules:rulescopy})
  }
}

this.setState({rules:rulescopy})
         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/"+this.state.grouptype+"/approve/" + id +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}


       withdrawapproval(e,id){
         var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
         function checkRule(userid) {
           return userid!=auth.isAuthenticated().user._id
         }
         for (var rule of rulescopy){
           if (rule._id==id){


             var filteredapproval=rule.approval.filter(checkRule)
             rule.approval=filteredapproval
           }
         }
         this.setState({rules:rulescopy})

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/"+this.state.grouptype+"/withdrawapproval/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

       }

       join(e){
         var memberscopy=[...this.state.members]
         memberscopy.push(auth.isAuthenticated().user._id)

         this.setState({members: memberscopy});

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/"+this.state.grouptype+"/join/"+this.props.match.params.groupId+"/"+ auth.isAuthenticated().user._id, options
)  .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch(this.props.match.params.groupId).then(res => {
    return res.json();
  }).then(blob => {

this.setState({members: blob.members});
  })


       }

       leave(e){
         var memberscopy=[...this.state.members]
         var filteredarray = memberscopy.filter(function( obj ) {
    return obj._id !== auth.isAuthenticated().user._id;
});
         this.setState({members:filteredarray});

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/"+this.state.grouptype+"/leave/"+this.props.match.params.groupId+"/"+ auth.isAuthenticated().user._id, options
)  .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

       }







  render() {



    var rulescomponent=<h3>no rules</h3>
    if (this.state.members&&this.state.rules&&this.props.match.params.groupId){
      rulescomponent=this.state.rules.map(item => {


        var memberids=this.state.members.map(item=>{return item._id})
        console.log(item.approval)
        console.log(memberids)
        var peoplewhoapproveincurrentgroup=item.approval.filter(approvee => memberids.includes(approvee))
console.log(peoplewhoapproveincurrentgroup.length)
        var approval=peoplewhoapproveincurrentgroup.length/this.state.members.length*100
        console.log(approval)

        var approvalcomponent=<h5>{Math.round(approval)}% Approval, {peoplewhoapproveincurrentgroup.length} out of {this.state.members.length} members</h5>
if(this.state.allmembers.length>0){
  peoplewhoapproveincurrentgroup=item.approval.filter(approvee => this.state.allmembers.includes(approvee))

  approval=peoplewhoapproveincurrentgroup.length/this.state.allmembers.length*100
  approvalcomponent=<h5>{Math.round(approval)}% Approval, {peoplewhoapproveincurrentgroup.length} out of {this.state.allmembers.length} members</h5>
}


        return(

          <div key={item._id}>
          <hr/>
      <h3>{item.name}</h3>
      <button onClick={(e)=>this.approve(e,item._id)}>Approve this rule?</button>
      <button onClick={(e)=>this.withdrawapproval(e,item._id)}>Withdraw Approval?</button>


              <div>
               <h4>{item.rule}</h4>
               {approvalcomponent}


              </div>
              <br/>
          </div>
        )
      })}

var joinOrLeave=<><button onClick={(e)=>this.join(e)}>Join Group?</button></>


      var memberids=this.state.members.map(item=>{return item._id})
      if(memberids.includes(auth.isAuthenticated().user._id)){
        joinOrLeave=<><button onClick={(e)=>this.leave(e)}>Leave Group?</button></>
      }

    return (
      <React.Fragment>
          <section >
<br/>
<br/>

          <h2>Group Details</h2>



          <div >

          {this.state.title&&<p>Group Title: <strong> {this.state.title}</strong></p>}
          {this.state.location&&<p>Group Location: <strong> {this.state.location}</strong></p>}


          {joinOrLeave}

            <p>Description: <strong> {this.state.description}</strong> </p>
            <h2>Group Rules: <strong>   {rulescomponent} </strong></h2>
              {this.state.id&&this.state.leaders&& <Newsfeed groupId={this.state.id} leaders={this.state.leaders}/>}

          </div>



         </section>

      </React.Fragment>
    );
  }
}

export default SingleGroupPage;
