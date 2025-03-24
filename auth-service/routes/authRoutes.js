const express = require('express');
const router = express.Router();
const { register, login, verify } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Route for verifying tokens from other services
router.post('/verify', verify);

module.exports = router;
