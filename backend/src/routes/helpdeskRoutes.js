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

// Update the messages GET route to include complete reply information
router.get('/messages', (req, res) => {
  const query = `
    SELECT 
      m.message_id,
      m.sender_name,
      m.admin_name,
      m.message_text,
      m.created_at,
      m.reply_to_id,
      r.message_text as replied_to_text,
      r.sender_name as replied_to_sender
    FROM messages m
    LEFT JOIN messages r ON m.reply_to_id = r.message_id
    ORDER BY m.created_at ASC`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    res.json(results);
  });
});

// Update the post message route with logging:
router.post('/messages', (req, res) => {
  const { senderName, adminName, messageText, replyToId } = req.body;
  
  console.log('Received message data:', {
    senderName,
    adminName,
    messageText,
    replyToId
  });

  const query = 'INSERT INTO messages (sender_name, admin_name, message_text, reply_to_id) VALUES (?, ?, ?, ?)';
  
  db.query(query, [senderName, adminName, messageText, replyToId || null], (err, results) => {
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

// Update the delete message endpoint
router.delete('/messages/:messageId', (req, res) => {
  const { messageId } = req.params;
  
  // First check if the message exists
  const checkQuery = 'SELECT * FROM messages WHERE message_id = ?';
  
  db.query(checkQuery, [messageId], (err, results) => {
    if (err) {
      console.error('Error checking message:', err);
      return res.status(500).json({ error: 'Failed to check message' });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        error: 'Message not found' 
      });
    }

    // If message exists, delete it
    const deleteQuery = 'DELETE FROM messages WHERE message_id = ?';
    db.query(deleteQuery, [messageId], (err) => {
      if (err) {
        console.error('Error deleting message:', err);
        return res.status(500).json({ error: 'Failed to delete message' });
      }

      res.json({ 
        success: true, 
        message: 'Message deleted successfully' 
      });
    });
  });
});

export default router;
