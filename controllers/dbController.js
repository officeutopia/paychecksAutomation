const { PostgresService } = require("../services/postgresService");

const connectToDB = async (req, res, next) => {
  try {
    req.postgresService = new PostgresService();
    await req.postgresService.connectToPostgres();
    next();
  } catch (error) {
    next(error);
  }
};

const checkIfMessageIdExistInDB = async (req, res, next) => {
  try {
    const bool = await global.postgresService.checkIfMessageExist(
      req.params.message_id
    );
    if (bool.rowCount != 0) throw new Error("Message exists");
    // console.log("This is a new Message!");
    next();
  } catch (error) {
    next(error);
  }
};

const insertMessageIdToDB = async (req, res, next) => {
  try {
    await global.postgresService.insertMessage(req.params.message_id);
    // console.log("Saved message in DB!");
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  connectToDB,
  checkIfMessageIdExistInDB,
  insertMessageIdToDB,
};
