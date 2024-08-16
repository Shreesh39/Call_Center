const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const candidateSchema = mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
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
    resume: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,  // Ensure phone number is unique
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],  // Basic phone number validation
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    computerSkills: {
      type: String,
      enum: [
        "Introduction level",
        "Basic level",
        "Intermediate level",
        "Can work easily",
      ],
      default: "Introduction level",
    },
    englishSkills: {
      type: String,
      enum: [
        "Introduction level",
        "Basic level",
        "Intermediate level",
        "Can work easily",
      ],
      default: "Introduction level",
    },
    otherSkills: {
      type: String,
      required: true,
      trim: true,
    },
    remark: {
      type: String,
      enum: ["Selected", "Rejected", "Under Process"],
      default: "Under Process",
    },
    category: {
      type: String,
      enum: [
        "Software Development",
        "Sales",
        "Calling International",
        "Calling Domestic",
        "Housekeeping",
        "Day Clerical",
        "Marketing",
        "Internet Marketing",
        "Graphic Design",
        "Other",
      ],
      required: true,
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
