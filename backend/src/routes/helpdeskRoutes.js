const express = require('express');
const db = require('../config/dbConfig.js')
const { Server } = require('socket.io');
const http = require('http');
const { helpdeskDbService } = require('../services/helpdeskDbService.js');

const router = express.Router();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Get admin names
router.get('/names', async (req, res) => {
  try {
    console.log('Fetching admin names...');
    const admins = await helpdeskDbService.getAdmins();
    console.log('Received admins from service:', admins);
    
    if (!admins || !admins.length) {
      console.log('No admins found, sending 404');
      return res.status(404).json({ 
        error: 'No admins found',
        message: 'No admin users exist in the database'
      });
    }
    
    console.log('Sending admins response:', admins);
    res.json(admins);
    
  } catch (err) {
    console.error('Detailed error in /names route:', err);
    res.status(500).json({ 
      error: 'Failed to fetch admin names',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Get chat messages between users
router.get('/messages/:users1/:user2', async (req, res) => {
  try {
    const { users1, user2 } = req.params;
    const query = `
      SELECT m.*, 
        u1.firstName as sender_firstName, 
        u1.lastName as sender_lastName,
        u2.firstName as receiver_firstName, 
        u2.lastName as receiver_lastName
      FROM messages m
      JOIN users1 u1 ON m.sender_id = u1.id
      JOIN users1 u2 ON m.receiver_id = u2.id
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
    `;

    const messages = await helpdeskDbService.query(query, [users1, user2, user2, users1]);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get admin list
router.get('/admins', async (req, res) => {
  try {
    const admins = await helpdeskDbService.getAdmins();
    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});


router.post('/messages', async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    const query = `
      INSERT INTO messages (sender_id, receiver_id, message)
      VALUES (?, ?, ?)
    `;
    
    await helpdeskDbService.query(query, [sender_id, receiver_id, message]);
    res.status(201).json({ success: true, message: 'Message stored successfully' });
  } catch (err) {
    console.error('Error storing message:', err);
    res.status(500).json({ error: 'Failed to store message' });
  }
});

io.on('connection', (socket) => {
  console.log("✅ New user connected");

  socket.on('sendMessage', async ({ sender_id, receiver_id, message }) => {
    try {
      const query = `
        INSERT INTO messages (sender_id, receiver_id, message)
        VALUES (?, ?, ?)
      `;
      
      await helpdeskDbService.query(query, [sender_id, receiver_id, message]);

      // Get sender and receiver details from users1 table
      const userQuery = `
        SELECT id, firstName, lastName, role 
        FROM users1 
        WHERE id IN (?, ?)
      `;
      
      const users = await helpdeskDbService.query(userQuery, [sender_id, receiver_id]);
      const sender = users.find(u => u.id === sender_id);
      const receiver = users.find(u => u.id === receiver_id);

      // Broadcast with user details
      io.emit('receiveMessage', {
        sender_id,
        receiver_id,
        message,
        timestamp: new Date(),
        sender_name: `${sender.firstName} ${sender.lastName}`,
        receiver_name: `${receiver.firstName} ${receiver.lastName}`,
        sender_role: sender.role,
        receiver_role: receiver.role
      });

    } catch (err) {
      console.error('Error handling socket message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log("❌ User disconnected");
  });
});

// Delete message
router.delete('/messages/:messageId', async (req, res) => {
  try {
    const deleted = await helpdeskDbService.deleteMessage(req.params.messageId);
    if (deleted) {
      res.json({ success: true, message: 'Message deleted successfully' });
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`🚀 Helpdesk backend running on http://localhost:${PORT}`);
// });

module.exports = router;
