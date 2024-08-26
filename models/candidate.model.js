const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const candidateSchema = mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,  // Ensure email is unique
      trim: true,
      lowercase: true,  // Normalize email to lowercase
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],  // Basic email validation
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,  // Ensure phone number is unique
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],  // Basic phone number validation
    },
    detailedRemarks: [
      {
        remark: {
          type: String,
          required: true,
          trim: true,
        },
        addedby: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    nextCallback: {
      type: Date,
    },
    taskAssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    taskAssignedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt timestamps
  }
);

candidateSchema.plugin(toJSON);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
