const mongoose = require('mongoose');

const uploadLogSchema = new mongoose.Schema({
  uploadId: { type: String, required: true, unique: true },
  newCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  duplicates: [
    {
      existingCandidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
      existingName: { type: String }, // Ensure this field is defined
      existingRemarks: [
        {
          remark: { type: String },
          addedby: { type: String }, // This should be a String if it's being stored as a name
          date: { type: Date }
        }
      ],
      newEntry: { type: Object } // Ensure this field is defined correctly
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const UploadLog = mongoose.model('UploadLog', uploadLogSchema);

module.exports = UploadLog;
