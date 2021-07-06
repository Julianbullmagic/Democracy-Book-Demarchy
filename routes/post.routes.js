const express =require( 'express')
const Post = require("../models/post.model");


const router = express.Router()



  router.route('/getposts/:groupId').get((req, res) => {
    console.log("getting posts")
    Post.find({group:req.params.groupId}, function (err, docs) {
      if (err){
          console.log(err);
      }
      else{
          console.log("Result : ", docs);
          res.status(200).json({
                      data: docs
                  })
      }})
  })


  router.route('/deletepost/:postId').delete((req, res) => {
          Post.findByIdAndDelete(req.params.postId)
          .exec()
})

router.route('/createpost/:postId').post((req, res) => {
  let postId = req.params.postId;


  var newPost=new Post({
    _id: postId,
    post:req.body["post"],
    preview :req.body["preview"],
    group:req.body["groupid"],
    timecreated:req.body["timecreated"],
    createdby:req.body["createdby"]
  });

console.log(newPost)
newPost.save((err,doc) => {
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
