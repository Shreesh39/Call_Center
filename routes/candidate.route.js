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

  console.log('Upload route hit'); // Log when route is accessed

  if (!req.file) {
    console.log('No file uploaded'); // Log if no file is provided

    return res.status(400).json({ message: "No file uploaded" });
  }
  
  const excelData = req.file.buffer.toString(); // Convert buffer to string
  
  console.log('File uploaded:', req.file.originalname); // Log file name
  console.log('File Data:', excelData); // Log the file data (you may want to limit this if the data is large)

  // Pass the Excel data to the appropriate controller function
  candidateController.uploadCandidates(req, res, excelData);

  // Sending response to the client
  res.status(200).json({ message: "Excel file upload initiated" });
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
