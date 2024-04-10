const catchAsync = require("../utils/catchAsync");
const { User } = require("../models");
const Candidate = require("../models/candidate.model");
const mongoose = require("mongoose");

// --------------- Get User Profile Detail ------------------
const getProfile = catchAsync(async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetail = await User.findById(userId);
    return res.status(200).json({
      status: "200",
      message: "User data fetched successfully!",
      data: userDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetcihng user data !",
      error: error.message,
    });
  }
});

// -------------------- Update User Profile ------------------
const updateProfile = catchAsync(async (req, res) => {
  try {
    const userId = req.params.id;

    const fg = req.body;
    console.log(fg, "fg");
    const userDetail = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
    });
    return res.status(200).json({
      status: "200",
      message: "User data updated successfully!",
      data: userDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while updating user data!",
      error: error.message,
    });
  }
});

// ------------------------ Delete User Profile ------------------
const deleteProfile = catchAsync(async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findOneAndDelete({ _id: userId });
    return res.status(200).json({
      status: "200",
      message: "User deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while deleting user data !",
      error: error.message,
    });
  }
});

const usersList = catchAsync(async (req, res) => {
  try {
    const roles = req.query.role;

    let query = {};
    if (roles && roles !== "all") {
      if (roles == "top") {
        query = { role: { $nin: "recruiter" } };
      } else {
        query = { role: roles };
      }
    }
    const userDetail = await User.find(query);
    return res.status(200).json({
      status: "200",
      message: `Admin List fetched successfully.`,
      data: userDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching Admin list !",
      error: error.message,
    });
  }
});

// const taskList = catchAsync(async (req, res) => {
//   try {
//     const userId = req.user;
//     const userDetail = await Candidate.aggregate([
//       { $match: { taskAssignedTo: mongoose.Types.ObjectId(userId) } },
//       {
//         $project: {
//           recruiterId: 1,
//           qualification: 1,
//           candidateName: 1,
//           phoneNumber: 1,
//           remark: 1,
//           detailedRemarks: 1
//         }
//       }
//     ]);
//     return res.status(200).json({
//       status: "200",
//       message: `All upcoming tasks fetched successfully.`,
//       data: userDetail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "500",
//       message: "An error occurred while fetching aucomming tasks !",
//       error: error.message,
//     });
//   }
// });

// const taskList = catchAsync(async (req, res) => {
//   try {
//     const userId = req.user;
//     const userDetail = await Candidate.aggregate([
//       {
//         $match: { taskAssignedTo: mongoose.Types.ObjectId(userId) },
//       },
//       {
//         $lookup: {
//           from: "users", // Assuming the name of the User model is 'User' and the collection name is 'users'
//           localField: "detailedRemarks.addedby",
//           foreignField: "_id",
//           as: "addedBy",
//         },
//       },
//       {
//         $addFields: {
//           detailedRemarks: {
//             $map: {
//               input: "$detailedRemarks",
//               as: "detail",
//               in: {
//                 $mergeObjects: [
//                   "$$detail",
//                   {
//                     addedBy: {
//                       $arrayElemAt: [
//                         {
//                           $filter: {
//                             input: "$addedBy",
//                             cond: { $eq: ["$$this._id", "$$detail.addedby"] },
//                           },
//                         },
//                         0,
//                       ],
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           recruiterId: 1,
//           qualification: 1,
//           candidateName: 1,
//           phoneNumber: 1,
//           detailedRemarks: 1,
//         },
//       },
//     ]);
//     return res.status(200).json({
//       status: "200",
//       message: `All upcoming tasks fetched successfully.`,
//       data: userDetail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "500",
//       message: "An error occurred while fetching upcoming tasks!",
//       error: error.message,
//     });
//   }
// });

const taskList = catchAsync(async (req, res) => {
  try {
    const userId = req.user;
    const userDetail = await Candidate.aggregate([
      {
        $match: { taskAssignedTo: mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users", // Assuming the name of the User model is 'User' and the collection name is 'users'
          localField: "detailedRemarks.addedby",
          foreignField: "_id",
          as: "addedBy",
        },
      },
      {
        $addFields: {
          detailedRemarks: {
            $map: {
              input: "$detailedRemarks",
              as: "detail",
              in: {
                $mergeObjects: [
                  "$$detail",
                  {
                    addedBy: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$addedBy",
                            cond: { $eq: ["$$this._id", "$$detail.addedby"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          recruiterId: 1,
          qualification: 1,
          candidateName: 1,
          phoneNumber: 1,
          "detailedRemarks.remark": 1,
          "detailedRemarks.date": 1,
          "detailedRemarks.addedBy.first_name": 1,
          "detailedRemarks.addedBy.last_name": 1,
        },
      },
    ]);
    return res.status(200).json({
      status: "200",
      message: `All upcoming tasks fetched successfully.`,
      data: userDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching upcoming tasks!",
      error: error.message,
    });
  }
});
const myTaskList = catchAsync(async (req, res) => {
  try {
    const userId = req.user;
    const userDetail = await Candidate.aggregate([
      {
        $match: { recruiterId: mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users", // Assuming the name of the User model is 'User' and the collection name is 'users'
          localField: "detailedRemarks.addedby",
          foreignField: "_id",
          as: "addedBy",
        },
      },
      {
        $addFields: {
          detailedRemarks: {
            $map: {
              input: "$detailedRemarks",
              as: "detail",
              in: {
                $mergeObjects: [
                  "$$detail",
                  {
                    addedBy: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$addedBy",
                            cond: { $eq: ["$$this._id", "$$detail.addedby"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          recruiterId: 1,
          qualification: 1,
          candidateName: 1,
          phoneNumber: 1,
          "detailedRemarks.remark": 1,
          "detailedRemarks.date": 1,
          "detailedRemarks.addedBy.first_name": 1,
          "detailedRemarks.addedBy.last_name": 1,
        },
      },
    ]);
    return res.status(200).json({
      status: "200",
      message: `All upcoming tasks fetched successfully.`,
      data: userDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching upcoming tasks!",
      error: error.message,
    });
  }
});

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  usersList,
  taskList,
  myTaskList,
};
