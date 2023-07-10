const { driveCredentials } = require("../constants");
const { readdirSync } = require("fs");
const { PdfService } = require("../services/pdfService");
const employees = require("../employeesDev.json");
const { EmailService } = require("../services/emailService");
const moment = require('moment');

const connectToCloud = async (req, res, next) => {
  try {
    req.emailService = new EmailService("google");
    await req.emailService.connectToCloud(driveCredentials);
    console.log("Connect to cloud: Drive!");
    next();
  } catch (error) {
    next(error);
  }
};

const checkCloudConnection = async (req, res, next) => {
  try {
    const cloudConnectionStatus = await req.emailService.checkCloudConnection();
    res.status(200).send(cloudConnectionStatus)
  } catch(error) {
    next(error)
  }
}

const uploadPaychecksToDrive = async (req, res, next) => {
  try {
    const pdfService = new PdfService();
    const uploadedFiles = [];
    let uploadPromises = [];
    const files = readdirSync("./downloads");
    uploadPromises = files.map(async (file) => {
      const file_path = `./downloads/${file}`;
      const text = await pdfService.parsePdf(file_path);
      const employee = employees.find((employee) =>
        text.includes(employee.employee_id)
      );

      const currentDate = moment();
      const previousMonth = currentDate.subtract(1, 'month');
      previousMonth.format('YYYY-MM-DD')

      const status = await req.emailService.uploadFileToDrive({
        folder_id: employee.id,
        file_name: employee.name + previousMonth.format('YYYY-MM-DD'),
        file_path,
      });

      uploadedFiles.push(status);
      return status
    });
    await Promise.allSettled(uploadPromises);
    return res.status(200).send({ statusText: "OK", uploadedFiles });
  } catch (error) {
    next(error);
  }
};

module.exports = { connectToCloud, checkCloudConnection,uploadPaychecksToDrive };
