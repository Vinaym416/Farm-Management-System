const db = require('./database');

const setupDatabase = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS community (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users1(id)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS community_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT,
        user_id INT,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES community(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users1(id)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS community_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES community(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users1(id)
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

module.exports = setupDatabase;