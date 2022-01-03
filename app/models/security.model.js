const mongoose = require('mongoose');

const securitySchema = new mongoose.Schema({
  security:{
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

securitySchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { securitys: project._id }, 
        { $pull: { securitys: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Security', securitySchema);