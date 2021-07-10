const express =require( 'express')
const router = express.Router();
const userCtrl =require( '../controllers/user.controller')
const authCtrl =require( '../controllers/auth.controller')
const ExpertCandidate = require("../models/expertcandidate.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Event = require("../models/event.model");
require('dotenv').config();
const nodemailer = require('nodemailer');
const Rule = require("../models/rule.model");
const LocalGroup = require("../models/localgroup.model");
const HigherLevelGroup = require("../models/higherlevelgroup.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);




router.post("/creategroup", (req, res, next) => {

   let newGroup = new Group({
     _id: req.body['_id']||new mongoose.Types.ObjectId(),
     location:req.body['location'],
     centroid: req.body["centroid"],
   });


   newGroup.save((err) => {
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
})


router.put("/adddatatohigherlevelgroup/:groupId", (req, res, next) => {
  let groupId = req.params.groupId;

    HigherLevelGroup.findByIdAndUpdate(groupId, {$addToSet : {lowerGroupIds:{$each:[...req.body.newlowergroupids]}}}).exec()
    HigherLevelGroup.findByIdAndUpdate(groupId, {$addToSet : {members:{$each:[...req.body.newgroupids]}}}).exec()
    HigherLevelGroup.findByIdAndUpdate(groupId, {$addToSet : {allmembers:{$each:[...req.body.ids]}}}).exec()
    HigherLevelGroup.findById(groupId).exec(function(err,docs){
      if(err){
              console.log(err);
          }else{
              res.status(200).json({
                          data: docs
                      })}})})

                      router.put("/recallmemberfromhighergroup/:highergroupId/:memberid", (req, res, next) => {
                          let highergroupId = req.params.highergroupId;
                          let memberId = req.params.memberId;

                           HigherLevelGroup.findByIdAndUpdate(highergroupId, {$pull : {members:memberId}}).exec()
                           HigherLevelGroup.findById(groupId).exec(function(err,docs){
                            if(err){
                              console.log(err);
                            }else{
                              res.status(200).json({
                                        data: docs
                                      })}})})





                      router.get("/gethigherlevelgroup", (req, res, next) => {
                            const items=HigherLevelGroup.find({ }, {members: 1 })
                            .exec(function(err,docs){
                              if(err){
                                      console.log(err);
                                  }else{
                                      res.status(200).json({
                                                  data: docs
                                              });
                            }

                        })})


router.put("/joinhigherlevelgroup/:groupId/:userId", (req, res, next) => {
  let userId = req.params.userId;
  let groupId = req.params.groupId;

      const updatedGroup=HigherLevelGroup.findByIdAndUpdate(groupId, {$addToSet : {
      members:userId
    }}).exec()

User.findByIdAndUpdate(
  { _id: userId },
  { higherlevelgrouptheybelongto: groupId },
  function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  }
)
    })


router.post('/sendelectionnotification/:groupName/:groupId', (req, res, next) => {
  console.log("send election notfication")
  var emails = req.body
  var groupId=req.params.groupId
var groupName=req.params.groupName


  if(emails.length>0){

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD // naturally, replace both with your real credentials or an application-specific password
      }
    })
    const optionsArray=emails.map(email=>{
      const mailOptions = {
        from: "democracybooknews@gmail.com",
        to: email,
        subject: 'Election Notification',
        text: `The group called ${groupName} is having an election, please take the time to read the candidates\' experience and qualifications. If you don\'t have time for this, please abstain from voting. You have three days to make your decision`
      };
      return mailOptions
    })

    optionsArray.forEach(sendEmails)

    function sendEmails(item){
      transporter.sendMail(item, function(error, info){
        if (error) {
      	console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })

    }
  }})















router.route('/getmembers/:groupid').get((req, res) => {
  let groupId = req.params.groupid

  Group.findById({_id:groupId})
.populate('members')
.populate('experts')
  .exec(function(err,docs){
    if(err){
            console.log(err);
        }else{

            res.status(200).json({
                        data: docs
                    })
  }
   })
})















router.route('/withdrawdisapproval/:ruleId/:userId').put((req, res) => {
  let ruleId = req.params.ruleId
  let userId = req.params.userId;

  const updatedRule=Rule.findByIdAndUpdate(ruleId, {$pull : {
  disagree:userId
}}).exec()


})









function sendElectionReminder(){
let transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: process.env.EMAIL, // TODO: your gmail account
    pass: process.env.PASSWORD // TODO: your gmail password
}
});

// Step 2
let mailOptions = {
from: 'DemocracyBookUpdates@gmail.com', // TODO: email sender
to: 'Julianbullmagic@gmail.com', // TODO: email receiver
subject: 'Nodemailer - Test',
text: 'Wooohooo it works!!'
};

// Step 3
transporter.sendMail(mailOptions, (err, data) => {
if (err) {
    return log('Error occurs');
}
return log('Email sent!!!');
})
}



router.get("/findgroupscoordinates", (req, res, next) => {
      const items=LocalGroup.find({ }, { _id: 1, centroid: 1 })
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }

  })})

  router.put("/joinlocalgroup/:groupId/:userId", (req, res, next) => {
    let userId = req.params.userId;
    let groupId = req.params.groupId;
console.log("adding member to localgroup", groupId,userId)
        const updatedGroup=LocalGroup.findByIdAndUpdate(groupId, {$addToSet : {
        members:userId
      }}).exec()



      })





      router.route('/addruletogroup/:groupId/:ruleId').put((req, res) => {
        let groupId = req.params.groupId;
        let ruleId = req.params.ruleId;
        console.log("ids",groupId,ruleId)


        const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
        rules:ruleId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })

      router.route('/removerulefromgroup/:groupId/:ruleId').put((req, res) => {
        let groupId = req.params.groupId;
        let ruleId = req.params.ruleId;
        console.log("removing rule from normal group",groupId,ruleId)


        const updatedGroup=Group.findByIdAndUpdate(groupId, {$pull : {
        rules:ruleId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })


      router.route('/addruletohighergroup/:groupId/:ruleId').put((req, res) => {
        let groupId = req.params.groupId;
        let ruleId = req.params.ruleId;
        console.log("ids",groupId,ruleId)

        const updatedGroup=HigherLevelGroup.findByIdAndUpdate(groupId, {$addToSet : {
        rules:ruleId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })

      router.route('/removerulefromhighergroup/:groupId/:ruleId').put((req, res) => {
        let groupId = req.params.groupId;
        let ruleId = req.params.ruleId;
        console.log("removing rule from higher group",groupId,ruleId)


        const updatedGroup=HigherLevelGroup.findByIdAndUpdate(groupId, {$pull : {
        rules:ruleId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })

      router.route('/addeventtogroup/:groupId/:eventId').put((req, res) => {
        let groupId = req.params.groupId;
        let eventId = req.params.eventId;

      console.log("ids",groupId,eventId)

        const updatedGroup=LocalGroup.findByIdAndUpdate(groupId, {$addToSet : {
        events:eventId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })

      router.route('/removeeventfromgroup/:groupId/:eventId').put((req, res) => {
        let groupId = req.params.groupId;
        let eventId = req.params.eventId;
        console.log("removing event form local group",groupId,eventId)

        const updatedGroup=LocalGroup.findByIdAndUpdate(groupId, {$pull : {
        events:eventId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })


      router.route('/addeventtohighergroup/:groupId/:eventId').put((req, res) => {
        let groupId = req.params.groupId;
        let eventId = req.params.eventId;
        console.log("ids",groupId,eventId)

        const updatedGroup=HigherLevelGroup.findByIdAndUpdate(groupId, {$addToSet : {
        events:eventId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })

      router.route('/removeeventfromhighergroup/:groupId/:eventId').put((req, res) => {
        let groupId = req.params.groupId;
        let eventId = req.params.eventId;
        console.log("removing event from higher group",groupId,eventId)


        const updatedGroup=HigherLevelGroup.findByIdAndUpdate(groupId, {$pull : {
        events:eventId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })




      router.get("/findlocalgroup/:groupId", (req, res, next) => {
        let groupId = req.params.groupId;
            const items=Group.findById(groupId).exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                      res.status(200).json({
                                  data: docs
                              });
            }
        })})







router.post("/createlocalgroup", (req, res, next) => {

   let newGroup = new LocalGroup({
     _id: new mongoose.Types.ObjectId(),
     location:req.body['location'],
     centroid: req.body["centroid"],
   });


   newGroup.save((err) => {
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
})

router.get("/findgroups", (req, res, next) => {

      const items=Group.find()
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }

  })})


      router.get("/getmemberids/:groupId", (req, res, next) => {
        let groupId = req.params.groupId;
      Group.find({_id:groupId}, { _id: 1, members: 1 })
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }

      })


          })




  router.get("/populatemembers/:groupId", (req, res, next) => {
    let groupId = req.params.groupId;
        const items=Group.find({_id:groupId})
        .populate('members')
        .populate('groupabove')
        .populate({
       path    : 'events',
       populate: { path: 'group', model: LocalGroup }
       })
        .populate('groupsbelow')
        .populate({
       path    : 'rules',
       populate: { path: 'group', model: LocalGroup }
       })
        .exec(function(err,docs){
          if(err){
                  console.log(err);
              }else{
                console.log("docs",docs)
                  res.status(200).json({
                              data: docs
                          });
        }
    })})

    router.get("/populatehighergroupmembers/:groupId", (req, res, next) => {
      let groupId = req.params.groupId;
          const items=HigherLevelGroup.find({_id:groupId})
          .populate('members')
          .populate('associatedlocalgroups')
          .populate('groupabove')
          .populate({
         path    : 'events',
         populate: { path: 'group', model: HigherLevelGroup }
         })
          .populate({ path: 'groupsbelow', model: LocalGroup })
          .populate({ path: 'groupsbelow', model: HigherLevelGroup })
          .populate({path:'rules',populate:{ path: 'group', model: HigherLevelGroup }})
          .exec(function(err,docs){
            if(err){
                    console.log(err);
                }else{
                  console.log("docs",docs)
                    res.status(200).json({
                                data: docs
                            });
          }
      })})


      router.get("/findgroups", (req, res, next) => {

            const items=Group.find()
            .populate('members')
            .exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                      res.status(200).json({
                                  data: docs
                              });
            }

        })})
      router.get("/findhigherlevelgroups", (req, res, next) => {

            const items=HigherLevelGroup.find()
            .populate('members')
            .exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                      res.status(200).json({
                                  data: docs
                              });
            }

        })})

        router.get("/getgroup/:groupId", (req, res, next) => {
          let groupId = req.params.groupId;

              const items=Group.find({_id:groupId})
              .exec(function(err,docs){
                if(err){
                        console.log("err",err);
                    }else{
                      console.log("docs",docs)
                        res.status(200).json({
                                    data: docs
                                });
              }
          })})






    router.route('/join/:groupId/:userId').put((req, res) => {
      let userId = req.params.userId;
      let groupId = req.params.groupId;


      const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
      members:userId
    }}).exec()


    })

    router.route('/leave/:groupId/:userId').put((req, res) => {
      let userId = req.params.userId;
      let groupId = req.params.groupId;


      const updatedGroup=Group.findByIdAndUpdate(groupId, {$pull : {
      members:userId
    }}).exec()


    })








       router.route('/newhigherlevelgroup/').post((req, res) => {

      let newGroup = new HigherLevelGroup({
        _id: req.body["_id"],
        title :req.body["title"],
        location:req.body["location"],
        lastcandidateshuffle:req.body["lastcandidateshuffle"],
        description: req.body["description"],
        centroid: req.body["centroid"],
        rules: req.body["rules"],
        members: req.body["members"],
        allmembers: req.body["allmembers"],
        lowerGroupIds:req.body["newLowerGroupIds"]

      });



      newGroup.save((err) => {
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
      })





         router.route('/deletelowergroup/:id').delete((req, res) => {
           let groupid = req.params.id

          Group.findByIdAndDelete(groupid, function(err,docs){
            if(err){
                    console.log(err);
                }else{

                    res.status(200).json({
                                data: docs
                            })
          }
           })


         })

         router.route('/deletehighergroup/:id').delete((req, res) => {
           let groupid = req.params.id

          HigherLevelGroup.findByIdAndDelete(groupid, function(err,docs){
            if(err){
                    console.log(err);
                }else{

                    res.status(200).json({
                                data: docs
                            })
          }
           })


         })



router.route('/:id').get((req, res) => {

let id=req.params.id
  Group.findById(id)
  .populate('rules')
  .populate('members')
    .then(group => res.json(group))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Group.findByIdAndDelete(req.params.id)
    .then(() => res.json('Group deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});







router.route('/join/:groupId/:userId').put((req, res) => {
  let userId = req.params.userId;
  let groupId = req.params.groupId;


  const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
  members:userId
}}).exec()




})

router.route('/update/:id').post((req, res) => {
  Group.findById(req.params.id)
    .then(post => {
      post.name = req.body.name;
      post.category = req.body.category;
      post.image = req.body.image;
      post.text = req.body.text;
      post.date = req.body.date;

      post.save()
        .then(() => res.json('Group updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});






router.get("/getuser/:userId", (req, res, next) => {
  var userId=req.params.userId
  console.log("userId in router",userId)
  const items=User.findById(userId, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
        console.log("Result : ", docs);
        res.status(200).json({
                    data: docs
                })
    }
})
})

router.post("/createuser", (req, res, next) => {
  var user=req.body.user
        let newUser = new User(user);

console.log("new user in server",newUser)
        newUser.save((err,docs) => {
          if(err){
            console.log(err)
            res.status(400).json({
              message: "The Item was not saved",
              errorMessage : err.message
           })
          }else{
            console.log("DOCS",docs)
            res.status(201).json({
              message: "Item was saved successfully",
              data:docs
           })
          }
        })

})


router.route('/addusertogroup/:groupId/:userId').put((req, res) => {
  let groupId = req.params.groupId;
  let userId = req.params.userId;
  const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
  members:userId
}}, function(err, result){

        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }

    })
})

router.route('/removeuserfromgroup/:groupId/:userId').put((req, res) => {
  let groupId = req.params.groupId;
  let userId = req.params.userId;


  const updatedGroup=Group.findByIdAndUpdate(groupId, {$pull : {
  members:userId
}}, function(err, result){

        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }

    })
})







module.exports= router
