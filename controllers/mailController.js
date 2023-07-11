const { EmailService } = require("../services/emailService");
const { gmailCredentials, apiKeys } = require("../constants");
const archiver = require('archiver');
const { emptyDir } = require("fs-extra");

const connectToEmail = async (req, res, next) => {
  try {
    req.emailService = new EmailService("google");
    await req.emailService.connectToEmail(gmailCredentials);
    next();
  } catch (error) {
    next(error);
  }
};

const checkEmailConnection = async (req, res, next) => {
  try {
    const emailConnectionStatus = await req.emailService.checkEmailConnection();
    res.status(200).send(emailConnectionStatus);
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { from, subject } = req.body;
    const messages = await req.emailService.getMessages({
      from: "zhandchen@gmail.com",
      subject: "שכר יוני",
    });
    req.body.message_id = messages[1].id;
    // console.log("Got the message!");
    res.send({ messages });
  } catch (error) {
    next(error);
  }
};

const downloadPaychecks = async (req, res, next) => {
  try {
    const messageId = req.params.message_id; //188be3e63625569b - paychecks message for example
    if (!messageId) throw new Error('Message id not provided')
    req.filesStatus = await req.emailService.downloadFiles({
      message_id: messageId,
      path: "./downloads",
    });
    // console.log("Downloaded the files!");
    next()
  } catch (error) {
    next(error);
  }
};

const downloadPaychecksOnClientPc = async (req, res, next) => {
  try {
    const filesStreamArray = await req.emailService.downloadFilesOnClientPc(
      req.params.message_id
    );

    const zip = archiver('zip');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=files.zip');

    zip.pipe(res);

    for (const fileData of filesStreamArray) {
      zip.append(fileData.stream, { name: fileData.name });
    }
    
    // Finalize the ZIP archive
    await zip.finalize();
  } catch (error) {
    next(error);
  }
};

const getFullContentOfMessages = async (req, res, next) => {
  try {
    const messagesContent = await req.emailService.getFullContentOfMessages({
      from: "zhandchen@gmail.com",
      subject: "שכר יוני",
    });
    res.send({ fullMessages: messagesContent });
  } catch (error) {
    next(error);
  }
};

const emptyDownloadsFolderFromPaychecks = async (req, res, next) => {
  try {
    await emptyDir('./downloads');
    return res.status(200).send({ statusText: "OK", uploadedFiles: req.uploadedFiles });
  }catch(error) {
    next(error);
  }
} // to implement

module.exports = {
  connectToEmail,
  checkEmailConnection,
  getMessages,
  downloadPaychecks,
  downloadPaychecksOnClientPc,
  getFullContentOfMessages,
  emptyDownloadsFolderFromPaychecks
};
