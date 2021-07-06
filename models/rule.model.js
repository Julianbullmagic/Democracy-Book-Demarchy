const mongoose = require('mongoose');
const User = require("../models/user.model");
const Suggestion = require("../models/suggestion.model");


const ruleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rule: {
    type: String,
    required: true
  },
  explanation:String,
  group:{type:mongoose.Schema.Types.ObjectId,ref:"HigherLevelGroup"},
  approval: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  coordinates:[Number],
  timecreated:Number,
  level:Number,
  grouptype:String
})

module.exports =  mongoose.model('Rule', ruleSchema)
