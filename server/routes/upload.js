//const FLASK_API_URL = 'http://127.0.0.1:3003/summarize';
//const pdfParse = require('pdf-parse');
//const axios = require('axios');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authenticateToken = require('../middleware/auth');

const Summary = require('../models/Summary');

const router = express.Router();

// Configure Multer (File Upload Middleware)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Upload --modified to just save the file and return path

router.post('/upload', authenticateToken, upload.single('pdf'), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }  

  try {
    // COMMENTING OUT all the PDF parsing and Flask API code:
    /* 
    // Read the uploaded PDF file and parse
    const dataBuffer = fs.readFileSync(`uploads/${req.file.filename}`);
    const pdfData = await pdfParse(dataBuffer);

    // Send extracted text to the Flask API for summarization
    const response = await axios.post(FLASK_API_URL, { text: pdfData.text });
    */
    // Create new summary document

    const summary = new Summary({
      originalFileName: req.file.originalname,
      storedFilePath: `/uploads/${req.file.filename}`,
      extractedText: "",
      summary: "",
      userId: req.user._id
    });

    // Save to MongoDB
    await summary.save();

    //  Send only ONE response after everything is processed
    res.json({
      success: true,
      filePath: `/uploads/${req.file.filename}`,
      
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: error.message });
    summaryId: summary._id
  }
});

// Get all summaries from MongoDB
router.get('/summaries', authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  try {
    const summaries = await Summary.find({ userId: req.user._id }
                                        ).sort({ createdAt: -1 }); // Sort by latest
    res.json({ success: true, summaries });
  } catch (error) {
    console.log('Error fetching summaries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
