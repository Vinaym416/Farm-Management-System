import db from '../config/dbConfig.js';

export const addPlant = (req, res) => {
  const { plant_id, name, description, soil_type } = req.body;

  const query = 'INSERT INTO plants (plant_id, name, description, soil_type) VALUES (?, ?, ?, ?)';
  
  db.query(query, [plant_id, name, description, soil_type], (err, results) => {
    if (err) {
      console.error('Error adding plant:', err);
      return res.status(500).json({ error: 'Failed to add plant' });
    }
    res.status(201).json({ 
      success: true, 
      message: 'Plant added successfully', 
      id: results.insertId 
    });
  });
};