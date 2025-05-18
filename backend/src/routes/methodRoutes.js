const express = require('express');
const db = require('../config/dbConfig.js')

const router = express.Router();

// Update the methods table creation to include plant_name
const createMethodsTableQuery = `
CREATE TABLE IF NOT EXISTS methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    plant_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// Execute table creation
db.query(createMethodsTableQuery, (err) => {
    if (err) console.error('Error creating methods table:', err);
});




// Get methods by plant name
router.get('/:plantName', (req, res) => {
    const { plantName } = req.params;
    const query = 'SELECT name, plant_name, description FROM methods WHERE plant_name = ?';
    
    db.query(query, [plantName], (err, results) => {
        if (err) {
            console.error('Error fetching methods:', err);
            return res.status(500).json({ error: 'Failed to fetch methods' });
        }
        res.json(results);
    });
});

// Add new method
router.post('/add_method', (req, res) => {  // Remove /api prefix
  const { name, plant_name, description } = req.body;

  const query = 'INSERT INTO methods (name, plant_name, description) VALUES (?, ?, ?)';
  
  db.query(query, [name, plant_name, description], (err, results) => {
    if (err) {
      console.error('Error adding method:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to add method',
        error: err.message 
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Method added successfully',
      methodId: results.insertId
    });
  });
});

module.exports = router;