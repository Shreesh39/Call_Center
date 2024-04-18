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
      trim: true,
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    resume: {
      type: String,
      // required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
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
    timestamps: true,
  }
);

candidateSchema.plugin(toJSON);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
