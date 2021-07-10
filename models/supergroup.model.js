const mongoose = require('mongoose');


const superGroupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  chat: [{type:mongoose.Schema.Types.ObjectId,ref:"Chat"}],
  centroid:[Number],
  radius:Number,
  rules: [{type:mongoose.Schema.Types.ObjectId}],
  allmembers: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],

})

module.exports =  mongoose.model('SuperGroup', superGroupSchema)
