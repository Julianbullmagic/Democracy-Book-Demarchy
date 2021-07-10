import React, {useRef,useState} from 'react'
import auth from '../auth/auth-helper'
const mongoose = require("mongoose");


export default function CreateRuleForm(props) {
const ruleValue = React.useRef('')
const explanationValue = React.useRef('')

const [toggle, setToggle] = useState(false);



async function handleSubmit(e) {
e.preventDefault()
    var d = new Date();
    var n = d.getTime();
    var ruleId=mongoose.Types.ObjectId()
    ruleId=ruleId.toString()

    const newPost={
      _id:ruleId,
      rule: ruleValue.current.value,
      explanation:explanationValue.current.value,
      timecreated:n,
      level:props.level,
      grouptype:props.grouptype,
      approval:[auth.isAuthenticated().user._id]
    }

    const postToRender={
      _id:ruleId,
      rule: ruleValue.current.value,
      explanation:explanationValue.current.value,
      timecreated:n,
      level:props.level,
      grouptype:props.grouptype,
      approval:[auth.isAuthenticated().user._id]
    }

if(props.higherlower=="higher"){
  newPost.group=props.id
  postToRender.group=props.group
}

console.log("newPost.group",newPost.group)
    props.updateRules(postToRender)
    console.log(newPost)
    const options={
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}


      await fetch("/rules/createrule/"+ruleId, options)
              .then(response => response.json()).then(json => console.log(json));

              const optionstwo = {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json'
                },
                   body: ''
              }

if(props.higherlower=="higher"){
  await fetch("/groups/addruletohighergroup/"+props.id+"/"+ruleId, optionstwo)

}else{
  if(props.grouptype=='localgroup'){
    await fetch("/localgroup/addruletogroup/"+props.id+"/"+ruleId, optionstwo)
  }
  if(props.grouptype=='groups'){
    await fetch("/groups/addruletogroup/"+props.id+"/"+ruleId, optionstwo)
  }
}




}


  return (
    <section className='section search'>

      <form className='search-form'>
        <div className='form-control'>
        <label htmlFor='name'>Rule</label>
        <input
          type='text'
          name='ruleValue'
          id='ruleValue'
          ref={ruleValue}

        />
        <label htmlFor='name'>Explanation</label>
        <input
          type='text'
          name='explanationValue'
          id='explanationValue'
          ref={explanationValue}

        />

        <button onClick={(e) => handleSubmit(e)}>Submit Rule</button>


        </div>
      </form>
    </section>
  )}
