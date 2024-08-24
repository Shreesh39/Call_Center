const express = require('express');
const router = express.Router();
const UploadLog = require('../models/uploadLog'); 

// Endpoint to fetch upload log details by uploadId
router.get('/upload-log/:uploadId', async (req, res) => {
  const { uploadId } = req.params;

  try {
    const uploadLog = await UploadLog.findOne({ uploadId });

    if (!uploadLog) {
      return res.status(404).send({ message: 'Upload log not found' });
    }

    res.status(200).send(uploadLog);
  } catch (error) {
    console.error('Error fetching upload log:', error);
    res.status(500).send({ message: 'Error occurred while fetching upload log' });
  }
});

module.exports = router;
