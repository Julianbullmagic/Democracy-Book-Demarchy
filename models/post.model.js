const mongoose =require( 'mongoose')
const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: 'Text is required'
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  comments: [{
    text: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
  }],
  group:{
    type: mongoose.Schema.ObjectId, ref:'group',
  },
  leader:{
    type: Boolean,
    default:false,
  },
  postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports=mongoose.model('Post', PostSchema)
