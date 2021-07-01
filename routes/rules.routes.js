const express =require( 'express')
const router = express.Router();
const Rule = require("../models/rule.model");
const Group = require("../models/group.model");
const Suggestion= require("../models/suggestion.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);


router.put("/addSuggestion/:ruleId/:userId", async (req, res, next) => {

    let ruleId = req.params.ruleId
    let userId = req.params.userId
console.log("finding suggestions")

  var existingSuggestion= await Suggestion.find({userId:userId}).exec()
  await console.log(existingSuggestion)
if(existingSuggestion.length<=3){
  var newSuggestion= new Suggestion({
    _id:new mongoose.Types.ObjectId(),

    userId:userId,
    suggestion: req.body["suggestion"],
    groupId:req.body['groupId'],
    suggestionExplanation:req.body["suggestionExplanation"]
  })

  console.log("new suggestion with userId")
  console.log(newSuggestion)

  newSuggestion.save((err) => {
    if(err){
      res.status(400).json({
        message: "The Item was not saved",
        errorMessage : err.message
     })
    }else{
      res.status(201).json({
        message: "Item was saved successfully"
     })
    }
  })

      const updatedRule=Rule.findByIdAndUpdate(ruleId, {$addToSet : {
      suggestions:newSuggestion._id
    }}).exec()

}
})

router.route('/approve/:suggestionId/:userId').put((req, res) => {
console.log(req.params.suggestionId)
console.log(req.params.userId)
let suggestionId = req.params.suggestionId
let userId = req.params.userId;
  const suggestion=Suggestion.findByIdAndUpdate(suggestionId, {$addToSet : {
  upvotes:userId
}}).exec()

})

router.get("/:ruleId", (req, res, next) => {


    Rule.findById(req.params.ruleId)
    .populate('suggestions')
      .then(rule => res.json(rule))
      .catch(err => res.status(400).json('Error: ' + err));
  })



  router.route('/createrule/:ruleId').post((req, res) => {
    let ruleId = req.params.ruleId;
    console.log("req.body",req.body)
    var newRule=new Rule({
      _id: ruleId,
      rule :req.body["rule"],
      level:req.body["level"],
      approval:req.body["approval"],
      grouptype:req.body["grouptype"]
    });


  newRule.save((err,doc) => {
    if(err){
      res.status(400).json({
        message: "The Item was not saved",
        errorMessage : err.message
     })
    }else{
      res.status(201).json({
        message: "Item was saved successfully",
        data:doc
     })
    }
  })})





module.exports= router
