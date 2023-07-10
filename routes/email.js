// // routes/email.js
// const express = require("express");
// const {
//   connectToEmail,
//   getMessages,
//   downloadFiles,
//   uploadFilesToDrive,
//   connectToCloud,
//   checkIfMessageIdExistInDB,
//   insertMessage,
//   deleteFilesFromFolder,
// } = require("../middlewares/emailMiddlewares");
// const router = express.Router();

// router.get(
//   "/uploadToDrive",
//   async (req, res, next) => {
//     try {
//       await connectToEmail(req, res, next);
//       await getMessages(req, res, next);
//       await checkIfMessageIdExistInDB(req, res, next);
//       await insertMessage(req, res, next);
//       await downloadFiles(req, res, next);
//       await connectToCloud(req, res, next);
//       await uploadFilesToDrive(req, res, next)
//     } catch(err) {
//       next(err)
//     }
//   },
// );

// module.exports = router;

