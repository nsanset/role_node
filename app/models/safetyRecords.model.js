const mongoose = require('mongoose');

const safetySchema = new mongoose.Schema({
  enteredBy: {
    type: String
  },
  safetyDate: {
    type: String
  },
  driver: {
    type: String
  },
  carrier: {
    type: String
  },
  unit: {
    type: String
  },
  location: {
    type: String
  },
  vehicleDamage: {
    type: String
  },
  driversFault: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  safetysImgs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SafetyImg'
  }],
})

safetySchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { safetys: project._id }, 
        { $pull: { safetys: project._id } }, 
        { multi: true }, 
        next);
});


module.exports = mongoose.model('Safety', safetySchema);