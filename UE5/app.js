const express = require("express");
const crypto = require("crypto");
const path = require("path");
const formidable = require("express-formidable");
var url = require("url");
const googleLogin = require("./google-login.js");
const digestAuth = require("./digest-auth");
const sanitizer = require('sanitize')();

const app = express();
var cors = require("cors");
const { request } = require("http");

app.use(formidable());
app.use(cors());
app.use(express.json());

const port = 3000;
const MAX_SESSION_TIME = 120000; // we have 2min = 120.000ms session time

const activeSessions = [];
const allowedUsers = [
  {
    username: "test",
    password: "test",
  },
  { username: "florian", password: "czeczil" },
  { username: "peter", password: "oettl" },
];

const generateSessionKey = () => {
  return crypto.randomBytes(16).toString("base64");
};

const isCorrectUserData = ({ username, password }) => {
  var user = allowedUsers.find((user) => user.username === username);

  if (!user) return false;
  return user.password === password;
};

app.get("/", (req, res) => {
  res.status(200).sendFile(path.resolve("./static/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/secure-page", (req, res) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return res.status(401).send("Unauthorized");
  }

  const session = cookie.replace(/^session=/, ""); // remove the 'session=' part from the beginning, we can split on '=' as the string is urlencoded

  if (activeSessions.indexOf(decodeURIComponent(session)) === -1) {
    console.log("session:", decodeURIComponent(session), "was not found");
    console.log("current sessions: ", activeSessions);
    return res.status(401).send("Unauthorized");
  }

  res.status(200).sendFile(path.resolve("./static/secure-page.html"));
});

app.post("/login", (req, res) => {
  const session = generateSessionKey();

  const username = sanitizer.value(req.fields.username, 'string');
  const password = sanitizer.value(req.fields.password, 'string');

  //todo: check username and password of the request body, because right now we allow every user to log in
  if (!isCorrectUserData({username, password})) {
    return res.redirect("/");
  }

  console.log({username, password});

  //create a new session
  activeSessions.push(session);

  setTimeout(() => {
    activeSessions.splice(activeSessions.indexOf(session), 1);
  }, MAX_SESSION_TIME);

  res.cookie("session", session, { maxAge: MAX_SESSION_TIME });
  res.redirect("/secure-page");
});

app.get("/google-login", (req, res) => {
  const auth = googleLogin.createConnection(); // this is from previous step
  const url = googleLogin.getConnectionUrl(auth);
  res.setHeader("Content-Type", "application/json");
  res.send({ url });
});

app.get("/google-code", async (req, res) => {
  const session = generateSessionKey();

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  console.log(query);
  if (query.code) {
    const result = await googleLogin.getGoogleAccountFromCode(query.code);
    console.log(result);
    if (result.tokens.access_token) {
      activeSessions.push(session);

      setTimeout(() => {
        activeSessions.splice(activeSessions.indexOf(session), 1);
      }, MAX_SESSION_TIME);

      res.cookie("session", session, { maxAge: MAX_SESSION_TIME });
      res.redirect("/secure-page");
    }
  }
});

app.get("/digest-login", (req, res) => {
  let authInfo,
    digestAuthObject = {};

  //if there is no authorization header on request send digest challenge
  if (!req.headers.authorization) {
    digestAuth.authenticateUser(res);
    return;
  }

  authInfo = req.headers.authorization.replace(/^Digest /, "");
  authInfo = digestAuth.parseAuthInfo(authInfo);

  if (authInfo.username !== digestAuth.digestCredentials.username) {
    digestAuth.authenticateUser(res);
    return;
  }

  digestAuthObject.ha1 = digestAuth.cryptoUsingMD5(
    `${authInfo.username}:${digestAuth.digestCredentials.realm}:${digestAuth.digestCredentials.password}`
  );

  digestAuthObject.ha2 = digestAuth.cryptoUsingMD5(
    `${req.method}:${authInfo.uri}`
  );

  const response = digestAuth.cryptoUsingMD5(
    [
      digestAuthObject.ha1,
      authInfo.nonce,
      authInfo.nc,
      authInfo.cnonce,
      authInfo.qop,
      digestAuthObject.ha2,
    ].join(":")
  );

  digestAuthObject.response = response;

  if (authInfo.response !== digestAuthObject.response) {
    digestAuth.authenticateUser(response);
    return;
  }

  console.log("made it after response check")

  //create a session
  
  const session = generateSessionKey();

  activeSessions.push(session);

  setTimeout(() => {
    activeSessions.splice(activeSessions.indexOf(session), 1);
  }, MAX_SESSION_TIME);

  res.cookie("session", session, { maxAge: MAX_SESSION_TIME });

  res.redirect('/secure-page')
});
