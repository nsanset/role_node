const mongoose = require('mongoose');

const ownedSchema = new mongoose.Schema({
  owned:{
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

ownedSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { owneds: project._id }, 
        { $pull: { owneds: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Owned', ownedSchema);