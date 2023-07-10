const { createReadStream} = require("fs");
const { default: axios } = require("axios");
const { google } = require("googleapis");

class Drive {
  drive;
  constructor() {}

  async connectToCloud(credentials) {
    const { client_id, client_secret, redirect_uri, refresh_token } =
      credentials;

    if (!client_id || !client_secret || !redirect_uri || !refresh_token) {
    }

    const client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uri
    );

    client.setCredentials({ refresh_token: refresh_token });

    this.drive = google.drive({ version: "v3", auth: client });
  }

  async checkCloudConnection() {
    const response = await this.drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(name)',
    })
    return { statusText: response.statusText, statusCode: response.status };
  }

  async uploadFileToDrive(options) {
    const { folder_id, file_name, file_path } = options;

    const res = await this.drive.files.create({
      requestBody: {
        name: file_name,
        mimeType: "application/pdf",
        parents: folder_id ? [folder_id] : [],
      },
      media: {
        mimeType: "application/pdf",
        body: createReadStream(file_path),
      },
    });

    const status = res.data;

    return status;
  }
}

module.exports = { Drive };
