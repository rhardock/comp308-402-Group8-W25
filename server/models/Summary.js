const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  originalFileName: {
    type: String,
    required: true
  },
  storedFilePath: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
/**  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },*/
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Summary', summarySchema);
