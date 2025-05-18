const express = require('express');
const db = require('../config/dbConfig.js')
const bcrypt = require('bcrypt');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user in MySQL database
    const findUserQuery = 'SELECT * FROM users1 WHERE email = ? AND role = ?';
    db.query(findUserQuery, [email, role], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = results[0];

      // Check if password is already hashed
      const isHashed = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
      
      let isMatch;
      if (isHashed) {
        // Compare hashed passwords
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        // If password is not hashed in DB, compare directly (temporary fix)
        isMatch = password === user.password;
        
        // Optionally hash the password for future comparisons
        if (isMatch) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const updateQuery = 'UPDATE users1 SET password = ? WHERE email = ? AND role = ?';
          db.query(updateQuery, [hashedPassword, email, role]);
        }
      }

      if (!isMatch) {
        console.log('Password comparison failed');
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Return user data and token
      res.json({
        success: true,
        message: 'Login successful',
        token: 'generated-token-here', // You should implement proper JWT token generation
        user: {
          id: user.id,
          email: user.email,
          role: user.role
          // Add other user fields as needed
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { email, phone, newPassword, role } = req.body;

    if (!email || !phone || !newPassword || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find user in MySQL database
    const findUserQuery = 'SELECT * FROM users1 WHERE email = ? AND phoneNumber = ? AND role = ?';
    db.query(findUserQuery, [email, phone, role], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found with provided email and phone number'
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in MySQL database
      const updatePasswordQuery = 'UPDATE users1 SET password = ? WHERE email = ? AND phoneNumber = ? AND role = ?';
      db.query(updatePasswordQuery, [hashedPassword, email, phone, role], (updateErr) => {
        if (updateErr) {
          console.error('Password update error:', updateErr);
          return res.status(500).json({
            success: false,
            message: 'Error updating password'
          });
        }

        res.json({
          success: true,
          message: 'Password updated successfully'
        });
      });
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error resetting password'
    });
  }
});

module.exports = router;