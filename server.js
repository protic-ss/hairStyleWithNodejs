require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

var corOptions = {
  origin: "https//localhost:8081",
};

// middleware

app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routres

const router = require("./routes/productRouter.js");
app.use("/api/products", router);


app.get("/", authenticateToken, (req, res) => {
  res.json({ message: "hi universe" });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// port
const PORT = process.env.PORT || 8080;
//server listern
app.listen(PORT, () => {
  console.log(`alive at port ${PORT}`);
});
