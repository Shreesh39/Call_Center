const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const auth = require("../middlewares/auth");

router.get("/get-profile/:id", auth(), userController.getProfile);
router.put("/update-profile/:id", userController.updateProfile);
router.get("/list", userController.usersList);
router.delete("/delete-profile/:id", userController.deleteProfile);

module.exports = router;
