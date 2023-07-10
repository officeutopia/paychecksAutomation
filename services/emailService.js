const { Drive } = require("../providers/google/drive");
const { Gmail } = require("../providers/google/gmail");

class EmailService {
  mail_provider;
  could_storage_provider;

  providerNames = {
    google: () => {
      return { mail: new Gmail(), cloud: new Drive() };
    },
  };

  constructor(name) {
    const providers = this.providerNames[`${name}`]();
    this.mail_provider = providers.mail;
    this.could_storage_provider = providers.cloud;
  }

  async connectToEmail(credentials) {
    return await this.mail_provider.connectToEmail(credentials);
  }

  async checkEmailConnection() {
    return await this.mail_provider.checkEmailConnection();
  }

  async connectToCloud(credentials) {
    return await this.could_storage_provider.connectToCloud(credentials);
  }
  
  async checkCloudConnection() {
    return await this.could_storage_provider.checkCloudConnection();
  }

  async getMessages(options) {
    return this.mail_provider.getMessages(options);
  }

  async downloadFiles(options) {
    return await this.mail_provider.downloadFiles(options);
  }

  async downloadFilesOnClientPc(message_id) {
    return await this.mail_provider.downloadFilesOnClientPc(message_id)
  }

  async uploadFileToDrive(options) {
    return await this.could_storage_provider.uploadFileToDrive(options);
  }

  async getFullContentOfMessages(options) {
    return await this.mail_provider.getFullContentOfMessages(options)
  }
}

module.exports = { EmailService };
