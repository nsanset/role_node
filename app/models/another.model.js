const mongoose = require('mongoose');

const anotherSchema = new mongoose.Schema({
  another:{
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

anotherSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { anothers: project._id }, 
        { $pull: { anothers: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Another', anotherSchema);