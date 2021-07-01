import React, { Component } from 'react';
// import { Redirect } from 'react-router';
import auth from './../auth/auth-helper'



class NewRuleForm extends Component {

    constructor(props) {
           super(props)


  this.state = {
    rule:props.rule,
    groupId:props.groupId,
    ruleId:props.rule.ruleId,
newRule:'',
newRuleExplanation:'',
membersnum:props.members.length
  }

  this.handleSubmit=this.handleSubmit.bind(this)
  this.handleNewRuleChange=this.handleNewRuleChange.bind(this)
  this.handleNewRuleExplanationChange=this.handleNewRuleExplanationChange.bind(this)
  this.approve=this.approve.bind(this)



                fetch("rules/" + this.props.ruleId).then(res => {
                  return res.json();
                }).then(blob => {
                  this.setState({rule:blob})
                })


}

approve(e,suggestionId){



  const options={
      method: "PUT",
      body: '',
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}


    fetch("rules/approve/"+suggestionId+"/"+ auth.isAuthenticated().user._id, options)
            .then(response => response.json()).then(json => console.log(json))

            fetch("rules/" + this.props.ruleId).then(res => {
              return res.json();
            }).then(blob => {
              this.setState({rule:blob})
            })
}

handleNewRuleChange(event){
  this.setState({ newRule: event.target.value });

}

handleNewRuleExplanationChange(event){
  this.setState({ newRuleExplanation: event.target.value });

}

handleSubmit(e){
  e.preventDefault()

    const newRuleSuggestion={
      suggestion: this.state.newRule,
      suggestionExplanation:this.state.newRuleExplanation,
      groupId:this.state.groupId,
    }

    const options={
        method: "PUT",
        body: JSON.stringify(newRuleSuggestion),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}




    fetch("rules/addSuggestion/"+this.state.ruleId+"/"+ auth.isAuthenticated().user._id, options)
              .then(response => response.json()).then(json => console.log(json));

    fetch("rules/" + this.state.ruleId).then(res => {
                 return res.json();
              }).then(blob => {
                this.setState({rule:blob})
              })


}



render(){

var suggestionsmapped=this.state.rule.suggestions.map(item=>{

  let upvotes=[]
  let approval
  if(item.upvotes){
   upvotes=[...item.upvotes]

}
if(upvotes.length===0){
  approval=<h5>{upvotes.length} members approve of this rule</h5>
}
if(upvotes.length===1){
  approval=<h5>{upvotes.length} member approves of this rule</h5>
}
if(upvotes.length>1){
  approval=<h5>{upvotes.length} members approve of this rule</h5>
}


  return(<><h5>Rule Suggestion: {item.suggestion}</h5><h5>Explanation: {item.suggestionExplanation}</h5>
    {approval}


<br/>
    <button onClick={(e)=>this.approve(e,item._id)}>Approve?</button></>)
})


  return(
                     <form onSubmit={this.handleSubmit}>
                       <div>
                       <label>New Rule Suggestion</label>
                       <input
                         type='text'
                         name='New Rule Suggestion'
                         onChange={this.handleNewRuleChange}
                         id='New Rule Suggestion'
                       />
                       <label>Explanation</label>
                       <textarea
                      onChange={this.handleNewRuleExplanationChange}
                      rows={4}
                      cols={20}
                      />
                         <input type="submit" value="Submit" />
                       </div>
                       {suggestionsmapped}
                     </form>
)
}}

export default NewRuleForm;
