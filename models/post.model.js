const mongoose =require( 'mongoose')
const PostSchema = new mongoose.Schema({
  post: {type: String},
  preview: {
    url:String,
    image:String,
    title:String
  },
  likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  group:{type: mongoose.Schema.ObjectId, ref:'Group'},
  createdby: {type: mongoose.Schema.ObjectId, ref: 'User'},
  timecreated: Number
})

module.exports=mongoose.model('Post', PostSchema)
