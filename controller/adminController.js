const Admin = require('../model/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendAdminPasswordResetEmail } = require('../services/emailService');

exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required.' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this username or email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword
    });

    const savedAdmin = await newAdmin.save();
    
    // Remove password from response
    const adminResponse = {
      id: savedAdmin._id,
      username: savedAdmin.username,
      email: savedAdmin.email
    };

    res.status(201).json({ 
      message: 'Admin registered successfully',
      admin: adminResponse 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Username does not exist' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }
    const token = jwt.sign({ id: admin._id, username: admin.username }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot password for admin
exports.forgotPasswordAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to admin
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = resetTokenExpiry;
    await admin.save();

            // Send email
        const emailSent = await sendAdminPasswordResetEmail(email, resetToken);
    
    if (emailSent) {
      res.status(200).json({ 
        message: "Password reset link sent to your email",
        email: email 
      });
    } else {
      // If email failed, remove the reset token
      admin.resetToken = null;
      admin.resetTokenExpiry = null;
      await admin.save();
      
      res.status(500).json({ message: "Failed to send email. Please try again." });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password for admin
exports.resetPasswordAdmin = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    // Find admin with valid reset token
    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    admin.password = hashedPassword;
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    await admin.save();

    res.status(200).json({ message: "Password reset successfully" });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}; 