import express from 'express';
import db from '../config/dbConfig.js';

const router = express.Router();

// Get all medicines
router.get('/display/medicines', (req, res) => {
    const query = `
        SELECT 
            medicineid,
            name,
            plantname,
            description
        FROM mediance
        ORDER BY medicineid
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching medicines:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to fetch medicines' 
            });
        }
        
        res.json({
            success: true,
            medicines: results
        });
    });
});

// Get medicine details by name
router.post('/display/medicine-details', (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({
            success: false,
            error: 'Medicine name is required'
        });
    }

    const query = `
        SELECT 
            medicineid,
            name,
            plantname,
            description
        FROM mediance
        WHERE LOWER(name) = LOWER(?)
    `;
    
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('Error fetching medicine:', err);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch medicine details'
            });
        }
        
        if (results.length > 0) {
            res.json({
                success: true,
                medicine: results[0]
            });
        } else {
            res.json({
                success: false,
                error: 'Medicine not found'
            });
        }
    });
});

export default router;