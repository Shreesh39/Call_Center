const mongoose = require('mongoose');

const uploadLogSchema = new mongoose.Schema({
  uploadId: { type: String, required: true, unique: true },
  newCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  duplicates: [
    {
      existingCandidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
      newEntry: { type: Object }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const UploadLog = mongoose.model('UploadLog', uploadLogSchema);

module.exports = UploadLog;
