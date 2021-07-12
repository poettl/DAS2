const google = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId:
    '906299015149-4fr9eev9r3hu1st4nmqobjgkmp8cfmt0.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: '4Q1XSyXLNK38h11EKr9WgRXb', // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: 'http://localhost:3000/google-code', // this must match your google api settings
};

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];

/*************/
/** HELPERS **/
/*************/

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope,
  });
}

function createConnection() {
  return new google.Auth.OAuth2Client(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

async function getGoogleAccountFromCode(code) {
  return new Promise(async (resolve, reject) => {
    try {
      const oAuthClient = await this.createConnection();
      const client = new OAuth2Client(this.clientID);
      const tokens = await oAuthClient.getToken(code);
      const { id_token } = tokens.tokens;
      console.log('id_token', id_token);
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: this.clientID,
      });
      const payload = ticket.getPayload();
      resolve({ user: payload, tokens: tokens.tokens });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports.getGoogleAccountFromCode = getGoogleAccountFromCode;
module.exports.getConnectionUrl = getConnectionUrl;
module.exports.createConnection = createConnection;
