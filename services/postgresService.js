const { apiKeys } = require("../constants");
const { Client } = require("pg");
const { Postgres } = require("../providers/database/postgres");

class PostgresService {

  constructor() {
    this.db_provider = new Postgres();
  }

  connectToPostgres = async () => {
    await this.db_provider.connectToPostgres();
  };

  checkIfMessageExist = async (message_id) => {
    return await this.db_provider.checkIfMessageExist(message_id)
  }


  insertMessage = async (message_id) => {
    await this.db_provider.insertMessage(message_id)
  }

}

module.exports = {PostgresService}
