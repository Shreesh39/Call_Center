require('dotenv').config();

const mongoose = require("mongoose");
const mongoURL = process.env.MONGODB_URL; 

mongoose
  .connect(`${mongoURL}`)
  .then(() => console.log("DB Connected successfully!"))
  .catch((err) => console.log("Something Went Wrong", err));
