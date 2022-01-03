const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
  drug:{
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

drugSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { drugs: project._id }, 
        { $pull: { drugs: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Drug', drugSchema);