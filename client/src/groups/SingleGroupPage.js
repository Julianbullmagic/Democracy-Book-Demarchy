import React, { Component } from 'react';
import {Link} from "react-router-dom";
import auth from './../auth/auth-helper'
import Newsfeed from './../post/Newsfeed'
import CreateRuleForm from './CreateRuleForm'
import CreateEventForm from './CreateEventForm'
import Kmeans from 'node-kmeans';
import {Image} from 'cloudinary-react'
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
             level:0,
             radius:0,
             candidates:[],
             events:[],
             associatedlocalgroups:[],
             allmembers:[],
             allgroupsbelow:[],
             higherlevelgroup:'',
             groupData:{},
             newLowerGroupIds:[],
             id:'',
             rules: [],
             redirect: false,
             updating:false
           }
           this.updateRules= this.updateRules.bind(this)
           this.updateEvents= this.updateEvents.bind(this)

              }



              updateRules(newrule){
                console.log("newrule",newrule)
                var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
                rulescopy.push(newrule)
                this.setState({ rules:rulescopy})}

componentDidUpdate(){
  console.log("rules",this.state.rules)

}

updateEvents(newevent){
  console.log("newevent",newevent)
  var eventscopy=JSON.parse(JSON.stringify(this.state.events))
  eventscopy.push(newevent)
  this.setState({ events:eventscopy})}

componentDidUpdate(){
console.log("rules",this.state.rules)
console.log("events",this.state.events)
}

           componentDidMount(){
             console.log("grouptype",this.props.match.params.grouptype)
             console.log("props",this.props.match.params)
             if(this.props.match.params.higherlower=="higher"){
             this.getHigherGroupData(this.props.match.params.grouptype,this.props.match.params.groupId)
             }


             if(this.props.match.params.higherlower=="lower"){
             this.getLowerGroupData(this.props.match.params.grouptype,this.props.match.params.groupId)

           }}



           async getHigherGroupData(grouptype,groupid){

                      await fetch("/"+grouptype+'/populatehighergroupmembers/'+groupid).then(res => {
                        return res.json();
                      }).then(blob => {
                        console.log("blob in single higher group page",grouptype,blob)

                   this.setState({groupData:blob['data'][0],
                   id:groupid,
                   grouptype:grouptype,
                   level:blob['data'][0]['level'],
                   associatedlocalgroups:blob['data'][0]['associatedlocalgroups'],
                   groupabove:blob['data'][0]['groupabove'],
                   groupsbelow:blob['data'][0]['groupsbelow'],
                   events:blob['data'][0]['events'],
                   allmembers:blob['data'][0]['allmembers'],
                   rules: blob['data'][0]['rules'],
                   centroid: blob['data'][0]['centroid'],
                   members: blob['data'][0]['members']})

                   if(blob['data'][0]['location']){
                     this.setState({location:blob['data'][0]['location']})
                   }


           })



           var localgroups=await fetch("/localgroup/findgroups")
           .then(data=>{return data.json()})
           localgroups=localgroups.data
           var groups=await fetch("/groups/findgroups")
           .then(data=>{return data.json()})
           groups=groups.data;





          this.checkruleapproval("higher")


         }

           async getLowerGroupData(grouptype,groupid){
                      await fetch("/"+grouptype+'/populatemembers/'+groupid).then(res => {
                        return res.json();
                      }).then(blob => {
                        console.log("blob in single group page",blob)


                   this.setState({groupData:blob['data'][0],
                   id:groupid,
                   grouptype:grouptype,
                   rules: blob['data'][0]['rules'],
                   events:blob['data'][0]['events'],
                   centroid: blob['data'][0]['centroid'],
                   groupabove:blob['data'][0]['groupabove'],
                   members: blob['data'][0]['members']})

                   if(blob['data'][0]['location']){
                     this.setState({location:blob['data'][0]['location']})
                   }

                   this.checkruleapproval("lower")

                 })
           }



async deleteRule(item,higherorlower){
  console.log("deleting rule",item,higherorlower)


  var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
  function checkRule(rule) {
    return rule._id!=item._id
  }

      var filteredapproval=rulescopy.filter(checkRule)
console.log(filteredapproval)

  this.setState({rules:filteredapproval})

if(higherorlower=="lower"){


if(this.state.grouptype=="localgroup"){
const optionstwo = {
method: 'put',
headers: {
'Content-Type': 'application/json'
},
body: ''
}

await fetch("/localgroup/removerulefromgroup/"+this.state.id+"/"+item._id, optionstwo)

if(item.group){
  for (var group of item.group.associatedlocalgroups){
    console.log("group being deleted",group)
    await fetch("/localgroup/removerulefromgroup/"+group+"/"+item._id, optionstwo)

  }
  await fetch("/groups/removerulefromhighergroup/"+item.group._id+"/"+item._id, optionstwo)

}
}

if(this.state.grouptype=="groups"){
const optionstwo = {
method: 'put',
headers: {
'Content-Type': 'application/json'
},
body: ''
}

await fetch("/groups/removerulefromgroup/"+this.state.id+"/"+item._id, optionstwo)

if(item.group){
  await fetch("/groups/removerulefromhighergroup/"+item.group._id+"/"+item._id, optionstwo)
}
}

}

if(higherorlower=="higher"){

console.log(this.state.id,item._id)
const optionstwo = {
method: 'put',
headers: {
'Content-Type': 'application/json'
},
body: ''
}

await fetch("/groups/removerulefromhighergroup/"+this.state.id+"/"+item._id, optionstwo)


}

const options = {
  method: 'delete',
  headers: {
    'Content-Type': 'application/json'
  },
     body: ''
}

await fetch("/rules/"+item._id, options)
}

checkruleapproval(higherorlower){
  var d = new Date();
  var n = d.getTime();


for (var item of this.state.rules){
          var memberids=this.state.members.map(item=>{return item._id})
          var peoplewhoapproveincurrentgroup=item.approval.filter(approvee => memberids.includes(approvee))
          var approval=peoplewhoapproveincurrentgroup.length/this.state.members.length*100
          if (item.group){
            var wholegroup=item.approval.filter(approvee=>item.group.allmembers.includes(approvee))
            var wholegroupapproval=wholegroup.length/item.group.allmembers.length*100
            console.log("wholegroupapproval",wholegroupapproval,wholegroup.length,item.group.allmembers)

            if(wholegroupapproval<50&&(n-item.timecreated)>2592000000){
              this.deleteRule(item,higherorlower)
            }

            if(approval<50&&(n-item.timecreated)>604800000&&item.group._id==this.state.id){
            this.deleteRule(item,higherorlower)
          }else{
            if(higherorlower=="higher"){
          for (var localgroup of this.state.associatedlocalgroups){
            var rules=localgroup.rules.map(item=>{return item.rule})
          if(!rules.includes(item.rule)){
            this.sendRuleDown(this.state.level,this.state.id,item,this.state.groupData,localgroup._id)
          }
          }
          }
          }
          }else{
            if(approval<50&&(n-item.timecreated)>604800000){
      this.deleteRule(item,higherorlower)
  }


}}}

        async sendRuleDown(level,groupid,rule,groupData,localgroupid) {

  console.log("sending rule down",rule,localgroupid)
            const options = {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
                 body: ''
            }

            await fetch("/localgroup/addruletogroup/"+localgroupid+"/"+rule._id, options)



    }








       approveofrule(e,id){
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

         fetch("/rules/approveofrule/" + id +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}


       withdrawapprovalofrule(e,id){
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

         fetch("/rules/withdrawapprovalofrule/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

       }


       approveofevent(e,id){
var eventscopy=JSON.parse(JSON.stringify(this.state.events))
function checkEvent() {
  return id!==auth.isAuthenticated().user._id
}
for (var ev of eventscopy){
  if (ev._id==id){

 if(!ev.approval.includes(auth.isAuthenticated().user._id)){
   ev.approval.push(auth.isAuthenticated().user._id)
 }

this.setState({events:eventscopy})
  }
}

this.setState({events:eventscopy})
         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/events/approveofevent/" + id +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}


       withdrawapprovalofevent(e,id){
         var eventscopy=JSON.parse(JSON.stringify(this.state.events))
         function checkEvent(userid) {
           return userid!=auth.isAuthenticated().user._id
         }
         for (var ev of eventscopy){
           if (ev._id==id){


             var filteredapproval=ev.approval.filter(checkEvent)
             ev.approval=filteredapproval
           }
         }
         this.setState({events:eventscopy})

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/events/withdrawapprovalofevent/" + id +"/"+ auth.isAuthenticated().user._id, options
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

    seeWhoApproves(e,ruleapproval){
      console.log(ruleapproval)
    }






  render() {



    var rulescomponent=<h3>no rules</h3>
    if (this.state.members&&this.state.rules&&this.props.match.params.groupId){

      rulescomponent=this.state.rules.map(item => {


        var memberids=this.state.members.map(item=>{return item._id})

        var peoplewhoapproveincurrentgroup=item.approval.filter(approvee => memberids.includes(approvee))
        var approval=peoplewhoapproveincurrentgroup.length/this.state.members.length*100

        if(item.group){
          var wholegroup=item.approval.filter(approvee=>item.group.allmembers.includes(approvee))
          var wholegroupapproval=wholegroup.length/item.group.allmembers.length*100
          console.log("wholegroupapproval",item.approval.length,item.group.allmembers.length,wholegroupapproval,wholegroup.length,item.group.allmembers)
          var wholegroupapprovalcomponent=<h5>{Math.round(wholegroupapproval)}% Approval overall in all groups considering this rule, {wholegroup.length} out of {item.group.allmembers.length} members</h5>

        }

        if(item.explanation){
          var explanation=<h5>Explanation:{item.explanation}</h5>

        }
        var approvalcomponent=<h5>{Math.round(approval)}% Approval in this particular group, {peoplewhoapproveincurrentgroup.length} out of {this.state.members.length} members</h5>

        var d = new Date();
        var n = d.getTime();
        var timesincecreation=`${Math.round((n-item.timecreated)/86400000)} days since creation `
        var daysleftforhigherapproval=`${7-Math.round((n-item.timecreated)/86400000)} days left to approve this rule to be suggested to lower groups`
        var daysleftforapproval=`${7-Math.round((n-item.timecreated)/86400000)} days left to approve this rule`

        if(item.group){
          var daysleftforlowerapproval=`${31-Math.round((n-item.timecreated)/86400000)} days left to approve by all related local groups.`
        }


        return(

          <div key={item._id}>
          <hr/>
          <h4>{item.rule}</h4>
      <h4>Rule Level:{item.level}</h4>
      {explanation}
      {item.approval.includes(auth.isAuthenticated().user._id)&&<h4>You have approved this rule</h4>}
      {item.approval.includes(auth.isAuthenticated().user._id)&&approval<3&&<h4>Try to persuade other members of why this is a good idea</h4>}
      {!item.approval.includes(auth.isAuthenticated().user._id)&&<button onClick={(e)=>this.approveofrule(e,item._id)}>Approve this rule?</button>}

      {item.approval.includes(auth.isAuthenticated().user._id)&&<button onClick={(e)=>this.withdrawapprovalofrule(e,item._id)}>Withdraw Approval?</button>}
<button onClick={(e)=>this.seeWhoApproves(e,item.approval)}>See who approves?</button>

              <div>
               {(approval<50)&&approvalcomponent}
               {(approval>50)&&wholegroupapprovalcomponent&&wholegroupapprovalcomponent}

               {timesincecreation}
               {(approval<50)&&this.state.level>0&&daysleftforhigherapproval&&daysleftforhigherapproval}
               {approval<50&&this.state.level>0&&daysleftforlowerapproval&&daysleftforlowerapproval}
               {approval<50&&this.state.level==0&&daysleftforapproval&&daysleftforapproval}

\
              </div>
              <br/>
          </div>
        )
      })}





          var eventscomponent=<h3>no events</h3>
          if (this.state.members&&this.state.events&&this.props.match.params.groupId){

            eventscomponent=this.state.events.map(item => {


              var memberidstwo=this.state.members.map(item=>{return item._id})

              var peoplewhoapproveincurrentgroup=item.approval.filter(approvee => memberidstwo.includes(approvee))

              var approval=peoplewhoapproveincurrentgroup.length/this.state.members.length*100

              if(item.group){
                var wholegroup=item.approval.filter(approvee=>item.group.allmembers.includes(approvee))
                var wholegroupapproval=wholegroup.length/item.group.allmembers.length*100
                console.log("wholegroupapproval",item.approval.length,item.group.allmembers.length,wholegroupapproval,wholegroup.length,item.group.allmembers)
                var wholegroupapprovalcomponent=<h5>{Math.round(wholegroupapproval)}% Attendance in all groups considering this event, {wholegroup.length} out of {item.group.allmembers.length} members</h5>

              }

              if(item.description){
                var description=<h5>Description:{item.description}</h5>

              }
              if(item.location){
                var location=<h5>Location:{item.location}</h5>

              }
              var images=<h5>No Images</h5>
              if(item.images.length>0){
                console.log("images")
                for (var img of item.images){
                  console.log("img",img)
                }
                 images=item.images.map(item=>{return <Image style={{width:200}} cloudName="julianbullmagic" publicId={item} />})

              }
              var approvalcomponent=<h5>{Math.round(approval)}% Approval in this particular event, {peoplewhoapproveincurrentgroup.length} out of {this.state.members.length} members</h5>

              var d = new Date();
              var n = d.getTime();
              var timesincecreation=`${Math.round((n-item.timecreated)/86400000)} days since creation `
              var daysleftforhigherapproval=`${7-Math.round((n-item.timecreated)/86400000)} days left to approve this event to be suggested to lower groups`
              var daysleftforapproval=`${7-Math.round((n-item.timecreated)/86400000)} days left to approve this event`

              if(item.group){
                var daysleftforlowerapproval=`${31-Math.round((n-item.timecreated)/86400000)} days left to approve by all related local groups.`
              }


              return(

                <div key={item._id}>
                <hr/>
                <h4>{item.title}</h4>
            <h4>Item Level:{item.level}</h4>
            {description}
            {location}
            {images}
            {item.approval.includes(auth.isAuthenticated().user._id)&&<h4>You are attending this event</h4>}
            {item.approval.includes(auth.isAuthenticated().user._id)&&approval<3&&<h4>Try to persuade other members of why this event is a good idea</h4>}
            {!item.approval.includes(auth.isAuthenticated().user._id)&&<button onClick={(e)=>this.approveofevent(e,item._id)}>Attend this event?</button>}

            {item.approval.includes(auth.isAuthenticated().user._id)&&<button onClick={(e)=>this.withdrawapprovalofevent(e,item._id)}>Don't want to attend anymore?</button>}

                    <div>
                     {(approval<50)&&approvalcomponent}
                     {(approval>50)&&wholegroupapprovalcomponent&&wholegroupapprovalcomponent}

                     {timesincecreation}
                     {(approval<50)&&this.state.level>0&&daysleftforhigherapproval&&daysleftforhigherapproval}
                     {approval<50&&this.state.level>0&&daysleftforlowerapproval&&daysleftforlowerapproval}
                     {approval<50&&this.state.level==0&&daysleftforapproval&&daysleftforapproval}
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
console.log("state",this.state)
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

            {this.state.groupabove&&
              <><h2>Group Above</h2><Link className="gotogroup" exact to={"/groups/" + this.state.groupabove._id+"/groups/higher"}><h2>Group Above {this.state.title&&this.state.title}{this.state.groupabove.location}</h2></Link></>}
          {this.state.groupsbelow&&<h2>Groups below</h2>}
            {this.state.groupsbelow&&(this.state.level>1)&&this.state.groupsbelow.map(item=>
              {return <Link className="gotogroup" exact to={"/groups/" + item._id+"/localgroup/higher"}> <h2>Group Below {item.title&&item.title}{item.location}</h2></Link>})}
              {this.state.groupsbelow&&(this.state.level==1)&&this.state.groupsbelow.map(item=>
                {return <Link className="gotogroup" exact to={"/groups/" + item._id+"/localgroup/lower"}> <h2>Group Below {item.title&&item.title}{item.location}</h2></Link>})}
            <h2>Propose a Rule</h2>
            <CreateRuleForm group={this.state.groupData} id={this.state.id} grouptype={this.state.grouptype} higherlower={this.state.highorlow} level={this.state.level} updateRules={this.updateRules}/>

            <h2>Group Rules: <strong>   {rulescomponent} </strong></h2>
            <h2>Propose an Event</h2>
            <CreateEventForm group={this.state.groupData} id={this.state.id} grouptype={this.state.grouptype} higherlower={this.state.highorlow} level={this.state.level} updateEvents={this.updateEvents}/>
            <h2>Group Events: <strong>   {eventscomponent} </strong></h2>

              <Newsfeed groupId={this.state.id} group={this.state.groupData} />

          </div>


         </section>

      </React.Fragment>
    );
  }
}


export default SingleGroupPage;
