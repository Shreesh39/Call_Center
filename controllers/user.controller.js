const catchAsync = require("../utils/catchAsync");
const { User } = require("../models");

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
    console.log(userId, "userId in update profiel");
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
      message: "An error occurred while updating user data !",
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
      query = { role: roles };
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

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  usersList,
};
