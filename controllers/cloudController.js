const { driveCredentials } = require("../constants");
const { readdirSync } = require("fs");
const { PdfService } = require("../services/pdfService");
const employees = require("../employeesDev.json");
const { EmailService } = require("../services/emailService");
const { extractEmployeeIdFromPaycheck } = require("../utils/cloudUtils");

const connectToCloud = async (req, res, next) => {
  try {
    req.emailService = new EmailService("google");
    await req.emailService.connectToCloud(driveCredentials);
    next();
  } catch (error) {
    next(error);
  }
};

const checkCloudConnection = async (req, res, next) => {
  try {
    const cloudConnectionStatus = await req.emailService.checkCloudConnection();
    res.status(200).send(cloudConnectionStatus);
  } catch (error) {
    next(error);
  }
};

const uploadPaychecksToDrive = async (req, res, next) => {
  try {
    const pdfService = new PdfService();
    const uploadedFiles = [];
    let uploadPromises = [];

    const paychecks = readdirSync("./downloads");
    uploadPromises = paychecks.map(async (paycheck) => {
      const paycheck_path = `./downloads/${paycheck}`;
      const text = await pdfService.parsePdf(paycheck_path);
      const employee = employees.find((employee) =>
        text.includes(employee.employee_id)
      );

      let newEmployeeFolderId;
      if (!employee) {
        const newEmployeeId = extractEmployeeIdFromPaycheck(text);
        newEmployeeFolderId = await req.emailService.createNewFolder(
          newEmployeeId
        );
      }

      const status = await req.emailService.uploadFileToDrive({
        folder_id: employee ? employee.id : newEmployeeFolderId,
        file_name: paycheck,
        file_path: paycheck_path,
      });

      uploadedFiles.push(status);
      return status;
    });
    await Promise.all(uploadPromises);
    return res.status(200).send({ statusText: "OK", uploadedFiles });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  connectToCloud,
  checkCloudConnection,
  uploadPaychecksToDrive,
};
