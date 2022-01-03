const mongoose = require('mongoose');

const eligiibitySchema = new mongoose.Schema({
  eligiibity:{
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

eligiibitySchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { eligiibitys: project._id }, 
        { $pull: { eligiibitys: project._id } }, 
        { multi: true }, 
        next);
});


module.exports = mongoose.model('Eligiibity', eligiibitySchema);