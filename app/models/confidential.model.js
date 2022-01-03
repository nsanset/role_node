const mongoose = require('mongoose');

const confidentialSchema = new mongoose.Schema({
  confidential:{
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

confidentialSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { confidentials: project._id }, 
        { $pull: { confidentials: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Confidential', confidentialSchema);