const express = require("express");
const router = express.Router();
const {
  connectToCloud,
  uploadPaychecksToDrive,
  checkCloudConnection,
} = require("../controllers/cloudController");
const {
  checkIfMessageIdExistInDB,
  insertMessageIdToDB,
  connectToDB,
} = require("../controllers/dbController");
const { connectToEmail, downloadPaychecks } = require("../controllers/mailController");

/**
 * @swagger
 * tags:
 *  name: Cloud Api
 *  description: The cloud manage Api
 */

/**
 * @swagger
 * /cloud/checkCloudConnection:
 *   get:
 *     summary: Checks connection to the cloud API
 *     tags: [Cloud Api]
 *     responses:
 *       200:
 *         description: Return "OK" if connection to the cloud API is good
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                 statusCode:
 *                   type: number
 */
router.get("/checkCloudConnection", connectToCloud, checkCloudConnection);

/**
 * @swagger
 * /cloud/uploadPaychecksToDrive/{message_id}:
 *   get:
 *     summary: Uploading paychecks to cloud storage.
 *     parameters:
 *      - in: path
 *        name: message_id
 *        required: true
 *        schema:
 *          type: string
 *        description: The paycheck message id
 *     tags: [Cloud Api]
 *     responses:
 *       200:
 *         description: Return  if connection to the cloud API is good
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusText:
 *                   type: string
 *                 uploadedFiles:
 *                   type: array
 *                   items: 
 *                      type: object
 *                      example: {kind: "string", id: "folder id", name: "filename", filetype: "mimetype"}
 */
router.get(
  "/uploadPaychecksToDrive/:message_id",
  connectToEmail,
  downloadPaychecks,
  connectToCloud,
  // connectToDB,
  // checkIfMessageIdExistInDB,
  // insertMessageIdToDB,
  uploadPaychecksToDrive
);

module.exports = router;
