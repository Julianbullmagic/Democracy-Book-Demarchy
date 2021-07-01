import React, {useRef, useState} from 'react'
import auth from './../auth/auth-helper'
import Axios from 'axios'
import {Image} from 'cloudinary-react'



export default function CreateItemForm(props) {
const titleValue = React.useRef('')
const descriptionValue = React.useRef('')
const priceorrate = React.useRef('')
const selectedFile1 = React.useRef(null)
const selectedFile2 = React.useRef(null)
const selectedFile3 = React.useRef(null)
const selectedFile4 = React.useRef(null)
const selectedFile5 = React.useRef(null)


const [numberOfImages, setNumberOfImages]=useState(1)

function addImages(){
  var numberplusone=numberOfImages+1

  setNumberOfImages(numberplusone)
}

function lessImages(){
  var numberminusone=numberOfImages-1


  setNumberOfImages(numberminusone);

}



async function handleSubmit(e) {
  e.preventDefault()
  let imageids=[]
  console.log(selectedFile1.current.files[0],selectedFile2.current.files[0],
    selectedFile3.current.files[0],selectedFile4.current.files[0],selectedFile5.current.files[0])
if(selectedFile1.current.files[0]){
  const formData = new FormData();
formData.append('file', selectedFile1.current.files[0]);
formData.append("upload_preset", "jvm6p9qv");
await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
.then(response => {
  console.log("cloudinary response",response)
  imageids.push(response.data.public_id)
})}

if(selectedFile2.current.files[0]){const formData = new FormData();
formData.append('file', selectedFile2.current.files[0]);
formData.append("upload_preset", "jvm6p9qv");
await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
.then(response => {
  console.log("cloudinary response",response)
  imageids.push(response.data.public_id)
})}

if(selectedFile3.current.files[0]){const formData = new FormData();
formData.append('file', selectedFile3.current.files[0]);
formData.append("upload_preset", "jvm6p9qv");
await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
.then(response => {
  console.log("cloudinary response",response)
  imageids.push(response.data.public_id)
})}

if(selectedFile4.current.files[0]){const formData = new FormData();
formData.append('file', selectedFile4.current.files[0]);
formData.append("upload_preset", "jvm6p9qv");
await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
.then(response => {
  console.log("cloudinary response",response)
  imageids.push(response.data.public_id)
})}

if(selectedFile5.current.files[0]){const formData = new FormData();
formData.append('file', selectedFile5.current.files[0]);
formData.append("upload_preset", "jvm6p9qv");
await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
.then(response => {
  console.log("cloudinary response",response)
  imageids.push(response.data.public_id)
})}

console.log("imageids",imageids)

    const newItem={
      title: titleValue.current.value,
      description:descriptionValue.current.value||'',
    priceorrate:priceorrate.current.value||'',
    groupId:props.cooperativeId||'',
    images:imageids
    }
    console.log(newItem)
    const options={
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}


      await fetch("/marketplace/additem/"+ auth.isAuthenticated().user._id, options)
              .then(response => response.json()).then(json => console.log(json));


}






  return (
    <div>
    <section className='section search'>
      <form className='search-form' onSubmit={handleSubmit}>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={titleValue}

        />
        <label htmlFor='Description'>Description</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={descriptionValue}

        />
        <label htmlFor='Price or Rate'>Price or Rate</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={priceorrate}
        />

        <label>Upload Image</label>

        <input id="file" type="file" ref={selectedFile1}/>
        <input id="file2" type="file" ref={selectedFile2}/>
        <input id="file3" type="file" ref={selectedFile3}/>
        <input id="file4" type="file" ref={selectedFile4}/>
        <input id="file5" type="file" ref={selectedFile5}/>

                <button onClick={addImages}>Add another image</button>
                <button onClick={lessImages}>Add one less image</button>




          <input type="submit" value="Submit" />
        </div>
      </form>
    </section>
    <Image style={{width:40}} cloudName="julianbullmagic" publicId="lddwbitvfahyvgtcuwvx" />
    </div>
  )}
