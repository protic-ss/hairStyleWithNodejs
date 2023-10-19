require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const redis = require("redis");

const app = express();
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

var corOptions = {
  origin: "https//localhost:8081",
};

let refreshTokens = []; // not good idea to this for production , since each time server load it will wipe out all data

// middleware

app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routres

const router = require("./routes/productRouter.js");
app.use("/api/products", router);

// testing api

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = genrateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", (req, res) => {
  // Authentication User
  const username = req.body.username;
  const user = { name: username };

  const accessToken = genrateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function genrateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

// port
const PORT = process.env.PORT || 8089;
//server listern
app.listen(PORT, () => {
  console.log(`alive at port ${PORT}`);
});
