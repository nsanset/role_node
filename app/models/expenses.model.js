const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
  expenses:{
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

expensesSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { expensess: project._id }, 
        { $pull: { expensess: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('Expenses', expensesSchema);