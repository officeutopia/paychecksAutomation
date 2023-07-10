const dotenv = require("dotenv/config.js");

const swaggerJsDoc = require("swagger-jsdoc");
const express = require("express");
const cors = require("cors");
const mailRouter = require('./routes/mail.js')
const cloudRouter = require('./routes/cloud.js')
const swaggerUI = require('swagger-ui-express');
const { PostgresService } = require("./services/postgresService.js");

global.postgresService = new PostgresService();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Office Automation: Paychecks.",
      version: "1.0.0",
      description: "Auto upload to drive",
    },
    servers: [
      {
        url: "http://localhost:1000"
      }
    ]
  },
  apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(swaggerOptions)

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_ADDRESS,
  credentials: true,
};

app.use(express.json());
// app.use(cors(corsOptions));

// routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.use('/mail', mailRouter);
app.use('/cloud', cloudRouter)

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("An error occurred:", err.message);
  return res.status(500).send({ statusText: err.message, statusCode: err.code });
};

app.use(errorHandler)

global.postgresService.connectToPostgres().then(() => {
  app.listen(1000, async () => {
    console.log(`Server is up and running on port: ${1000}`);
  });
}).catch(error => {
  console.error("Failed to connect to the PostgreSQL database:", error.message);
})




