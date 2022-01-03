const mongoose = require('mongoose');

const w4formSchema = new mongoose.Schema({
  w4form:{
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

w4formSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { w4forms: project._id }, 
        { $pull: { w4forms: project._id } }, 
        { multi: true }, 
        next);
});


module.exports = mongoose.model('W4form', w4formSchema);