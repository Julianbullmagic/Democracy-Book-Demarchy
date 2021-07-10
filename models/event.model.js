const mongoose = require('mongoose');


const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  description:String,
  location:String,
  images:[{type:String}],
  group:{type:mongoose.Schema.Types.ObjectId,ref:"HigherLevelGroup"},
  approval: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  coordinates:[Number],
  timecreated:Number,
  level:Number,
  grouptype:String
})

module.exports =  mongoose.model('Event', eventSchema)
