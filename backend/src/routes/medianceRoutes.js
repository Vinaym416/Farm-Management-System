import express from 'express';
import db from '../config/dbConfig.js';

const router = express.Router();

// Route to add new mediance
router.post('/add_mediance', (req, res) => {
  const { medianceId, name, plantName, description } = req.body;

  // Input validation
  if (!medianceId || !name || !description || !plantName) {
    return res.status(400).json({
      error: 'All fields are required'
    });
  }

  const query = `
    INSERT INTO mediance (mediance_id, name, plant_name, description) 
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [medianceId, name, plantName, description], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Failed to add mediance',
        details: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Mediance added successfully',
      id: result.insertId
    });
  });
});

// Route to get all mediance
router.get('/get_mediance', async (req, res) => {
  const query = 'SELECT * FROM mediance';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching mediance:', err);
      res.status(500).json({ error: 'Failed to fetch mediance' });
      return;
    }
    
    res.status(200).json(results);
  });
});

export default router;