const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  credit:{
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

creditSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { credits: project._id }, 
        { $pull: { credits: project._id } }, 
        { multi: true }, 
        next);
});


module.exports = mongoose.model('Credit', creditSchema);