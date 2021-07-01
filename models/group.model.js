const mongoose = require('mongoose');




const groupSchema = mongoose.Schema({
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
  groupabove:{type:mongoose.Schema.Types.ObjectId,ref:"HigherLevelGroup"},
  chat: [{type:mongoose.Schema.Types.ObjectId,ref:"Chat"}],
  centroid:[Number],
  radius:Number,
  rules: [{type:mongoose.Schema.Types.ObjectId}],
  members: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],

})

module.exports =  mongoose.model('Group', groupSchema)
