const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
  avatar:{
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

avatarSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { avatars: project._id }, 
        { $pull: { avatars: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Avatar', avatarSchema);