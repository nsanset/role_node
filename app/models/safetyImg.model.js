const mongoose = require('mongoose');

const safetyImgSchema = new mongoose.Schema({
  safetyImg:{
    data: Buffer,
    contentType: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Safety'
  },
})

safetyImgSchema.pre('remove', function (next) {
    var project = this;
    project.model('Safety').updateOne(
        { safetysImgs: project._id }, 
        { $pull: { safetysImgs: project._id } }, 
        { multi: true }, 
        next);
});


module.exports = mongoose.model('SafetyImg', safetyImgSchema);