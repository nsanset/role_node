const mongoose = require('mongoose');
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username:  {
    type: String,
    required: true
  },       
  email: {
    type: String,
    required: true
  },  
  password: {
    type: String,
    required: true
  },
  status: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  dateOfBirth: {
    type: String
  },
  socialSecurityNumber: {
    type: String
  },
  driverLicenseNumber: {
    type: String
  },
  driverLicenseState: {
    type: String
  },
  driverLicenseIssueDate: {
    type: String
  },
  homeAdress: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  employingCompany: {
    type: String
  },
  dateOfEmplouyment: {
    type: String
  },
  dateOfDismissal: {
    type: String
  },
  endOfDateDriverLicense: {
    type: String
  },
  endOfDateMedicalCard: {
    type: String
  },
  comment: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  medicals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medical'
  }],
  securitys: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Security'
  }],
  employments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employment'
  }],
  w4forms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'W4form'
  }],
  confidentials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Confidential'
  }],
  owneds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owned'
  }],
  expensess: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expenses'
  }],
  desposits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Desposit'
  }],
  credits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credit'
  }],
  eligiibitys: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eligiibity'
  }],
  drugs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drug'
  }],
  mvrs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mvr'
  }],
  anothers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Another'
  }],
  avatars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Avatar'
  }],
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SingleFile'
  }]
})
// userSchema.pre('save', function(next) {
//   this.status = 'active';
//   next();
// });
// userSchema.pre('save', function(next) {
//   this.exp = '';
//   next();
// });
userSchema.virtual('url').get(function(){
  return '/user/' + this._id
})
module.exports = mongoose.model('User', userSchema);