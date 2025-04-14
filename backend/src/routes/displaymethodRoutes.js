import express from 'express';
import db from '../config/dbConfig.js';

const router = express.Router();

// Get all methods
router.get('/methods', (req, res) => {
  const query = 'SELECT * FROM methods';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching methods:', err);
      res.status(500).json({ error: 'Failed to fetch methods' });
      return;
    }
    res.json(results);
  });
});

// Get methods by plant name
router.get('/methods/:plantName', (req, res) => {
  const plantName = req.params.plantName;
  const query = 'SELECT * FROM methods WHERE plant_name LIKE ?';
  
  db.query(query, [`%${plantName}%`], (err, results) => {
    if (err) {
      console.error('Error fetching methods:', err);
      res.status(500).json({ error: 'Failed to fetch methods' });
      return;
    }
    res.json(results);
  });
});

export default router;