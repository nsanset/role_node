const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

const db = require("../models");

var multer = require('multer');
const sharp = require('sharp');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

var storagePdf = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.pdf')
    }
});


var uploadPdf = multer({ 
    storage: storagePdf
});


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.get("/all", controller.allAccess);

  app.get("/user", [authJwt.verifyToken], controller.userBoard);

  // avatar 
  app.post("/user/avatar/:id/avatar", [authJwt.verifyToken], upload.single('avatar'), controller.userAvatar);
  app.delete("/user/avatar/:id", [authJwt.verifyToken], controller.userDeleteAvatar);


  //delete user
  app.delete("/user/:id", [authJwt.verifyToken], controller.userDelete);

  //put user data
  app.put("/user/:id", [authJwt.verifyToken], controller.userPut);

  //driver licence
  app.post("/user/img/:id/img", [authJwt.verifyToken], upload.single('img'), controller.userImgUpl);
  app.delete("/user/img/:id", [authJwt.verifyToken], controller.userDeleteImg);
  app.delete("/user/img", [authJwt.verifyToken], controller.userDeleteAllImg);

  //medical card
  app.post("/user/medical/:id/medical", [authJwt.verifyToken], upload.single('medicalCard'), controller.userMedicalUpl);
  app.delete("/user/medical/:id", [authJwt.verifyToken], controller.userDeleteMedical);
  app.delete("/user/medical", [authJwt.verifyToken], controller.userDeleteAllMedical);


  //security card
  app.post("/user/security/:id/security", [authJwt.verifyToken], upload.single('security'), controller.userSecurityUpl);
  app.delete("/user/security/:id", [authJwt.verifyToken], controller.userDeleteSecurity);
  app.delete("/user/security", [authJwt.verifyToken], controller.userDeleteAllSecurity);


  //employment card
  app.post("/user/employment/:id/employment", [authJwt.verifyToken], upload.single('employment'), controller.userEmploymentUpl);
  app.delete("/user/employment/:id", [authJwt.verifyToken], controller.userDeleteEmployment);
  app.delete("/user/employment", [authJwt.verifyToken], controller.userDeleteAllEmployment);


  //w4form
  app.post("/user/w4form/:id/w4form", [authJwt.verifyToken], upload.single('w4form'), controller.userW4formtUpl);
  app.delete("/user/w4form/:id", [authJwt.verifyToken], controller.userDeleteW4form);
  app.delete("/user/w4form", [authJwt.verifyToken], controller.userDeleteAllW4form);


  //confidential info
  app.post("/user/confidential/:id/confidential", [authJwt.verifyToken], upload.single('confidential'), controller.userConfidentialUpl);
  app.delete("/user/confidential/:id", [authJwt.verifyToken], controller.userDeleteConfidential);
  app.delete("/user/confidential", [authJwt.verifyToken], controller.userDeleteAllConfidential);



  //owned
  app.post("/user/owned/:id/owned", [authJwt.verifyToken], upload.single('owned'), controller.userOwnedUpl);
  app.delete("/user/owned/:id", [authJwt.verifyToken], controller.userDeleteOwned);
  app.delete("/user/owned", [authJwt.verifyToken], controller.userDeleteAllOwned);




  //expenses
  app.post("/user/expenses/:id/expenses", [authJwt.verifyToken], upload.single('expenses'), controller.userExpensesUpl);
  app.delete("/user/expenses/:id", [authJwt.verifyToken], controller.userDeleteExpenses);
  app.delete("/user/expenses", [authJwt.verifyToken], controller.userDeleteAllExpenses);



  //desposit
  app.post("/user/desposit/:id/desposit", [authJwt.verifyToken], upload.single('desposit'), controller.userDespositUpl);
  app.delete("/user/desposit/:id", [authJwt.verifyToken], controller.userDeleteDesposit);
  app.delete("/user/desposit", [authJwt.verifyToken], controller.userDeleteAllDesposit);




  //credit
  app.post("/user/credit/:id/credit", [authJwt.verifyToken], upload.single('credit'), controller.userCreditUpl);
  app.delete("/user/credit/:id", [authJwt.verifyToken], controller.userDeleteCredit);
  app.delete("/user/credit", [authJwt.verifyToken], controller.userDeleteAllCredit);



  //eligiibity
  app.post("/user/eligiibity/:id/eligiibity", [authJwt.verifyToken], upload.single('eligiibity'), controller.userEligiibityUpl);
  app.delete("/user/eligiibity/:id", [authJwt.verifyToken], controller.userDeleteEligiibity);
  app.delete("/user/eligiibity", [authJwt.verifyToken], controller.userDeleteAllEligiibity);


  //drug
  app.post("/user/drug/:id/drug", [authJwt.verifyToken], upload.single('drug'), controller.userDrugUpl);
  app.delete("/user/drug/:id", [authJwt.verifyToken], controller.userDeleteDrug);
  app.delete("/user/drug", [authJwt.verifyToken], controller.userDeleteAllDrug);



  //mvr
  app.post("/user/mvr/:id/mvr", [authJwt.verifyToken], upload.single('mvr'), controller.userMvrUpl);
  app.delete("/user/mvr/:id", [authJwt.verifyToken], controller.userDeleteMvr);
  app.delete("/user/mvr", [authJwt.verifyToken], controller.userDeleteAllMvr);


  //another
  app.post("/user/another/:id/another", [authJwt.verifyToken], upload.single('another'), controller.userAnotherUpl);
  app.delete("/user/another/:id", [authJwt.verifyToken], controller.userDeleteAnother);
  app.delete("/user/another", [authJwt.verifyToken], controller.userDeleteAllAnother);


  //pdf
  app.post("/user/filePdf/:id", [authJwt.verifyToken], uploadPdf.single('file'), controller.userfilePdfUpl);
  app.delete("/user/filePdf/:id", [authJwt.verifyToken], controller.userDeleteFilePdf);
  app.get("/all/uploads/:name", controller.userGetPdf);
  app.delete("/all/uploads/:name", controller.userDeleteFilePdfFromFolder);






  app.get(
    "/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
    app.get(
    "/admin/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminUser
  );

};