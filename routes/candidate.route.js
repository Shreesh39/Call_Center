const express = require("express");
const router = express.Router();
const { candidateController } = require("../controllers");
const auth = require("../middlewares/auth");

router.post("/add", auth(), candidateController.createCandidate);
router.get("/get/:id", auth(), candidateController.getCandidate);
router.get("/list", auth(), candidateController.getCandidateList);
router.put("/update/:id", auth(), candidateController.updateCandidate);
router.delete("/delete/:id", auth(), candidateController.deleteCandidate);
router.get("/myList", auth(), candidateController.getMyCandidateList);
router.post("/addRemark", auth(), candidateController.addRemarksCandidate);

module.exports = router;
