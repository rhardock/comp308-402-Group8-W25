const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const router = express.Router();

// Configure Multer (File Upload Middleware)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Upload Route
router.post('/upload', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    res.json({ success: true, message: 'File uploaded successfully!', filePath: `/uploads/${req.file.filename}` });

    try{
        const dataBuffer = fs.readFileSync(`uploads/${req.file.filename}`);
        const pdfData = await pdfParse(dataBuffer);
        const response = await axios.post(FLASK_API_URL, { text: pdfData.text });

        return res.json({
            success: true,
            filePath: `/uploads/${req.file.filename}`,
            summary: response.data.summary
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
