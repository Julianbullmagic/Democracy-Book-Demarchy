const express =require( 'express')
const router = express.Router();
const Event = require("../models/event.model");
const Group = require("../models/group.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);



router.get("/:eventId", (req, res, next) => {

    Event.findById(req.params.eventId)
    .populate('suggestions')
      .then(rule => res.json(rule))
      .catch(err => res.status(400).json('Error: ' + err));
  })




  router.delete("/:eventId", (req, res, next) => {

      Event.findByIdAndDelete(req.params.eventId)
      .exec()
    })


    router.route('/approveofevent/:eventId/:userId').put((req, res) => {
      let eventId = req.params.ruleId
      let userId = req.params.userId;

      const updatedEvent=Event.findByIdAndUpdate(eventId, {$addToSet : {
      approval:userId
    }}).exec()


    })

    router.route('/withdrawapprovalofevent/:eventId/:userId').put((req, res) => {
      let eventId = req.params.ruleId
      let userId = req.params.userId;

      const updatedEvent=Event.findByIdAndUpdate(eventId, {$pull : {
      approval:userId
    }}).exec()


    })

  router.route('/createevent/:eventId').post((req, res) => {
    let eventId = req.params.eventId;
    console.log("req.body",req.body)
    var newEvent=new Event({
      _id: eventId,
      title :req.body["title"],
      description :req.body["description"],
      location:req.body["location"],
      images:req.body["images"],
      level:req.body["level"],
      group:req.body["group"],
      timecreated:req.body["timecreated"],
      approval:req.body["approval"],
      grouptype:req.body["grouptype"]
    });
console.log("newEvent",newEvent)

  newEvent.save((err,doc) => {
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
