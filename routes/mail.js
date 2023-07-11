const express = require("express");
const { connectToEmail, getMessages, downloadPaychecks, getFullContentOfMessages, checkEmailConnection, downloadPaychecksOnClientPc } = require("../controllers/mailController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Email Api
 *  description: The email manage Api
 */

/**
 * @swagger
 * /mail/checkEmailConnection:
 *   get:
 *     summary: Checks connection to the email API
 *     tags: [Email Api]
 *     responses:
 *       200:
 *         description: Return "OK" if connection to the email API is good
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
router.get('/checkEmailConnection', connectToEmail, checkEmailConnection);


/**
 * @swagger
 * /mail/getMessagesIds:
 *   get:
 *     summary: Get the messages id's
 *     tags: [Email Api]
 *     responses:
 *       200:
 *         description: Return an object of messages id's
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                      type: object
 *                      example: {id: "message_id", thread_id: "message_thread_id"}
 */
router.get('/getMessagesIds', connectToEmail ,getMessages);


// /**
//  * @swagger
//  * /mail/downloadPaychecks/{message_id}:
//  *   get:
//  *     summary: Downloading the paychecks on client pc.
//  *     parameters:
//  *       - in: path
//  *         name: message_id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The paycheck message id
//  *     tags: [Email Api]
//  *     responses:
//  *       200:
//  *         description: Return "OK" if download was successful
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 statusText:
//  *                   type: string
//  *                 statusCode:
//  *                   type: number
//  *                 downloadedFiles:
//  *                   items: 
//  *                      type: string
//  *                      example: "file_1"
//  */
router.get('/downloadPaychecks/:message_id', connectToEmail ,downloadPaychecks)

/**
 * @swagger
 * /mail/downloadPaychecksOnClientPc/{message_id}:
 *   get:
 *     summary: Downloading the paychecks on client pc.
 *     parameters:
 *       - in: path
 *         name: message_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The paycheck message id
 *     tags: [Email Api]
 *     responses:
 *       200:
 *         description: A download link of the paychecks.
 */
router.get('/downloadPaychecksOnClientPc/:message_id', connectToEmail ,downloadPaychecksOnClientPc)

/**
 * @swagger
 * /mail/getFullContentOfMessages:
 *   get:
 *     summary: Sending back full message content.
 *     tags: [Email Api]
 *     responses:
 *       200:
 *         description: Return array of full content message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullMessages:
 *                      type: array
 *                      items: 
 *                          type: object
 *                          example: {message_id: "message_id",subject: "Subject of the message", textContent: "Text inside message body", htmlContent: "Html content as string"}
 */
router.get('/getFullContentOfMessages', connectToEmail, getFullContentOfMessages)

module.exports = router;