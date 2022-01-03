const mongoose = require('mongoose');

const mvrSchema = new mongoose.Schema({
  mvr:{
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

mvrSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { mvrs: project._id }, 
        { $pull: { mvrs: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Mvr', mvrSchema);