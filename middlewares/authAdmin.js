const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const User = require("../models/user.model");

config();

const authAdmin = () => async (req, res, next) => {
  const { headers } = req;
  const accessToken = headers.authorization
    ? headers.authorization.split(" ")[1]
    : null; // if token not send it gives split of undef error
  if (accessToken === null) {
    return res
      .status(400)
      .json({ status: 400, message: "Bearer Token is required." });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded });
    console.log(user.role, "oooooooooooooo");
    console.log(decoded, "decoded");
    req.user = decoded;
    if (user.role == "admin") {
      return next();
    } else {
      return res
        .status(401)
        .json({ msg: "Login as admin to access this route" });
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: err.message });
    }
    return res.status(401).json({ msg: err.message });
  }
};

module.exports = authAdmin;
