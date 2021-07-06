const expect = require('chai').expect;
let chai = require("chai");
let chaiHttp = require("chai-http");
const puppeteer = require('puppeteer');
let app = require("../server");
const request = require('supertest');
const mongoose = require("mongoose");
chai.use(chaiHttp);
chai.should();
chai.use(require('chai-things'));
var geodist = require('geodist')
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const User = require("./../models/user.model");
const Group = require("./../models/group.model");

var groupsdata

const host = "http://localhost:3000";
let page;

// the test suite
describe('My test suite', async function () {

  // open a new browser tab and set the page variable to point at it
  before (async function () {
    global.expect = expect;
    global.browser = await puppeteer.launch( { headless: false } );
    page = await browser.newPage();
    page.setViewport({width: 1187, height: 1000});

  });

  // close the browser when the tests are finished
  after (async function () {
    await page.close();
    await browser.close();

  });









          it("It should add users to groups", async () =>{
            //
            // var originalnormalgroups=await chai.request(app)
            //           .get("/groups/findgroups")
            //
            // var users=await User.find({ })
            // .exec()
            //       var userIds=users.map(user=>{return user._id})
            //       console.log(userIds)
            //       console.log("groupId",originalnormalgroups.body.data[0]['_id'])
            //
            //       Group.findByIdAndUpdate(originalnormalgroups.body.data[0]['_id'], { members:userIds },
            //                                 function (err, docs) {
            //         if (err){
            //             console.log(err)
            //         }
            //         else{
            //             console.log("Updated group : ", docs);
            //         }
            //     })
      })

          it("It should create rules in all groups at all levels", async () =>{

            var originallocalgroups=await chai.request(app)
                      .get("/localgroup/findgroups")

            var originalhigherlevelgroups=await chai.request(app)
                      .get("/groups/findhigherlevelgroups")
console.log("originalhigherlevelgroups",originalhigherlevelgroups)

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
charactersLength));
 }
 return result;
}


for(var group of originalhigherlevelgroups.body.data){

async function addRulesToGroups(level,groupdata){
  for(var x=0;x<5;x++){

  var ruleId=mongoose.Types.ObjectId()
  var randstring=makeid(5)
  var d = new Date();
  var n = d.getTime();
  const res1=await chai.request(app)
            .post('/rules/createrule/'+ruleId)
  .send({rule:`a test rule ${randstring}`,group:group._id,timecreated:n,level:level,approval:[...groupdata.members.slice(0,25)],grouptype:"localgroup"})
console.log(groupdata.members.slice(0,25))
  const res2=await chai.request(app)
          .put('/groups/addruletohighergroup/'+group._id+"/"+ruleId)

}
}


  console.log(group)
  if(group.level==1){
  await addRulesToGroups(1,group)
  }
  if(group.level==2){
    await addRulesToGroups(2,group)
  }
  if(group.level==3){
  await addRulesToGroups(3,group)
  }
  if(group.level==4){
await addRulesToGroups(4,group)
  }




}


})

})
