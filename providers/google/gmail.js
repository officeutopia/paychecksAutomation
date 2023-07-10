const { writeFile } = require("fs");
const { default: axios } = require("axios");
const { google } = require("googleapis");

class Gmail {
  gmail;
  client;

  constructor() {}

  async connectToEmail(credentials) {
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
    this.client = client;
    this.gmail = google.gmail({ version: "v1", auth: client });
  }

  async checkEmailConnection() {
    const profile = await this.gmail.users.getProfile({ userId: "me" });
    return { statusText: profile.statusText, statusCode: profile.status };
  }

  async getMessages(options) {
    const { from, subject } = options;

    const resp = await this.gmail.users.messages.list({
      auth: this.client,
      maxResults: 5,
      q: `from:${from}, subject: "${subject}"`,
      userId: "me",
    });

    return resp.data.messages;
  }

  async downloadFiles(options) {
    const { message_id, path } = options;

    const downloadedFiles = [];

    const attachments = await this.#getFileAttachments(message_id);

    const writePromises = attachments.map(async (attachment) => {
      const attachmentId = attachment.body.attachmentId;

      const fileBuffer = await this.#getFileAttachmentBuffer(attachmentId, message_id);

      downloadedFiles.push(attachment.filename);
      return this.#writeFileAsync(`${path}/${attachment.filename}`, fileBuffer);
    });

    await Promise.all(writePromises);

    return { statusText: "OK", statusCode: 200, downloadedFiles };
  }

  async downloadFilesOnClientPc(message_id) {
    if (!message_id) throw new Error("Message id not provided!")

    const filesStreamsArray = []

    const attachments = await this.#getFileAttachments(message_id);

    const downloadPromises = attachments.map(async (attachment) => {
      const attachmentId = attachment.body.attachmentId;
      
      const stream = await this.#getFileAttachmentStream(attachmentId ,message_id);
      filesStreamsArray.push({name: attachment.filename, stream});
      return stream
    })

    await Promise.all(downloadPromises);

    return filesStreamsArray;
  }

  async getFullContentOfMessages(options) {
    const messages = await this.getMessages(options);

    const fullMessages = await Promise.all(
      messages.map(async (message) => {
        const messageData = await this.gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full", // Retrieve the full message payload
        });

        const { textContent, htmlContent } = this.#extractMessageContent(
          messageData.data.payload
        );

        const subject = messageData.data.payload.headers.find(
          (header) => header.name === "Subject"
        ).value;
        return { message_id: message.id ,subject, textContent, htmlContent };
      })
    );

    return fullMessages;
  }

  // private functions
  async #getFileAttachments(message_id) {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message_id}?format=full`;

    const { token } = await this.client.getAccessToken();

    const config = {
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    };

    const response = await axios(config);

    let data = await response.data;

    const attachments = data.payload.parts.filter(
      (part) => part.mimeType === "application/pdf"
    );

    return attachments ? attachments : [];
  }

  async #getFileAttachmentBuffer(attachment_id, message_id) {
    const attachmentResponse = await this.gmail.users.messages.attachments.get({
      userId: "me",
      messageId: message_id,
      id: attachment_id,
    });

    // Get the base64-encoded data of the attachment
    const attachmentData = attachmentResponse.data.data;

    const attachmentBuffer = Buffer.from(attachmentData, "base64");

    return attachmentBuffer;
  }
  
  async #getFileAttachmentStream(attachment_id, message_id) {
    const attachmentResponse = await this.gmail.users.messages.attachments.get({
      userId: "me",
      messageId: message_id,
      id: attachment_id,
    }, { responseType: 'stream' });

    const stream = attachmentResponse.data
    return stream
  }

  async #writeFileAsync(file_path, file_buffer) {
    return new Promise((resolve, reject) => {
      writeFile(file_path, file_buffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  #extractMessageContent(payload) {
    let textContent = "";
    let htmlContent = "";

    function traverseParts(parts) {
      parts.forEach((part) => {
        if (part.mimeType === "text/plain") {
          textContent += Buffer.from(part.body.data, "base64").toString();
        } else if (part.mimeType === "text/html") {
          htmlContent += Buffer.from(part.body.data, "base64").toString();
        }

        if (part.parts) {
          traverseParts(part.parts);
        }
      });
    }

    if (payload.parts) {
      traverseParts(payload.parts);
    } else {
      if (payload.mimeType === "text/plain") {
        textContent = Buffer.from(payload.body.data, "base64").toString();
      } else if (payload.mimeType === "text/html") {
        htmlContent = Buffer.from(payload.body.data, "base64").toString();
      }
    }

    return { textContent, htmlContent };
  }
}

module.exports = { Gmail };
