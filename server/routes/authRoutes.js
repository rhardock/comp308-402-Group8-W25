//commented out old authentication logic just in case, delete if unnecessary

/*
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

module.exports = router; 
*/