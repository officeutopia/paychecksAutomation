const { apiKeys } = require("../../constants");
const { Client } = require("pg");

class Postgres {
  #db_config = {
    user: apiKeys.postgres_user,
    password: apiKeys.postgres_password,
    host: apiKeys.postgres_host,
    port: apiKeys.postgres_port,
    database: apiKeys.postgres_name,
  };
  constructor() {
    this.client = new Client(this.#db_config);
  }

  connectToPostgres = async () => {
    await this.client.connect();
    await this.#createTable();
    console.log("Connected to the PostgreSQL database");
  };

  #createTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      message_id VARCHAR(100)
    )
  `;

    await this.client.query(createTableQuery);
  };

  checkIfMessageExist = async (message_id) => {
    const checkIfMessageExistQuery = `SELECT * FROM messages WHERE message_id = '${message_id}' LIMIT 1;`
    return await this.client.query(checkIfMessageExistQuery);
  }

  insertMessage = async (message_id) => {
    const insertMessageQuery = `INSERT INTO messages (message_id) VALUES ('${message_id}');`;
    await this.client.query(insertMessageQuery);
  };
}

module.exports = { Postgres };
