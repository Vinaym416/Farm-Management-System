import express from 'express';
import db from '../config/dbConfig.js';

const router = express.Router();

router.get('/names', (req, res) => {
  // Modified query to fetch from users1 table where role is admin
  const query = 'SELECT id, firstName, lastName FROM users1 WHERE role = "admin" ORDER BY firstName';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching admin names:', err);
      return res.status(500).json({ error: 'Failed to fetch admin names' });
    }
    
    // Format the results to include full name
    const formattedResults = results.map(admin => ({
      id: admin.id,
      name: `${admin.firstName} ${admin.lastName}`
    }));
    
    res.json(formattedResults);
  });
});

// Get messages for a specific admin
router.get('/messages/:adminName', (req, res) => {
  const { adminName } = req.params;
  
  console.log('Fetching messages for admin:', adminName);

  // Modified query to get all message details
  const query = `
    SELECT 
      message_id,
      sender_name,
      admin_name,
      message_text,
      created_at
    FROM messages 
    WHERE admin_name = ?
    ORDER BY created_at ASC`;
  
  db.query(query, [adminName], (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    
    console.log('Messages found for admin:', results.length);
    res.json(results);
  });
});

// Store new message
router.post('/messages', (req, res) => {
  const { senderName, adminName, messageText } = req.body;

  const query = 'INSERT INTO messages (sender_name, admin_name, message_text) VALUES (?, ?, ?)';
  
  db.query(query, [senderName, adminName, messageText], (err, results) => {
    if (err) {
      console.error('Error storing message:', err);
      return res.status(500).json({ error: 'Failed to store message' });
    }
    
    res.status(201).json({
      success: true,
      message: 'Message stored successfully',
      messageId: results.insertId
    });
  });
});

// Add this new endpoint to check all messages
router.get('/debug/all-messages', (req, res) => {
  const query = 'SELECT * FROM messages ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all messages:', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    
    console.log('Total messages found:', results.length);
    res.json(results);
  });
});

// Get all messages for helpdesk admin view
router.get('/admin/messages', (req, res) => {
  const query = `
    SELECT 
      m.message_id,
      m.sender_name,
      m.admin_name,
      m.message_text,
      m.created_at,
      CONCAT(u.firstName, ' ', u.lastName) as admin_full_name
    FROM messages m
    LEFT JOIN users1 u ON m.admin_name = CONCAT(u.firstName, ' ', u.lastName)
    ORDER BY m.created_at DESC`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching admin messages:', err);
      return res.status(500).json({ error: 'Failed to fetch admin messages' });
    }
    
    console.log('Total admin messages found:', results.length);
    res.json({
      success: true,
      messages: results
    });
  });
});

export default router;
