  const express = require("express");
const routes = require("./routes");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const uploadFile = require("./upload.middleware");
const candidateRoutes = require("./routes/candidate.route");



const http = require("http");
const fs = require("fs");
const path = require("path");

let cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

const port = process.env.REACT_APP_PORT;

app.listen(port, (req, res) => {
  console.log(`Server is listening at http://localhost:${port}`);
});

// const HTML_FILE_PATH = path.join(__dirname, "./frontend/login.html");
// app.get("/", (req, res) => {
//   res.sendFile(HTML_FILE_PATH);
// });

// --------- Upload Controller Start------------------

const fileUP = async (req, res) => {
  try {
    if (req.file) {
      console.log("ayaaaaaaaaaaaaaaaaa");
      const doc = await `http://localhost:${port}/${req.file.filename}`;
      return res.status(200).json({
        status: 200,
        message: "File uploaded successfully",
        file: doc,
      });
    }
    return res.status(400).json({
      status: 400,
      message: "File not found!",
      file: {},
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server Error !",
      error,
      stack: error.stack,
    });
  }
};


// --------- Upload Controller Ends------------------

app.use(express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



require("./config/config");
require("./routes/router")(app);

app.use("/", candidateRoutes);
app.use("/", routes);
