const express = require("express");
const crypto = require("crypto");

const app = express();

const credentials = {
  username: "digest",
  password: "digest",
  realm: "Digest Authentication",
};

const cryptoUsingMD5 = (data) => {
  return crypto.createHash("md5").update(data).digest("hex");
};

const realmHash = cryptoUsingMD5(credentials.realm);

const authenticateUser = (res) => {
  console.log({
    "WWW-Authenticate":
      'Digest realm="' +
      credentials.realm +
      '",qop="auth",nonce="' +
      Math.random() +
      '",opaque="' +
      realmHash +
      '"',
  });
  res.writeHead(401, {
    "WWW-Authenticate":
      'Digest realm="' +
      credentials.realm +
      '",qop="auth",nonce="' +
      Math.random() +
      '",opaque="' +
      realmHash +
      '"',
  });
  res.end("Authorization is needed.");
};

const parseAuthenticationInfo = (authData) => {
  const authenticationObj = {};
  authData.split(", ").forEach((d) => {
    d = d.split("=");

    authenticationObj[d[0]] = d[1].replace(/"/g, "");
  });
  //console.log(JSON.stringify(authenticationObj));
  return authenticationObj;
};

module.exports.digestCredentials = credentials;
module.exports.cryptoUsingMD5 = cryptoUsingMD5;
module.exports.realmHash = realmHash;
module.exports.authenticateUser = authenticateUser;
module.exports.parseAuthInfo = parseAuthenticationInfo;
