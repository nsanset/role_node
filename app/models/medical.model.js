const mongoose = require('mongoose');

const medicalSchema = new mongoose.Schema({
  medicalCard:{
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

medicalSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { medicals: project._id }, 
        { $pull: { medicals: project._id } }, 
        { multi: true }, 
        next);
});


module.exports = mongoose.model('Medical', medicalSchema);