const express = require("express");
const router = express.Router();
const { candidateController } = require("../controllers");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const multer = require("multer");


// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle Excel upload
router.post("/upload", upload.single("file"), (req, res) => {
  console.log('File upload route triggered.');

  // Check if file was uploaded
  if (!req.file) {
    console.log('No file uploaded.');
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  const filePath = req.file; // Use req.file.path if you use disk storage
  console.log('File path:', filePath); // Log the file path

  // Pass the file path to the controller
  candidateController.uploadCandidates(req, res, filePath)
    .then(() => {
      console.log('uploadCandidates function executed.');
    })
    .catch(err => {
      console.error('Error in uploadCandidates function:', err);
    });
});

router.post("/add", auth(), candidateController.createCandidate);
router.get("/get/:id", auth(), candidateController.getCandidate);
router.get("/list", auth(), candidateController.getCandidateList);
router.get("/adminlist", authAdmin(), candidateController.getCandidateList);
router.put("/update/:id", auth(), candidateController.updateCandidate);
router.delete("/delete/:id", auth(), candidateController.deleteCandidate);
router.get("/myList", auth(), candidateController.getMyCandidateList);
router.post("/addRemark", auth(), candidateController.addRemarksCandidate);

module.exports = router;
