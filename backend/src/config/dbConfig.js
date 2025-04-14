import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');

  const createMedianceTable = `
    CREATE TABLE IF NOT EXISTS mediance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mediance_id VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      plant_name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createMedianceTable, (err) => {
    if (err) {
      console.error('Error creating mediance table:', err);
      return;
    }
    console.log('Mediance table created/verified successfully');
  });
});

export default db;