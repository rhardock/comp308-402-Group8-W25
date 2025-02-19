const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const Summary = require('../models/Summary');

const router = express.Router();
const FLASK_API_URL = 'http://127.0.0.1:3003/summarize';


// Configure Multer (File Upload Middleware)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Upload Route
router.post('/upload', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    try {
        // Read the uploaded PDF file and parse
        const dataBuffer = fs.readFileSync(`uploads/${req.file.filename}`);
        const pdfData = await pdfParse(dataBuffer);

        // Send extracted text to the Flask API for summarization
        const response = await axios.post(FLASK_API_URL, { text: pdfData.text });

        // Create new summary document
        const summary = new Summary({
            originalFileName: req.file.originalname,
            storedFilePath: `/uploads/${req.file.filename}`,
            extractedText: pdfData.text,
            summary: response.data.summary,
        
        });
// Save to MongoDB
await summary.save();

        // ✅ Send only ONE response after everything is processed
        res.json({
            success: true,
            filePath: `/uploads/${req.file.filename}`,
            extractedText: pdfData.text,
            summary: response.data.summary,
            summaryId: summary._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// Get all summaries from MongoDB
router.get('/summaries', async (req, res) => {
    try {
        const summaries = await Summary.find().sort({ createdAt: -1 }); // Sort by latest
        res.json({ success: true, summaries });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
