const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors  = require('cors')
const path = require('path')
const axios = require('axios');
const compress = require( 'compression')
const helmet = require( 'helmet')
const userRoutes = require( './routes/user.routes')
const authRoutes = require( './routes/auth.routes')
const postRoutes = require( './routes/post.routes')
const groupsRoutes = require( './routes/groups.routes')
const rulesRoutes = require( './routes/rules.routes')
const eventsRoutes = require( './routes/events.routes')
const localGroupRoutes = require( './routes/localgroup.routes')
const marketplaceRoutes = require( './routes/marketplace.routes')
const fileUpload = require('express-fileupload');
const multer=require('multer')
const { Chat } = require("./models/Chat");
const { auth } = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const fs = require("fs");
var cron = require('node-cron');
const User = require("./models/user.model");
const Group = require("./models/group.model");

const Rule = require("./models/rule.model");
const Event = require("./models/event.model");
const KmeansLib = require('kmeans-same-size');
var kmeans = new KmeansLib();
const LocalGroup = require("./models/localgroup.model");
const SuperGroup = require("./models/supergroup.model");
const ExpertCandidate = require("./models/expertcandidate.model");

var geocluster = require("geocluster");
var geodist = require('geodist')





//comment out before building for production
const PORT = process.env.PORT || 5000

const app = express();
const server = require("http").createServer(app);


const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});



app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(cookieParser());

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
  next();
})


const connect = mongoose
  .connect("mongodb+srv://Julian_Bull:bIGP1SxlM3RvYHEl@cluster0.k6i5j.mongodb.net/Democracy-Book?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.log(err));


// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)
app.use('/groups', groupsRoutes)
app.use('/rules', rulesRoutes)
app.use('/marketplace', marketplaceRoutes)
app.use('/events', eventsRoutes)

app.use('/localgroup',localGroupRoutes)
app.use('/posts',postRoutes)

app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}





//
// cron.schedule('0 0 0 * * *', () => {

  (async function(){
    // await Group.updateMany({},{$set:{expertcandidates:[],rules:[],events:[] }},
    //                               function (err, docs) {
    //       if (err){
    //           console.log(err)
    //       }
    //       else{
    //           // console.log("Updated User : ", docs);
    //       }
    //   })
  // var groups=await Group.find({ }).exec()
  //
  // var groupcategories={}
  // groupcategories['localgroup']=[]
  // for (let group of groups){
  //
  //   if (!group.title){
  //
  //     groupcategories['localgroup'].push(group)
  //   }
  //
  //   if (group.title){
  //
  //     if (groupcategories.hasOwnProperty(`${group.title}`)){
  //       groupcategories[`${group.title}`].push(group)
  //     }else{
  //       groupcategories[`${group.title}`]=[group]
  //     }
  //   }
  // }
  //
  //
  // for (let groups in groupcategories){
  //
  //
  //   await divideandsortcandidates(groupcategories[`${groups}`],groups)
  // }
})();

// });




// cron.schedule('* * * *', () => {





(async function(){


//   await Group.deleteMany({}).then(function(){
//     console.log("Data deleted"); // Success
//   }).catch(function(error){
//     console.log(error); // Failure
//   });
//
//
//     await User.updateMany({},{$set:{groupstheybelongto:[] }},
//                               function (err, docs) {
//       if (err){
//           console.log(err)
//       }
//       else{
//           // console.log("Updated User : ", docs);
//       }
//   })
//
//
//
//     var supergroups=await SuperGroup.find({ })
//     .populate("allmembers")
//     .exec()
//     console.log("supergroups",supergroups)
//
// var users=await User.find({ })
//
// var localgroupusers={
//   allmembers:users
// }
//
//
// await divideUsersIntoGroups(localgroupusers,"localgroup")
//
//
// for (var grou of supergroups){
// await divideUsersIntoGroups(grou,"normal")
// }
//
//
//
// async function divideUsersIntoGroups(gr,ty){
//   if (gr.allmembers.length>40){
//   var levelzerogroups=await divideUsersAtLevelIntoGroups(gr,ty,40,0)
//   }
//   if (gr.allmembers.length>160){
//   var levelonegroups=await divideUsersAtLevelIntoGroups(gr,ty,160,1,levelzerogroups)
//   }
//   if (gr.allmembers.length>640){
//     var leveltwogroups=await divideUsersAtLevelIntoGroups(gr,ty,640,2,levelzerogroups,levelonegroups)
//
//   }
//   if (gr.allmembers.length>2560){
//     var levelthreegroups=await divideUsersAtLevelIntoGroups(gr,ty,2560,3,levelzerogroups,leveltwogroups)
//   }
//   if (gr.allmembers.length>10240){
//     var levelfourgroups=await divideUsersAtLevelIntoGroups(gr,ty,10240,4,levelzerogroups,levelthreegroups)
//   }
//
//   console.log("groups!",levelzerogroups.length)
//   if(levelonegroup){
//     console.log(levelonegroups.length)
//   }
//   if(leveltwogroup){
//     console.log(leveltwogroups.length)
//   }
//   if(levelthreegroup){
//     console.log(levelthreegroups.length)
//   }
// var groupids=[]
// if(levelzerogroups){
//   var levelzerogroupsids=levelzerogroups.map(item=>{return item._id})
//   groupids.push(...levelzerogroupsids)
// }
// if(levelonegroups){
//   var levelonegroupsids=levelonegroups.map(item=>{return item._id})
//   groupids.push(...levelonegroupsids)
//   for (var levelonegroup of levelonegroups){
//     for (var higher of levelonegroup.groupsbelow){
//       await Group.findByIdAndUpdate(higher, { groupabove:levelonegroup._id },
//                                 function (err, docs) {
//         if (err){
//             console.log(err)
//         }
//         else{
//             // console.log("Updated User : ", docs);
//         }
//     })
//     }
//   }
// }
// if(leveltwogroups){
//   var leveltwogroupsids=leveltwogroups.map(item=>{return item._id})
//   groupids.push(...leveltwogroupsids)
//   for (var leveltwogroup of leveltwogroups){
//     for (var highertwo of leveltwogroup.groupsbelow){
//       await Group.findByIdAndUpdate(highertwo, { groupabove:leveltwogroup._id },
//                                 function (err, docs) {
//         if (err){
//             console.log(err)
//         }
//         else{
//             // console.log("Updated User : ", docs);
//         }
//     })
//     }
//   }
// }
// if(levelthreegroups){
//   var levelthreegroupsids=levelthreegroups.map(item=>{return item._id})
//   groupids.push(...levelthreegroupsids)
//   for (var levelthreegroup of levelthreegroups){
//   for (var higherthree of levelthreegroup.groupsbelow){
//     await Group.findByIdAndUpdate(higherthree, { groupabove:levelthreegroup._id },
//                               function (err, docs) {
//       if (err){
//           console.log(err)
//       }
//       else{
//           // console.log("Updated User : ", docs);
//       }
//   })
//   }
// }
// }
// if(levelfourgroups){
//   var levelfourgroupsids=levelfourgroups.map(item=>{return item._id})
//   groupids.push(...levelfourgroupsids)
//   for (var levelfourgroup of levelfourgroups){
//   for (var higherfour of levelfourgroup.groupsbelow){
//     await Group.findByIdAndUpdate(higherfour, { groupabove:levelfourgroup._id },
//                               function (err, docs) {
//       if (err){
//           console.log(err)
//       }
//       else{
//           // console.log("Updated User : ", docs);
//       }
//   })
//   }
// }
// }
// console.log("groupids",groupids)
//
//   await SuperGroup.findByIdAndUpdate(gr._id, { groups:groupids },
//                             function (err, docs) {
//     if (err){
//         console.log(err)
//     }
//     else{
//         // console.log("Updated User : ", docs);
//     }
// })
//
//
// }
//
//
//
//   async function divideUsersAtLevelIntoGroups(supergroup,type,theshold,level,localgroups,groupsonelevelbelow){
//
// var highergroups=[]
//
//       const k=Math.round(supergroup.allmembers.length/theshold)   // Groups Number
//
//       console.log("k",k)
//       const size = theshold // Group size
//
//       var docsCopy=JSON.parse(JSON.stringify(supergroup.allmembers))
//       let vectors=supergroup.allmembers.map(item=>{return {x:item.coordinates[0],y:item.coordinates[1]}})
//     kmeans.init({k: k, runs: size, equalSize: true, normalize: false })
//     const sum = kmeans.calc(vectors);
//
//
//     for (var vector of vectors){
//       for (var user of docsCopy){
//         if (user.coordinates[0]==vector.x&&user.coordinates[1]==vector.y&&!user.k){
//           user.k=vector.k
//         }
//       }
//     }
//     var groups={}
//     for (var user of docsCopy){
//       if (groups.hasOwnProperty(`${user.k}`)){
//         groups[`${user.k}`].push(user)
//       }else{
//         groups[`${user.k}`]=[user]
//       }
//     }
//     var highermembers=[]
//
//
//     for (const group in groups) {
//       var latlongroup=groups[`${group}`].map(member=>{return {lat: member.coordinates[0], lon: member.coordinates[1]}})
//       var coordinates=groups[`${group}`].map(member=>{return [member.coordinates[0],member.coordinates[1]]})
//       var userIds=groups[`${group}`].map(member=>{return member._id})
//
//       var bias = 10
//
//     var result = geocluster(coordinates, bias)
//
//     var latloncentroid={lat: result[0]['centroid'][0], lon: result[0]['centroid'][1]}
//     distancesArray=[]
//     for (var latlon of latlongroup){
//       var dist = geodist(latloncentroid, latlon)
//     distancesArray.push(dist)
//     }
//     distancesArray.sort()
//     var location=await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${result[0]['centroid'][1]},${result[0]['centroid'][0]}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
//       .then(data => {
//         if(data['data']['features'].length>0){
//
//           return data['data']['features'][0]['text']
//         }
//     })
//
//     var associatedlocalgroups=[]
//     if(localgroups){
//       for (var localgroup of localgroups){
//       console.log(typeof localgroup.members[0])
//       console.log(typeof userIds[0])
//
//     var c = userIds.filter(approvee => localgroup.members.includes(approvee))
//     if (c.length/localgroup.members.length>0.5){
//     associatedlocalgroups.push(localgroup._id)
//     }
//   }}
//     var associatedhighergroupsdirectlybelow=[]
//
//   if(groupsonelevelbelow){
//     for (var groupbelow of groupsonelevelbelow){
//   console.log("groupbelow",groupbelow)
//     var c = userIds.filter(approvee => groupbelow.allmembers.includes(approvee))
//     console.log("c.length",c.length)
//     if (c.length/groupbelow.allmembers.length>0.75){
//     associatedhighergroupsdirectlybelow.push(groupbelow._id)
//     }
//
//     }
//   }
//   console.log("associatedhighergroupsdirectlybelow",associatedhighergroupsdirectlybelow)
//
// console.log("TYPE",type)
//
//       var id=new mongoose.Types.ObjectId().toString()
//       var shuffledmembers=shuffle(userIds)
//       let newGroup = new Group({
//         _id:id,
//         level:level,
//         type:type,
//         title:supergroup.title,
//         description:supergroup.description,
//         location:supergroup.location,
//         centroid:supergroup.centroid,
//         radius:distancesArray[0],
//         location:location,
//         associatedlocalgroups:associatedlocalgroups,
//         centroid:result[0]['centroid'],
//       });
//       if (level==1){
//         newGroup.groupsbelow=associatedlocalgroups
//
//       }
//       if (level>1){
//         newGroup.groupsbelow=associatedhighergroupsdirectlybelow
//       }
//       if (level>0){
//         newGroup.members=shuffledmembers.slice(0,40)
//         newGroup.allmembers= userIds
//
//       }
//       if(level==0){
//         newGroup.members=userIds
//         newGroup.allmembers= userIds
//       }
//       highergroups.push(newGroup)
//
//
//       newGroup.save((err,docs) => {
//         if(err){
//           console.log(err);
//         }else{
//           // console.log(docs);
//
//         }
//       })
//
//
//       const promises=shuffledmembers.slice(0,40).map(user=>{
//         highermembers.push(user)
//         User.findByIdAndUpdate(user, {$addToSet : {
//          groupstheybelongto:id
//         }}).exec(function(err,docs){
//           if(err){
//                   console.log(err);
//               }else{
//                  // console.log("DOCS",docs)
//                }})
//       })
//
//       await Promise.all(promises);
//
// if(level==0&&type=="localgroup"){
//   const promises=shuffledmembers.slice(0,40).map(user=>{
//         User.findByIdAndUpdate(user, {
//          localgroup:id
//         }).exec(function(err,docs){
//           if(err){
//                   console.log(err);
//               }else{
//                  // console.log("DOCS",docs)
//                }})
//       })
//
//       await Promise.all(promises);
// }
//
//     }
//     return highergroups
//
//
//
//   }
//
//
//
//
//
//
//
//
//
//
//




// console.log("finished first phase!!!!!!!!!!!")
//
//
// var groups=await Group.find({ }).exec()
//
//
//
// var groupcategories={}
// groupcategories['localgroup']=[]
// for (let group of groups){
//
//   if (!group.title){
//
//     groupcategories['localgroup'].push(group)
//   }
//
//   if (group.title){
//
//     if (groupcategories.hasOwnProperty(`${group.title}`)){
//       groupcategories[`${group.title}`].push(group)
//     }else{
//       groupcategories[`${group.title}`]=[group]
//     }
//   }
// }
//
//
// for (let groups in groupcategories){
//   // await divideRulesAndEvents(groupcategories[`${groups}`],groups)
//   await divideandsortcandidates(groupcategories[`${groups}`],groups)
// }

})()



async function divideandsortcandidates(groups,grouptitle){
  var candidates=await ExpertCandidate.find({grouptitle:grouptitle}).exec()

  var groupobject={}
  for (let group of groups){
    if (groupobject.hasOwnProperty(`${group.level}`)){
      groupobject[`${group.level}`].push(group)
    }else{
      groupobject[`${group.level}`]=[group]
    }}

for (let candidate of candidates){
  if(candidate.votes<=20){
    candidate.level=0
  }
if(candidate.votes>20){
    candidate.level=1
  }
if(candidate.votes>80){
  candidate.level=2
}
if(candidate.votes>320){
  candidate.level=3
}
if(candidate.votes>1280){
  candidate.level=4
}
if(candidate.votes>5120){
  candidate.level=5
}
}

              var candidategroups={}
              for (let candidate of candidates){
                if (candidategroups.hasOwnProperty(`${candidate.level}`)){
                  candidategroups[`${candidate.level}`].push(candidate)
                }else{
                  candidategroups[`${candidate.level}`]=[candidate]
                }}

      for (let group in candidategroups){
        for (let candidate of candidategroups[`${group}`]){
          var approval=[]
        for (var groups of groupobject[`${group}`]){
          var c = candidate.votes.filter(approvee => groups.allmembers.includes(approvee))
          approval.push({group:groups._id,overlap:c})
        }
        approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)
          const updatedGroup=await Group.findByIdAndUpdate(approval[0]["group"], {$addToSet : {
          expertcandidates:candidate._id
        }}, function(err, result){

                if(err){
        console.log(err)
                }
                else{
                  console.log(result)
                }

            })
            const updatedCandidate=await ExpertCandidate.findByIdAndUpdate(candidate._id, {group:approval[0]["group"],grouptitle:updatedGroup.title||"localgroup"}, function(err, result){

                  if(err){
          console.log(err)
                  }
                  else{
                    console.log(result)
                  }

              })
      }
      }
      var groupz=await Group.find({ }).populate('expertcandidates').exec()

      var groupcategoriez={}
      groupcategoriez['localgroup']=[]
      for (let group of groupz){

        if (!group.title){

          groupcategoriez['localgroup'].push(group)
        }

        if (group.title){

          if (groupcategoriez.hasOwnProperty(`${group.title}`)){
            groupcategoriez[`${group.title}`].push(group)
          }else{
            groupcategoriez[`${group.title}`]=[group]
          }
        }
      }


      for (var grou in groupcategoriez){
        for (var gr of groupcategoriez[`${grou}`]){
          for (var cand of gr.expertcandidates){
            cand.votesinthisgroup=cand.votes.filter(approvee => gr.allmembers.includes(approvee))
          }
          var sorted=gr.expertcandidates.sort((a, b) => (a.votesinthisgroup.length < b.votesinthisgroup.length) ? 1 : -1)
            for (var a of gr.expertcandidates){
              console.log("group title and level",gr.title,gr.level)
              console.log("votes in this group",a.votesinthisgroup.length)
            }
            var candidateids=sorted.map(item=>{return item._id})
            var userids=sorted.map(item=>{return item.userId})
            await Group.findByIdAndUpdate(gr._id, {$addToSet : {
            members:{ $each: userids.slice(0,20) }
          }}, function(err, result){

                  if(err){
          console.log(err)
                  }
                  else{
                    console.log(result)
                  }

              })

              await Group.findByIdAndUpdate(gr._id,
              {electedrepresentatives:candidateids.slice(0,20)},
               function(err, result){

                    if(err){
              console.log(err)
                    }
                    else{
                      console.log(result)
                    }

                })

if(gr.level>0){
  for (var local of gr.associatedlocalgroups){
    await Group.findByIdAndUpdate(local, {$addToSet : {
    expertcandidates:{ $each: candidateids.slice(0,20) }
  }}, function(err, result){

          if(err){
  console.log(err)
          }
          else{
            console.log(result)
          }

      })
  }
}

        }
      }

}


async function divideRulesAndEvents(groups,grouptitle){
  var rules=await Rule.find({grouptitle:grouptitle}).exec()
  var events=await Event.find({grouptitle:grouptitle}).exec()
  var candidates=await ExpertCandidate.find({grouptitle:grouptitle}).exec()

  var groupobject={}
  for (let group of groups){
    if (groupobject.hasOwnProperty(`${group.level}`)){
      groupobject[`${group.level}`].push(group)
    }else{
      groupobject[`${group.level}`]=[group]
    }}

          var rulesgroups={}
          for (var rule of rules){
            if (rulesgroups.hasOwnProperty(`${rule.level}`)){
              rulesgroups[`${rule.level}`].push(rule)
            }else{
              rulesgroups[`${rule.level}`]=[rule]
            }}

  for (var rules in rulesgroups){
    for (var rule of rulesgroups[`${rules}`]){
      var approval=[]
    for (var groups of groupobject[`${rules}`]){
      var c = rule.approval.filter(approvee => groups.allmembers.includes(approvee))
      approval.push({group:groups._id,overlap:c})
    }
    approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)

      const updatedGroup=await Group.findByIdAndUpdate(approval[0]["group"], {$addToSet : {
      rules:rule._id
    }}, function(err, result){

            if(err){
    console.log(err)
            }
            else{
              console.log(result)
            }

        })
        const updatedRule=await Rule.findByIdAndUpdate(rule._id, {group:approval[0]["group"],grouptitle:updatedGroup.title||"localgroup"}, function(err, result){

              if(err){
      console.log(err)
              }
              else{
                console.log(result)
              }

          })
  }
  }





          var eventsgroups={}
          for (let ev of events){
            if (eventsgroups.hasOwnProperty(`${ev.level}`)){
              eventsgroups[`${ev.level}`].push(ev)
            }else{
              eventsgroups[`${ev.level}`]=[ev]
            }}
  for (var events in eventsgroups){
    for (var ev of eventsgroups[`${events}`]){

    var approval=[]
    for (var groups of groupobject[`${events}`]){
      var c = ev.approval.filter(approvee => groups.allmembers.includes(approvee))
      approval.push({group:groups._id,overlap:c})
    }
    approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)

    const updatedGroup=await Group.findByIdAndUpdate(approval[0]["group"], {$addToSet : {
    events:ev._id
  }}, function(err, result){

          if(err){
  console.log(err)
          }
          else{
            console.log(result)
          }

      })

      const updatedEvent=await Event.findByIdAndUpdate(ev._id, {group:approval[0]["group"],grouptitle:updatedGroup.title||"localgroup"}, function(err, result){

            if(err){
    console.log(err)
            }
            else{
              console.log(result)
            }

        })


  }
  }

}






var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  // fileFilter: (req, file, cb) => {
  //   const ext = path.extname(file.originalname)
  //   if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
  //     return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
  //   }
  //   cb(null, true)
  // }
})

var upload = multer({ storage: storage }).single("file")

app.post("/api/chat/uploadfiles", auth ,(req, res) => {
  upload(req, res, err => {
    if(err) {
      return res.json({ success: false, err })
    }
    return res.json({ success: true, url: res.req.file.path });
  })
});

io.on("connection", socket => {

  socket.on("Input Chat Message", msg => {

    connect.then(db => {
      try {
        console.log("message",msg)
        if(msg.recipient){
          var chat = new Chat({ message: msg.chatMessage, sender:msg.userId, type: msg.type,recipient:msg.recipient })
        }else{
          var chat = new Chat({ message: msg.chatMessage,groupId:msg.groupId, sender:msg.userId, type: msg.type })
        }


console.log("chat",chat)
          chat.save((err, doc) => {
            console.log("error",err)
            console.log(doc)
            if(err) return res.json({ success: false, err })

            Chat.find({ "_id": doc._id })
            .populate("sender")
            .exec((err, doc)=> {

                return io.emit("Output Chat Message", doc);
            })
          })
      } catch (error) {
        console.error(error);
      }
    })
   })

})


//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));




if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*',(req,res) => {
        res.sendFile(path.join(__dirname,'client','build','index.html'))
    })
}


module.exports = app



server.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`)
});
