  const express = require("express");
const routes = require("./routes");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const uploadFile = require("./upload.middleware");
const candidateRoutes = require("./routes/candidate.route");
const uploadLogRoutes = require('./routes/uploadLogRoutes');



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

// --------- Upload Controller Start-----------------


// --------- Upload Controller Ends------------------

app.use(express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



require("./config/config");
require("./routes/router")(app);

app.use("/", candidateRoutes);
app.use("/", routes);
app.use('/api', uploadLogRoutes);
