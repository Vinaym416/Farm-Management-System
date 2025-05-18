const db = require('../config/dbConfig.js')

 const helpdeskDbService = {
  async query(sql, params) {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  },

  async getAdmins() {
    try {
      const query = `
        SELECT id, firstName, lastName, role 
        FROM users1 
        WHERE role = 'admin'
      `;
      console.log('Executing admin query:', query);
      const admins = await this.query(query);
      console.log('Raw admin results:', admins);
      
      if (!admins || admins.length === 0) {
        console.log('No admins found in database');
        return [];
      }
      
      const mappedAdmins = admins.map(admin => ({
        _id: admin.id,
        name: `${admin.firstName} ${admin.lastName}`.trim()
      }));
      console.log('Mapped admin results:', mappedAdmins);
      return mappedAdmins;
      
    } catch (error) {
      console.error('Error in getAdmins:', error);
      throw error;
    }
  },

  async getMessages(adminName = null) {
    return new Promise((resolve, reject) => {
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
        ${adminName ? 'WHERE m.admin_name = ?' : ''}
        ORDER BY m.created_at ASC`;
      
      const params = adminName ? [adminName] : [];
      
      db.query(query, params, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  },

  async addMessage(messageData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO messages 
        (sender_name, admin_name, message_text, reply_to_id) 
        VALUES (?, ?, ?, ?)`;
      
      const params = [
        messageData.senderName,
        messageData.adminName,
        messageData.messageText,
        messageData.replyToId || null
      ];

      db.query(query, params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          messageId: result.insertId,
          ...messageData,
          created_at: new Date()
        });
      });
    });
  },

  async deleteMessage(messageId) {
    try {
      const query = 'DELETE FROM messages WHERE id = ?';
      const result = await this.query(query, [messageId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};
module.exports = helpdeskDbService;