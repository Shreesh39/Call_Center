const catchAsync = require("../utils/catchAsync");
const { Candidate } = require("../models");
const mongoose = require("mongoose");
const XLSX = require('xlsx');
const UploadLog = require('../models/uploadLog'); // Import the UploadLog model
const User = require('../models/user.model');
// --------------- Create candidate Detail ------------------
// const createCandidate = catchAsync(async (req, res) => {
//   try {
//     const identity = req.user;
//     const candidate = await Candidate.create({
//       ...req.body,
//       recruiterId: identity,
//     });
//     return res.status(200).json({
//       status: "200",
//       message: "Candidate created successfully!",
//       data: candidate,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "500",
//       message: "An error occurred while fetcihng candidate data !",
//       error: error.message,
//     });
//   }
// });

const createCandidate = catchAsync(async (req, res) => {
  try {
    const identity = req.user;
    const detailedRemark = {
      remark: req.body.detailedRemark,
      addedby: identity,
    };

    const candidateData = { ...req.body };
    delete candidateData.detailedRemark; // Remove detailedRemark from candidateData

    console.log(candidateData, "candidateData");

    const phoneNumber = candidateData.phoneNumber;
    const email = candidateData.email;

    const existPhone = await Candidate.findOne({ phoneNumber });
    if (existPhone) {
      return res.status(400).json({
        status: "400",
        message: `This number is assigned to candidate :  ${existPhone.candidateName} !`,
      });
    }
    const existEmail = await Candidate.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        status: "400",
        message: `This email is assigned to candidate :  ${existEmail.candidateName} !`,
      });
    }
    const candidate = await Candidate.create({
      ...candidateData,
      recruiterId: identity,
      detailedRemarks: [detailedRemark], // Add the detailed remark to the candidate data
    });

    return res.status(200).json({
      status: "200",
      message: "Candidate created successfully!",
      data: candidate,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching candidate data!",
      error: error.message,
    });
  }
});

// --------------- Get One  candidate Data ------------------
const getCandidate = catchAsync(async (req, res) => {
  try {
    const candidateId = req.params.id;
    const candidateDetail = await Candidate.findById(candidateId)
      .populate("recruiterId")
      .populate("taskAssignedTo");
    return res.status(200).json({
      status: "200",
      message: "Candidate data fetched successfully!",
      data: candidateDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetcihng candidate data !",
      error: error.message,
    });
  }
});

// -------------------- Update candidate  ------------------
const updateCandidate = catchAsync(async (req, res) => {
  try {
    const candidateId = req.params.id;
    const candidateDetail = await Candidate.findOneAndUpdate(
      { _id: candidateId },
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json({
      status: "200",
      message: "Candidate data updated successfully!",
      data: candidateDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while updating candidate data !",
      error: error.message,
    });
  }
});

// ------------------------ Delete selected candidate ------------------
const deleteCandidate = catchAsync(async (req, res) => {
  try {
    const candidateId = req.params.id;
    await Candidate.findOneAndDelete({ _id: candidateId });
    return res.status(200).json({
      status: "200",
      message: "Candidate deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while deleting candidate data !",
      error: error.message,
    });
  }
});

// --------------------- Get List of all candidate's ------------------
const getCandidateList = catchAsync(async (req, res) => {
  const searchName = req.query.name;
  const recruiterName = req.query.recruiter;
  const currentUser = req.user;
  const perPage = 9; //  Number of documents to display on each page
  const page = req.query.page ? parseInt(req.query.page, 10) : 1; // It specify the selected page number

  let query = {};
  if (recruiterName) {
    query = { recruiterId: recruiterName };
  }

  // let query = { userId: currentUser };

  if (searchName) {
    const searchValue = new RegExp(searchName, "i");
    query.$or = [{ title: searchValue }, { author: searchValue }];
  } // You can search candidate through title or author

  try {
    const totalCount = await Candidate.countDocuments(query);

    const candidateList = await Candidate.find(query)
      .populate("recruiterId")
      .populate("taskAssignedTo")
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.status(200).json({
      status: "200",
      message: "Client list fetched successfully!",
      data: candidateList,
      page,
      totalPages: Math.ceil(totalCount / perPage),
      count: candidateList.length,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching Client list!",
      error: error.message,
    });
  }
});

const getMyCandidateList = catchAsync(async (req, res) => {
  const searchName = req.query.name;
  const recruiterName = req.query.recruiter;
  const currentUser = req.user;
  const perPage = 9; //  Number of documents to display on each page
  const page = req.query.page ? parseInt(req.query.page, 10) : 1; // It specify the selected page number
  console.log(currentUser, "currentUser");
  let query = { recruiterId: mongoose.Types.ObjectId(currentUser) };
  if (recruiterName) {
    console.log("hawwwwwwwwwwwwwwwwwwww");
    query = { recruiterId: recruiterName };
  }

  if (searchName) {
    console.log("hawwwwwwwwwwwwwwwwwwww222222222222222222");
    const searchValue = new RegExp(searchName, "i");
    query.$or = [{ title: searchValue }, { author: searchValue }];
  } // You can search candidate through title or author

  try {
    const totalCount = await Candidate.countDocuments(query);

    const candidateList = await Candidate.find(query)
      .populate("recruiterId")
      .populate("taskAssignedTo")
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.status(200).json({
      status: "200",
      message: "Client list fetched successfully!",
      data: candidateList,
      page,
      totalPages: Math.ceil(totalCount / perPage),
      count: candidateList.length,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching Client list!",
      error: error.message,
    });
  }
});

// --------------------  Add Client Remarks  ------------------
const addRemarksCandidate = catchAsync(async (req, res) => {
  try {
    // Extract necessary data from the request
    const { newRemark, taskId } = req.body;
    // const addedBy = req.user; // Assuming your authentication middleware sets req.user with user information

    const addedBy = mongoose.Types.ObjectId(req.user);
    // Find the candidate using the taskId and update the detailed remarks
    const candidate = await Candidate.findOneAndUpdate(
      { _id: taskId },
      {
        $push: {
          detailedRemarks: {
            remark: newRemark,
            addedby: addedBy,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!candidate) {
      return res.status(400).json({
        status: "400",
        message: "Candidate not found!",
      });
    }

    return res.status(200).json({
      status: "200",
      message: "Detailed remark added successfully!",
      data: candidate,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while adding remaks for candidate !",
      error: error.message,
    });
  }
});


// Function to read excel file and save data
const uploadCandidates = async (req, res) => {
  if (!req.file) {
    console.error("File is required");
    return res.status(400).send({ message: 'No file uploaded.' });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const operations = [];
    const newCandidates = [];
    const duplicates = [];

    for (const row of sheet) {
      const email = row['email'];
      const phoneNumber = row['phoneNumber'];
      const candidateName = row['candidateName'];

      if (!email && !phoneNumber) {
        console.error(`Skipping row due to missing email and phone number: ${JSON.stringify(row)}`);
        continue;
      }

      let candidate = await Candidate.findOne({ $or: [{ email }, { phoneNumber }] });

      if (candidate) {
        // Duplicate found, fetch additional details including remarks and replace IDs with names
        const detailedRemarks = await Promise.all(candidate.detailedRemarks.map(async (remark) => {
          const user = await User.findById(remark.addedby).select('first_name').exec();
          return {
            ...remark,
            addedby: user ? user.first_name : 'Unknown'
          };
        }));

        duplicates.push({
          existingCandidate: candidate._id,
          existingName: candidate.candidateName,
          existingRemarks: detailedRemarks,  // Replace ID with names
          newEntry: row
        });
      } else {
        // Create new candidate
        candidate = new Candidate({
          recruiterId: row['recruiterId'] || "",
          email: email || "",
          candidateName: candidateName || "",
          phoneNumber: phoneNumber || "",
          nextCallback: row['nextCallback'] ? new Date(row['nextCallback']) : null,
          taskAssignedTo: row['taskAssignedTo'] || null,
          taskAssignedAt: row['taskAssignedAt'] ? new Date(row['taskAssignedAt']) : null,
          detailedRemarks: row['detailedRemarks[0].remark'] ? [{
            remark: row['detailedRemarks[0].remark'],
            addedby: row['detailedRemarks[0].addedby'],
            date: row['detailedRemarks[0].date'] ? new Date(row['detailedRemarks[0].date']) : Date.now(),
          }] : [],
        });

        operations.push(candidate.save());
        newCandidates.push(candidate);
      }
    }

    await Promise.all(operations);

    // Save the upload log to the database
    const uploadId = new mongoose.Types.ObjectId(); // Generate a unique upload ID
    const uploadLog = new UploadLog({
      uploadId: uploadId.toString(),
      newCandidates: newCandidates.map(candidate => candidate._id), // Store only IDs
      duplicates: duplicates // Include the duplicates with existing details
    });

    await uploadLog.save();

    console.log("Excel data successfully processed");
    res.status(200).send({
      message: 'Candidates successfully uploaded!',
      uploadId: uploadId.toString(), // Return the upload ID to the frontend
      newCandidates: newCandidates, // Include the new candidates details
      duplicates: duplicates // Include the detailed duplicates
    });

  } catch (error) {
    console.error('Error uploading candidates:', error);
    res.status(500).send({ message: 'Error occurred during candidate upload.' });
  }
};


module.exports = {
  createCandidate,
  getCandidate,
  updateCandidate,
  getCandidateList,
  deleteCandidate,
  getMyCandidateList,
  addRemarksCandidate,
  uploadCandidates,
};
