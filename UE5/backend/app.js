const express = require("express");
const crypto = require("crypto");
const path = require("path");
const formidable = require("express-formidable");

const app = express();

app.use(formidable());

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
  var user = allowedUsers.find(user => user.username === username);

  if(!user) return false;
  return user.password === password;
};

app.get("/", (req, res) => {
  res.status(200).sendFile(path.resolve("../frontend/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/secure-page", (req, res) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return res.status(401).send("Unauthorized");
  }

  const session = cookie.split("=")[1]; // remove the 'session=' part from the beginning, we can split on '=' as the string is urlencoded

  if (activeSessions.indexOf(decodeURIComponent(session)) === -1) {
    console.log("session:", decodeURIComponent(session), "was not found");
    console.log("current sessions: ", activeSessions);
    return res.status(401).send("Unauthorized");
  }

  res.status(200).sendFile(path.resolve("../frontend/secure-page.html"));
});

app.post("/login", function (req, res) {
  const session = generateSessionKey();

  //todo: check username and password of the request body, because right now we allow every user to log in
  if(!isCorrectUserData(req.fields)){
    return res.redirect('/');
  }

  console.log(req.fields);

  //create a new session
  activeSessions.push(session);

  setTimeout(() => {
    activeSessions.splice(activeSessions.indexOf(session), 1);
  }, MAX_SESSION_TIME);

  res.cookie("session", session, { maxAge: MAX_SESSION_TIME });
  res.redirect("/secure-page");
});
