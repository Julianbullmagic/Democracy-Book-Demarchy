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
const Rule = require("./models/rule.model");
const Event = require("./models/event.model");
const KmeansLib = require('kmeans-same-size');
var kmeans = new KmeansLib();
const LocalGroup = require("./models/localgroup.model");
const HigherLevelGroup = require("./models/higherlevelgroup.model");
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










// cron.schedule('* * * *', () => {





(async function(){
// var localgroups=[]
//   var users=await User.find({ })
//   .exec()
// if (users.length>40){
//   LocalGroup.deleteMany({}).then(function(){
//     console.log("Data deleted"); // Success
// }).catch(function(error){
//     console.log(error); // Failure
// });
//   const k = Math.round(users.length/40)   // Groups Number
//   const size = 40 // Group size
//   var docsCopy=JSON.parse(JSON.stringify(users))
//   let vectors=users.map(item=>{return {x:item.coordinates[0],y:item.coordinates[1]}})
//
// kmeans.init({k: k, runs: size, equalSize: true, normalize: false })
// const sum = kmeans.calc(vectors);
//
// for (var vector of vectors){
//   for (var user of docsCopy){
//     if (user.coordinates[0]==vector.x&&user.coordinates[1]==vector.y&&!user.k){
//       user.k=vector.k
//     }
//   }
// }
// var groups={}
// for (var user of docsCopy){
//
//   if (groups.hasOwnProperty(`${user.k}`)){
//     groups[`${user.k}`].push(user)
//   }else{
//     groups[`${user.k}`]=[user]
//   }
// }
// for (const group in groups) {
//   var coordinates=groups[`${group}`].map(member=>{return [member.coordinates[0],member.coordinates[1]]})
//   var latlongroup=groups[`${group}`].map(member=>{return {lat: member.coordinates[0], lon: member.coordinates[1]}})
//   var userIds=groups[`${group}`].map(member=>{return member._id})
//
//   var bias = 10
//
// var result = geocluster(coordinates, bias)
// var latloncentroid={lat: result[0]['centroid'][0], lon: result[0]['centroid'][1]}
// distancesArray=[]
// for (var latlon of latlongroup){
//   var dist = geodist(latloncentroid, latlon)
// distancesArray.push(dist)
// }
// distancesArray.sort()
//
// var location=await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${result[0]['centroid'][1]},${result[0]['centroid'][0]}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
//   .then(data => {
//     console.log(data['data']['features'].length)
//     if(data['data']['features'].length>0){
//       console.log("mapbox location!!!",data['data']['features'][0]['text'])
//
//       return data['data']['features'][0]['text']
//     }
// })
//
//
//
//   var id=new mongoose.Types.ObjectId().toString()
//   let newGroup = new LocalGroup({
//     _id:id,
//     radius:distancesArray[0],
//     location:location,
//     centroid:result[0]['centroid'],
//     members: [...userIds]
//   });
//   newGroup.save((err,docs) => {
//     if(err){
//       console.log(err);
//     }else{
// // console.log(docs)
//     }
//   })
//   localgroups.push(newGroup)
//
// for(var member of groups[group]){
//   console.log(member._id,id)
//   User.findByIdAndUpdate(
//     { _id: member._id },
//     { localgroup: id },
//     function(err, result) {
//       if (err) {
//         console.log(err)}
//          else {
//       }
//     }
//   )
// }
//
//
// }
// }
//
//
//
//
//
//
// async function divideUsersIntoHigherGroups(theshold,level,localgroups,groupsonelevelbelow){
//
//
//
//
//     const k=Math.round(users.length/theshold)   // Groups Number
//
//     console.log("k",k)
//     const size = theshold // Group size
//
//     var docsCopy=JSON.parse(JSON.stringify(users))
//     let vectors=users.map(item=>{return {x:item.coordinates[0],y:item.coordinates[1]}})
//   kmeans.init({k: k, runs: size, equalSize: true, normalize: false })
//   const sum = kmeans.calc(vectors);
//
//
//   for (var vector of vectors){
//     for (var user of docsCopy){
//       if (user.coordinates[0]==vector.x&&user.coordinates[1]==vector.y&&!user.k){
//         user.k=vector.k
//       }
//     }
//   }
//   var groups={}
//   for (var user of docsCopy){
//     if (groups.hasOwnProperty(`${user.k}`)){
//       groups[`${user.k}`].push(user)
//     }else{
//       groups[`${user.k}`]=[user]
//     }
//   }
//   var highermembers=[]
//
//   var highergroups=[]
//
//   for (const group in groups) {
//     var latlongroup=groups[`${group}`].map(member=>{return {lat: member.coordinates[0], lon: member.coordinates[1]}})
//     var coordinates=groups[`${group}`].map(member=>{return [member.coordinates[0],member.coordinates[1]]})
//     var userIds=groups[`${group}`].map(member=>{return member._id})
//
//     var bias = 10
//
//   var result = geocluster(coordinates, bias)
//
//   var latloncentroid={lat: result[0]['centroid'][0], lon: result[0]['centroid'][1]}
//   distancesArray=[]
//   for (var latlon of latlongroup){
//     var dist = geodist(latloncentroid, latlon)
//   distancesArray.push(dist)
//   }
//   distancesArray.sort()
//   var location=await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${result[0]['centroid'][1]},${result[0]['centroid'][0]}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
//     .then(data => {
//       if(data['data']['features'].length>0){
//
//         return data['data']['features'][0]['text']
//       }
//   })
//
//   var associatedlocalgroups=[]
//   for (var localgroup of localgroups){
//     console.log(typeof localgroup.members[0])
//     console.log(typeof userIds[0])
//
//   var c = userIds.filter(approvee => localgroup.members.includes(approvee))
//   if (c.length/localgroup.members.length>0.5){
//   associatedlocalgroups.push(localgroup._id)
//   }
//
//   }
//   var associatedhighergroupsdirectlybelow=[]
//
// if(groupsonelevelbelow){
//   for (var groupbelow of groupsonelevelbelow){
// console.log("groupbelow",groupbelow)
//   var c = userIds.filter(approvee => groupbelow.allmembers.includes(approvee))
//   console.log("c.length",c.length)
//   if (c.length/groupbelow.allmembers.length>0.75){
//   associatedhighergroupsdirectlybelow.push(groupbelow._id)
//   }
//
//   }
// }
// console.log("associatedhighergroupsdirectlybelow",associatedhighergroupsdirectlybelow)
//
//
//
//     var id=new mongoose.Types.ObjectId().toString()
//     var shuffledmembers=shuffle(userIds)
//     var shuffledmemberssliced=shuffledmembers.slice(0,40)
//     let newGroup = new HigherLevelGroup({
//       _id:id,
//       level:level,
//       type:"localgroup",
//       radius:distancesArray[0],
//       location:location,
//       associatedlocalgroups:associatedlocalgroups,
//       centroid:result[0]['centroid'],
//       members:[...shuffledmembers.slice(0,40)],
//       allmembers: [...userIds]
//     });
//     if (level==1){
//       newGroup.groupsbelow=associatedlocalgroups
//
//     }
//     if (level>1){
//       newGroup.groupsbelow=associatedhighergroupsdirectlybelow
//     }
//     highergroups.push(newGroup)
//
//
//     newGroup.save((err,docs) => {
//       if(err){
//         console.log(err);
//       }else{
//         // console.log(docs);
//
//       }
//     })
//
//
//     const promises=shuffledmemberssliced.map(user=>{
//       highermembers.push(user)
//       User.findByIdAndUpdate(user, {$addToSet : {
//         higherlevellocalgroupstheybelongto:id
//       }}).exec(function(err,docs){
//         if(err){
//                 console.log(err);
//             }else{
//                // console.log("DOCS",docs)
//              }})
//     })
//
//     await Promise.all(promises);
//
//   }
//   return highergroups
// }
//
// await HigherLevelGroup.deleteMany({}).then(function(){
//   console.log("Data deleted"); // Success
// }).catch(function(error){
//   console.log(error); // Failure
// });
//
// const promises=users.map(user=>{
//   User.findByIdAndUpdate(user._id, { higherlevellocalgroupstheybelongto:[] },
//                             function (err, docs) {
//     if (err){
//         console.log(err)
//     }
//     else{
//         // console.log("Updated User : ", docs);
//     }
// })
// })
//
// await Promise.all(promises);
//
//
//
// if (users.length>160){
// var levelonegroups=await divideUsersIntoHigherGroups(160,1,localgroups)
// }
// if (users.length>640){
//   var leveltwogroups=await divideUsersIntoHigherGroups(640,2,localgroups,levelonegroups)
//
// }
// if (users.length>2560){
//   var levelthreegroups=await divideUsersIntoHigherGroups(2560,3,localgroups,leveltwogroups)
// }
// if (users.length>10240){
//   var levelfourgroups=await divideUsersIntoHigherGroups(10240,4,localgroups,levelthreegroups)
// }
//
// for (var levelonegroup of levelonegroups){
//   for (var higher of levelonegroup.groupsbelow){
//     await LocalGroup.findByIdAndUpdate(higher, { groupabove:levelonegroup._id },
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
//
// for (var leveltwogroup of leveltwogroups){
//   for (var highertwo of leveltwogroup.groupsbelow){
//     await HigherLevelGroup.findByIdAndUpdate(highertwo, { groupabove:leveltwogroup._id },
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
// for (var levelthreegroup of levelthreegroups){
//   for (var higherthree of levelthreegroup.groupsbelow){
//     await HigherLevelGroup.findByIdAndUpdate(higherthree, { groupabove:levelthreegroup._id },
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





//
// console.log("finished first phase!!!!!!!!!!!")

//
// var rules=await Rule.find({ }).exec()
// var localgroups=await LocalGroup.find({ }).exec()
// var higherlevelgroups=await HigherLevelGroup.find({ }).exec()
//
// var higherlevelgroupobject={}
// for (var group of higherlevelgroups){
//   if (higherlevelgroupobject.hasOwnProperty(`${group.level}`)){
//     higherlevelgroupobject[`${group.level}`].push(group)
//   }else{
//     higherlevelgroupobject[`${group.level}`]=[group]
//   }}
//   console.log("higherlevelgroupobject",higherlevelgroupobject)
//
//
//         var rulesgroups={}
//         for (var rule of rules){
//           if (rulesgroups.hasOwnProperty(`${rule.level}`)){
//             rulesgroups[`${rule.level}`].push(rule)
//           }else{
//             rulesgroups[`${rule.level}`]=[rule]
//           }}
// for (var rule of rulesgroups['0']){
//   var approval=[]
//   for (var group of localgroups){
//     var c = rule.approval.filter(approvee => group.members.includes(approvee))
//     approval.push({localgroup:group._id,overlap:c})
//   }
//   approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)
//
//   const updatedGroup=await LocalGroup.findByIdAndUpdate(approval[0]["localgroup"], {$addToSet : {
//   rules:rule._id
// }}, function(err, result){
//
//         if(err){
// console.log(err)
//         }
//         else{
//           console.log(result)
//         }
//
//     })
//
// }
// if(rulesgroups['1']){
// for (var rule of rulesgroups['1']){
//   var approval=[]
//   for (var group of higherlevelgroupobject['1']){
//     var c = rule.approval.filter(approvee => group.allmembers.includes(approvee))
//     approval.push({group:group._id,overlap:c})
//   }
//   approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)
//
//   const updatedGroup=await HigherLevelGroup.findByIdAndUpdate(approval[0]["group"], {$addToSet : {
//   rules:rule._id
// }}, function(err, result){
//
//         if(err){
// console.log(err)
//         }
//         else{
//           // console.log(result)
//         }
//
//     })
//
//     const updatedRule=await Rule.findByIdAndUpdate(rule._id, {group:approval[0]["group"]}, function(err, result){
//
//           if(err){
//   console.log(err)
//           }
//           else{
//             console.log(result)
//           }
//
//       })
//
// }
// }
//
//
// if(rulesgroups['2']){
// for (var rule of rulesgroups['2']){
//   var approval=[]
//   for (var group of higherlevelgroupobject['2']){
//     var c = rule.approval.filter(approvee => group.allmembers.includes(approvee))
//     approval.push({group:group._id,overlap:c})
//   }
//   approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)
//
//   const updatedGroup=await HigherLevelGroup.findByIdAndUpdate(approval[0]["group"], {$addToSet : {
//   rules:rule._id
// }}, function(err, result){
//
//         if(err){
// console.log(err)
//         }
//         else{
//           console.log(result)
//         }
//
//     })
//
//     const updatedRule=await Rule.findByIdAndUpdate(rule._id, {group:approval[0]["group"]}, function(err, result){
//
//           if(err){
//   console.log(err)
//           }
//           else{
//             console.log(result)
//           }
//
//       })
// }
// }
//
//
// if(rulesgroups['3']){
// for (var rule of rulesgroups['3']){
//   var approval=[]
//   for (var group of higherlevelgroupobject['3']){
//     var c = rule.approval.filter(approvee => group.allmembers.includes(approvee))
//     approval.push({group:group._id,overlap:c})
//   }
//   approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)
//
//   const updatedGroup=await HigherLevelGroup.findByIdAndUpdate(approval[0]["group"], {$addToSet : {
//   rules:rule._id
// }}, function(err, result){
//
//         if(err){
// console.log(err)
//         }
//         else{
//           // console.log(result)
//         }
//
//     })
//
//     const updatedRule=await Rule.findByIdAndUpdate(rule._id, {group:approval[0]["group"]}, function(err, result){
//
//           if(err){
//   console.log(err)
//           }
//           else{
//             console.log(result)
//           }
//
//       })
// }
// }
//
//
// var events=await Event.find({ }).exec()
// var localgroups=await LocalGroup.find({ }).exec()
// var higherlevelgroups=await HigherLevelGroup.find({ }).exec()
//
// var higherlevelgroupobject={}
// for (var group of higherlevelgroups){
//   if (higherlevelgroupobject.hasOwnProperty(`${group.level}`)){
//     higherlevelgroupobject[`${group.level}`].push(group)
//   }else{
//     higherlevelgroupobject[`${group.level}`]=[group]
//   }}
//
//         var eventsgroups={}
//         for (let ev of events){
//           if (eventsgroups.hasOwnProperty(`${ev.level}`)){
//             eventsgroups[`${ev.level}`].push(ev)
//           }else{
//             eventsgroups[`${ev.level}`]=[ev]
//           }}
// for (let ev of eventsgroups['0']){
//   var approval=[]
//   for (var group of localgroups){
//     var c = ev.approval.filter(approvee => group.members.includes(approvee))
//     approval.push({localgroup:group._id,overlap:c})
//   }
//   approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)
//
//   const updatedGroup=await LocalGroup.findByIdAndUpdate(approval[0]["localgroup"], {$addToSet : {
//   events:ev._id
// }}, function(err, result){
//
//         if(err){
// console.log(err)
//         }
//         else{
//           console.log(result)
//         }
//
//     })
//
// }
// if(eventsgroups['1']){
// for (let ev of eventsgroups['1']){
//   var approval=[]
//   for (var group of higherlevelgroupobject['1']){
//     var c = ev.approval.filter(approvee => group.allmembers.includes(approvee))
//     approval.push({group:group._id,overlap:c})
//   }
//   approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)
//
//   const updatedGroup=await HigherLevelGroup.findByIdAndUpdate(approval[0]["group"], {$addToSet : {
//   events:ev._id
// }}, function(err, result){
//
//         if(err){
// console.log(err)
//         }
//         else{
//           console.log(result)
//         }
//
//     })
//
//     const updatedRule=await Event.findByIdAndUpdate(rule._id, {group:approval[0]["group"]}, function(err, result){
//
//           if(err){
//   console.log(err)
//           }
//           else{
//             console.log(result)
//           }
//
//       })
//
// }
// }
//
//
// if(eventsgroups['2']){
// for (let ev of eventsgroups['2']){
//   var approval=[]
//   for (var group of higherlevelgroupobject['2']){
//     var c = ev.approval.filter(approvee => group.allmembers.includes(approvee))
//     approval.push({group:group._id,overlap:c})
//   }
//   approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)
//
//   const updatedGroup=await HigherLevelGroup.findByIdAndUpdate(approval[0]["group"], {$addToSet : {
//   events:ev._id
// }}, function(err, result){
//
//         if(err){
// console.log(err)
//         }
//         else{
//           console.log(result)
//         }
//
//     })
//
//     const updatedEvent=await Event.findByIdAndUpdate(ev._id, {group:approval[0]["group"]}, function(err, result){
//
//           if(err){
//   console.log(err)
//           }
//           else{
//             console.log(result)
//           }
//
//       })
// }
// }
//
//
// if(eventsgroups['3']){
// for (let ev of eventsgroups['3']){
//   var approval=[]
//   for (var group of higherlevelgroupobject['3']){
//     var c = ev.approval.filter(approvee => group.allmembers.includes(approvee))
//     approval.push({group:group._id,overlap:c})
//   }
//   approval.sort((a, b) => (a.overlap.length < b.overlap.length) ? 1 : -1)
//
//   const updatedGroup=await HigherLevelGroup.findByIdAndUpdate(approval[0]["group"], {$addToSet : {
//   events:ev._id
// }}, function(err, result){
//
//         if(err){
// console.log(err)
//         }
//         else{
//           console.log(result)
//         }
//
//     })
//
//     const updatedEvent=await Event.findByIdAndUpdate(ev._id, {group:approval[0]["group"]}, function(err, result){
//
//           if(err){
//   console.log(err)
//           }
//           else{
//             console.log(result)
//           }
//
//       })
// }
// }
})()








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
          let chat = new Chat({ message: msg.chatMessage, sender:msg.userId, type: msg.type })
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
