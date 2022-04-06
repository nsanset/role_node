const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  driver: {
    type: String
  },
  insurance1: {
    type: String
  },
  insurance2: {
    type: String
  },
  insurance3: {
    type: String
  },
  insurance4: {
    type: String
  },
  insurance5: {
    type: String
  },
  insurance6: {
    type: String
  },
  insurance7: {
    type: String
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

insuranceSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { insurances: project._id }, 
        { $pull: { insurances: project._id } }, 
        { multi: true }, 
        next);
});


module.exports = mongoose.model('Insurance', insuranceSchema);