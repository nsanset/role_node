const config = require("../config/auth.config");
const db = require("../models");
const Image = require('../models/image.model');
const Avatar = require('../models/avatar.model');
const Medical = require('../models/medical.model');
const Security = require('../models/security.model');
const Employment = require('../models/employment.model');
const W4form = require('../models/w4form.model');
const Confidential = require('../models/confidential.model');
const Owned = require('../models/owned.model');
const Expenses = require('../models/expenses.model');
const Desposit = require('../models/desposit.model');
const Credit = require('../models/credit.model');
const Eligiibity = require('../models/eligiibity.model');
const Drug = require('../models/drug.model');
const Another = require('../models/another.model');
const Mvr = require('../models/mvr.model');
var fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
  res.status(200).send("User Content.");
};

exports.userBoard = (req, res) => {
  var token = req.body.token || req.query.token || req.headers["x-access-token"];
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    User.findById(decoded.id, 
    { password: 0 })
    .populate('images')
    .populate('avatars')
    .populate('medicals')
    .populate('securitys')
    .populate('employments')
    .populate('w4forms')
    .populate('confidentials')
    .populate('owneds')
    .populate('expensess')
    .populate('desposits')
    .populate('credits')
    .populate('eligiibitys')
    .populate('drugs')
    .populate('anothers')
    .populate('mvrs')
    .exec (function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");
      // res.render('user', { user: user });
      res.status(200).send(user);
    });
  });
  // res.status(200).send("user Content.");
};


// avatar
exports.userAvatar = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    await sharp(file)
      .resize({
        width: 320,
        height: 240
      })
      .toFormat('jpeg')
      .jpeg({ quality: 65 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename))

  const avatar = new Avatar({
    avatar: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename)),
      contentType: 'image/png'
    },
    user: id
  })

  await avatar.save();

  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.avatars.push(avatar);
  await related.save(function(err) {
  if (err) {console.log(err)}
      res.status(200).send("avatar uploads");
  })

};


exports.userDeleteAvatar = (req, res) => {
  Avatar.findOne({_id: req.params.id}, function (error, avatar){
    if (error) {
      res.send(error);
    }
    else if (!avatar) {
      res.status(200).send("deleted");
    } else {
      avatar.remove();
      res.status(200).send("deleted");
    }
  });

  
}

//delete user
exports.userDelete = (req, res) => {
  User.findOne({_id: req.params.id}, function (error, user){
    if (error) {
      res.send(error);
    }
    else if (!user) {
      res.status(200).send("deleted");
    } else {
      user.remove();
      res.status(200).send("deleted");
    }
  });
}

//put
exports.userPut = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err) {
    if (err) return next (err);
    User.find({})
    res.sendStatus(200)
  });
};



//driver license
// exports.userImgUpl = async (req, res) => {
//   const id = req.params.id;
//   const image = new Image({
//     img: {
//       data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename)),
//       contentType: 'image/png'
//     },
//     user: id
//   })
//   try {
//     fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
//   } catch (error) {
//     console.log(error)
//   } 
//   await image.save();
//   const related = await User.findById(id);
//   related.images.push(image);
//   await related.save(function(err) {
//   if(err) {console.log(err)}
//       res.status(200).send("user Content.");
//   })
// };


exports.userImgUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
  const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))
      .catch(err => { console.log(err) });
 
  const image = new Image({
    img: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })

  await image.save()

  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.images.push(image);
  await related.save(function (err) {
  if(err) {
    console.log(err)
  }
  else {
    res.status(200).send("driver license uploads")
   }
  })
};



exports.userDeleteImg = (req, res) => {
  Image.findOne({_id: req.params.id}, function (error, image){
    if (error) {
      res.send(error);
    }
    else if (!image) {
      res.status(200).send("deleted");
    } else {
      image.remove();
      res.status(200).send("deleted");
    }
  });
}

// exports.userDeleteImg = (req, res) => {
//   Image.findOneAndRemove({_id: req.params.id}, function (error, image){
//     if (error) {
//       res.send(error);
//     } else {
//       res.send("deleted")
//     }
//   });
// }

exports.userDeleteAllImg = (req, res) => {
    Image.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all images")
    }
  });
}

//medical card
exports.userMedicalUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
  const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))

  const medicalCard = new Medical({
    medicalCard: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })

  await medicalCard.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });


  const related = await User.findById(id);
  related.medicals.push(medicalCard);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("medical uploads.");
  })
};





exports.userDeleteMedical = (req, res) => {
  Medical.findOne({_id: req.params.id}, function (error, image){
    if (error) {
      res.send(error);
    }
    else if (!image) {
      res.status(200).send("deleted");
    } else {
      image.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllMedical = (req, res) => {
    Medical.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all images")
    }
  });
}


//Secututy card
exports.userSecurityUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))
  
  const security = new Security({
    security: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })


  await security.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.securitys.push(security);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("user Content.");
  })
};

exports.userDeleteSecurity = (req, res) => {
  Security.findOne({_id: req.params.id}, function (error, security){
    if (error) {
      res.send(error);
    }
    else if (!security) {
      res.status(200).send("deleted");
    } else {
      security.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllSecurity = (req, res) => {
    Security.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Security")
    }
  });
}




//Employment card
exports.userEmploymentUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))

  const employment = new Employment({
    employment: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })


  await employment.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.employments.push(employment);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("user Content.");
  })
};
exports.userDeleteEmployment = (req, res) => {
  Employment.findOne({_id: req.params.id}, function (error, employment){
    if (error) {
      res.send(error);
    }
    else if (!employment) {
      res.status(200).send("deleted");
    } else {
      employment.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllEmployment = (req, res) => {
    Employment.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Employment")
    }
  });
}



//w4form
exports.userW4formtUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))

  const w4form = new W4form({
    w4form: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })

  await w4form.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.w4forms.push(w4form);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("user Content.");
  })
};
exports.userDeleteW4form = (req, res) => {
  W4form.findOne({_id: req.params.id}, function (error, w4form){
    if (error) {
      res.send(error);
    }
    else if (!w4form) {
      res.status(200).send("deleted");
    } else {
      w4form.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllW4form = (req, res) => {
    W4form.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Employment")
    }
  });
}





//confidential
exports.userConfidentialUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))

  const confidential = new Confidential({
    confidential: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })


  await confidential.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.confidentials.push(confidential);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("user Content.");
  })
};
exports.userDeleteConfidential = (req, res) => {
  Confidential.findOne({_id: req.params.id}, function (error, confidential){
    if (error) {
      res.send(error);
    }
    else if (!confidential) {
      res.status(200).send("deleted");
    } else {
      confidential.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllConfidential = (req, res) => {
    Confidential.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Confidential")
    }
  });
}




//owned
exports.userOwnedUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
       .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))

  const owned = new Owned({
    owned: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })

  await owned.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.owneds.push(owned);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("user Content.");
  })
};

exports.userDeleteOwned = (req, res) => {
  Owned.findOne({_id: req.params.id}, function (error, owned){
    if (error) {
      res.send(error);
    }
    else if (!owned) {
      res.status(200).send("deleted");
    } else {
      owned.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllOwned = (req, res) => {
    Owned.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Owned")
    }
  });
}




//expenses
exports.userExpensesUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))

  const expenses = new Expenses({
    expenses: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })


  await expenses.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.expensess.push(expenses);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("user Content.");
  })
};
exports.userDeleteExpenses = (req, res) => {
  Expenses.findOne({_id: req.params.id}, function (error, expenses){
    if (error) {
      res.send(error);
    }
    else if (!expenses) {
      res.status(200).send("deleted");
    } else {
      expenses.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllExpenses = (req, res) => {
    Expenses.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all expenses")
    }
  });
}



//desposit
exports.userDespositUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))


  const desposit = new Desposit({
    desposit: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })

  await desposit.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.desposits.push(desposit);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("user Content.");
  })
};
exports.userDeleteDesposit = (req, res) => {
  Desposit.findOne({_id: req.params.id}, function (error, desposit){
    if (error) {
      res.send(error);
    }
    else if (!desposit) {
      res.status(200).send("deleted");
    } else {
      desposit.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllDesposit = (req, res) => {
    Desposit.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all desposit")
    }
  });
}




//credit
exports.userCreditUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename  + 'compr'))

  const credit = new Credit({
    credit: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename  + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })

  await credit.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.credits.push(credit);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("user Content.");
  })
};
exports.userDeleteCredit = (req, res) => {
  Credit.findOne({_id: req.params.id}, function (error, credit){
    if (error) {
      res.send(error);
    }
    else if (!credit) {
      res.status(200).send("deleted");
    } else {
      credit.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllCredit = (req, res) => {
    Credit.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Owned")
    }
  });
}



//eligiibity
exports.userEligiibityUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))

  const eligiibity = new Eligiibity({
    eligiibity: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })

  await eligiibity.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.eligiibitys.push(eligiibity);
  await related.save(function(err) {
  if(err) {console.log(err)}
    res.status(200).send("user Content.");
  })
};
exports.userDeleteEligiibity = (req, res) => {
  Eligiibity.findOne({_id: req.params.id}, function (error, eligiibity){
    if (error) {
      res.send(error);
    }
    else if (!eligiibity) {
      res.status(200).send("deleted");
    } else {
      eligiibity.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllEligiibity = (req, res) => {
    Eligiibity.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Eligiibity")
    }
  });
}



//drug
exports.userDrugUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))

  const drug = new Drug({
    drug: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })

  await drug.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.drugs.push(drug);
  await related.save(function(err) {
  if(err) {console.log(err)}
      res.status(200).send("user Content.");
  })

};
exports.userDeleteDrug = (req, res) => {
  Drug.findOne({_id: req.params.id}, function (error, drug){
    if (error) {
      res.send(error);
    }
    else if (!drug) {
      res.status(200).send("deleted");
    } else {
      drug.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllDrug = (req, res) => {
    Drug.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Drug")
    }
  });
}


//mvr
exports.userMvrUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'))

  const mvr = new Mvr({
    mvr: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr')),
      contentType: 'image/png'
    },
    user: id
  })
  await mvr.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.mvrs.push(mvr);
  await related.save(function(err) {
  if(err) {console.log(err)}
      res.status(200).send("user Content.");
  })
};
exports.userDeleteMvr = (req, res) => {
  Mvr.findOne({_id: req.params.id}, function (error, mvr){
    if (error) {
      res.send(error);
    }
    else if (!mvr) {
      res.status(200).send("deleted");
    } else {
      mvr.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllMvr = (req, res) => {
    Mvr.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Mvr")
    }
  });
}



//another
exports.userAnotherUpl = async (req, res) => {
  const id = req.params.id;
  const file = await fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename))
    const data = await sharp(file)
      .resize({
        width: 1280,
        height: 720
      })
      .toFormat('jpeg')
      .jpeg({ quality: 50 })
      .toFile(path.join(__dirname, '..', '..', 'uploads', req.file.filename))

  const another = new Another({
    another: {
      data: fs.readFileSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename)),
      contentType: 'image/png'
    },
    user: id
  })

  await another.save();
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), function(err) {
     if (err) {console.log(err)}
  });
  fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename + 'compr'), function(err) {
     if (err) {console.log(err)}
  });

  const related = await User.findById(id);
  related.anothers.push(another);
  await related.save(function(err) {
  if(err) {console.log(err)}
      res.status(200).send("user Content.");
  })
};
exports.userDeleteAnother = (req, res) => {
  Another.findOne({_id: req.params.id}, function (error, another){
    if (error) {
      res.send(error);
    }
    else if (!another) {
      res.status(200).send("deleted");
    } else {
      another.remove();
      res.status(200).send("deleted");
    }
  });
}
exports.userDeleteAllAnother = (req, res) => {
    Another.deleteMany({ }, function(err, images) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted all Another")
    }
  });
}




exports.adminBoard = (req, res) => {
  User.find({ }, function(err, users) {
    if (err) {
      res.send(err);
    } else {
      // res.render('admin', { users: users });
      res.status(200).send(users);
    }
  });
};

exports.adminUser = (req, res) => {
    var id = req.params.id
    User.findById(id)        
        .populate('images')
        .populate('avatars')
        .populate('medicals')
        .populate('securitys')
        .populate('employments')
        .populate('w4forms')
        .populate('confidentials')
        .populate('owneds')
        .populate('expensess')
        .populate('desposits')
        .populate('credits')
        .populate('eligiibitys')
        .populate('drugs')
        .populate('anothers')
        .populate('mvrs')
        .lean().exec(function (err, user) {
        if (err) return console.error(err)
        try {
          res.status(200).send(user);
        } catch (error) {
            console.log("errror getting results")
            console.log(error)
        } 
    })
};


exports.moderatorBoard =  (req, res) => {
    res.status(200).send("mod Content.");
};

exports.moderator = (req, res) => {
  res.status(200).send("Moderator Content.");
};