require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const app = express();

var corOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

app.use("/uploads", express.static("uploads"));

//routres
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/images", (req, res) => {
  const folderPath = "./uploads";
  let arrFiles = [];

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }

    // 'files' is an array of file and folder names in the specified directory
    res.json({ files });
  });
});

// its for same server image upload
// app.post("/upload", function (req, res) {
//   let sampleFile;
//   let uploadPath;
//   console.log(req.files)

//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send("No files were uploaded.");
//   }

//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   sampleFile = req.files.sampleFile;
//   uploadPath = __dirname + "/uploads/" + sampleFile.name;

//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv(uploadPath, function (err) {
//     if (err) return res.status(500).send(err);

//     res.send("File uploaded!");
//   });
// });

app.post("/upload", function (req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.image;
  uploadPath = __dirname + "/uploads/" + new Date().getTime() + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send("File uploaded!");
  });
});

const router = require("./routes/productRouter.js");
app.use("/api/products", router);

app.get("/test", authenticateToken, (req, res) => {
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
