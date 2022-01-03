const mongoose = require('mongoose');

const despositSchema = new mongoose.Schema({
  desposit:{
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

despositSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { desposits: project._id }, 
        { $pull: { desposits: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Desposit', despositSchema);