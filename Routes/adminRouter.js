const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, forgotPasswordAdmin, resetPasswordAdmin } = require('../controller/adminController');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/forgot-password', forgotPasswordAdmin);
router.post('/reset-password', resetPasswordAdmin);

module.exports = router; 