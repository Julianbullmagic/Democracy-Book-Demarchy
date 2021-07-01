const mongoose = require('mongoose');




const groupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  level:Number,
  location: {
    type: String,
  },
  centroid:[Number],
  radius:Number,
  groupabove:{type:mongoose.Schema.Types.ObjectId,ref:"HigherLevelGroup"},
  groupsbelow:[{type:mongoose.Schema.Types.ObjectId}],
  rules: [{type:mongoose.Schema.Types.ObjectId,ref:"Rule"}],
  members:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  allmembers: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],

})

module.exports =  mongoose.model('HigherLevelGroup', groupSchema)
