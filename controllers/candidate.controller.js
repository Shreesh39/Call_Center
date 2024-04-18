const catchAsync = require("../utils/catchAsync");
const { Candidate } = require("../models");
const mongoose = require("mongoose");
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
      message: "Candidate list fetched successfully!",
      data: candidateList,
      page,
      totalPages: Math.ceil(totalCount / perPage),
      count: candidateList.length,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching candidate list!",
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

  let query = { recruiterId: mongoose.Types.ObjectId(currentUser) };
  if (recruiterName) {
    query = { recruiterId: recruiterName };
  }

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
      message: "Candidate list fetched successfully!",
      data: candidateList,
      page,
      totalPages: Math.ceil(totalCount / perPage),
      count: candidateList.length,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching candidate list!",
      error: error.message,
    });
  }
});

// -------------------- Add candidate Remarks  ------------------
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

module.exports = {
  createCandidate,
  getCandidate,
  updateCandidate,
  getCandidateList,
  deleteCandidate,
  getMyCandidateList,
  addRemarksCandidate,
};
