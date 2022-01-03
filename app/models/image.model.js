const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
  img:{
    data: Buffer,
    contentType: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

imageSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { images: project._id }, 
        { $pull: { images: project._id } }, 
        { multi: true }, 
        next);
});


module.exports = mongoose.model('Image', imageSchema);