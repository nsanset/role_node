const mongoose = require('mongoose');

const employmentSchema = new mongoose.Schema({
  employment:{
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

employmentSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { employments: project._id }, 
        { $pull: { employments: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Employment', employmentSchema);