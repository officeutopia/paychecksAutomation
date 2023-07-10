const apiKeys = {
    postgres_user: process.env.POSTGRES_USER,
    postgres_password: process.env.POSTGRES_PASSWORD,
    postgres_name: process.env.POSTGRES_NAME,
    postgres_host: process.env.POSTGRES_HOST,
    postgres_port: process.env.POSTGRES_PORT,
    employeesFolderId: process.env.EMPLOYEES_FOLDER_ID,
    emailSender: "yossef@utopia.tech"
}

const gmailCredentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    refresh_token: process.env.GOOGLE_GMAIL_REFRESH_TOKEN,
}

const driveCredentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
}

module.exports = {apiKeys, gmailCredentials, driveCredentials}