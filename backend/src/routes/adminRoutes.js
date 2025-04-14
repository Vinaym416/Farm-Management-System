// filepath: c:\Users\user\OneDrive\Desktop\New folder (3)\backend\routes\adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig'); // Import your database configuration

// Route to fetch all admins
router.get('/admins', async (req, res) => {
  try {
    const query = 'SELECT id, name FROM admins'; // Replace 'admins' with your table name
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching admins:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results); // Send the list of admins as JSON
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;