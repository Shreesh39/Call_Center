const catchAsync = require("../utils/catchAsync");
const { Candidate } = require("../models");

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

module.exports = {
  createCandidate,
  getCandidate,
  updateCandidate,
  getCandidateList,
  deleteCandidate,
};
