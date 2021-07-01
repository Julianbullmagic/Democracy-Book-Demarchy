const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { Chat } = require("../models/Chat");
const Group = require("../models/group.model");


router.get("/getChats",async (req, res) => {
    await Chat.find()
        .populate("sender")
        .exec((err, chats) => {
            if(err) return res.status(400).send(err);
            res.status(200).send(chats)
        })
})

router.get("/getChats/:groupId",async (req, res) => {
  var groupId=req.params.groupId

    await Chat.find({group:groupId})
        .populate("sender")
        .exec((err, chats) => {
            if(err) return res.status(400).send(err);
            res.status(200).send(chats)
        })
})

router.post("/addgroup",async (req, res) => {

let newGroup = new Group({
  _id: new mongoose.Types.ObjectId(),
  title :req.body["title"],
  description: req.body["description"],

});

newGroup.save((err) => {
  if(err){
    res.status(400).json({
      message: "The Item was not saved",
      errorMessage : err.message
   })
  }else{
    res.status(201).json({
      message: "Group was saved successfully"
   })
  }
})})


router.get("/getGroups",(req, res, next) => {
 Group.find()
        .exec((err, groups) => {
            console.log(groups)
            if(err) return res.status(400).send(err);
            res.status(200).send(groups)
        })
});

router.route('/addexpert/:userId').put((req, res) => {
  let userId = req.params.userId;
  const updatedRule=Group.findByIdAndUpdate(userId, {$addToSet : {
  experts:userId
}}).exec()


})

router.route('/removeexpert/:userId').put((req, res) => {
  let userId = req.params.userId;
  const updatedRule=Rule.findByIdAndUpdate(userId, {$pull : {
  experts:userId
}}).exec()


})





module.exports = router;
