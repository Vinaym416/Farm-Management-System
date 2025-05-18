const express = require('express');
const db = require('../config/dbConfig.js')

const router = express.Router();

router.post('/api/add_plant', async (req, res) => {
    try {
        const { plant_id, name, description, soil_type } = req.body;
        
        // Log the received data
        console.log('Received plant data:', req.body);

        const query = 'INSERT INTO plants (plant_id, name, description, soil_type) VALUES (?, ?, ?, ?)';
        
        db.query(query, [plant_id, name, description, soil_type], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error adding plant to database',
                    error: err.message 
                });
            }
            
            console.log('Plant added successfully:', results);
            res.status(201).json({
                success: true,
                message: 'Plant added successfully',
                plantId: results.insertId
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
});

router.post('/get_plant_details', async (req, res) => {
    try {
        const { plant_name } = req.body;
        
        if (!plant_name) {
            return res.status(400).json({ error: 'Plant name is required' });
        }

        const query = 'SELECT description FROM mediance WHERE plant_name = ?';
        
        db.query(query, [plant_name], (err, results) => {
            if (err) {
                console.error('Error fetching plant details:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }
            
            if (results.length > 0) {
                res.json({ "Plant Details": results[0].description });
            } else {
                res.json({ "Plant Details": "No details found for this plant." });
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;