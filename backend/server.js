const express = require('express');
const db = require('./src/config/dbConfig.js');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const plantRoutes = require('./src/routes/plantRoutes.js');
const helpdeskRoutes = require('./src/routes/helpdeskRoutes.js');
const methodRoutes = require('./src/routes/methodRoutes.js');
const displaymethodRoutes = require('./src/routes/displaymethodRoutes.js');
const medianceRoutes = require('./src/routes/medianceRoutes.js');
const displayRoutes = require('./src/routes/displayRoutes.js');
const authRoutes = require('./src/routes/authRoutes.js');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"]
  }
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(" New user connected");

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
    console.log(" User disconnected");
  });
});

app.use(cors({ 
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false,
  allowedHeaders: ['Content-Type', 'Accept']
})); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', plantRoutes); // Change this line from app.use(plantRoutes)
app.use('/api/helpdesk', helpdeskRoutes);
app.use('/api', methodRoutes);
app.use('/api/display', displaymethodRoutes);
app.use('/api', medianceRoutes);
app.use('/api', displayRoutes);
app.use('/api/auth', authRoutes);

app.use('/uploads', express.static('uploads'));

app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Database query failed');
      return;
    }
    res.send(`Database connected successfully. Query result: ${results[0].solution}`);
  });
});

app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
    res.json({ message: 'Database connected successfully' });
  });
});

app.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  const query = 'SELECT * FROM users1 WHERE email = ? AND password = ? AND role = ?';
  db.query(query, [email, password, role], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Database query failed');
      return;
    }
    if (results.length > 0) {
      res.send('User logged in and data stored successfully');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

app.post('/signup', (req, res) => {
  const { firstName, lastName, farmName, email, password, address1, address2, suburb, townCity, postCode, phoneNumber, designation, id, role } = req.body;

  const query = 'INSERT INTO users1 (firstName, lastName, farmName, email, password, address1, address2, suburb, townCity, postCode, phoneNumber, designation, id, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [firstName, lastName, farmName, email, password, address1, address2, suburb, townCity, postCode, phoneNumber, designation, id, role], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Database query failed');
      return;
    }
    res.send('User signed up and data stored successfully');
  });
});

// Add this after your other routes, before app.listen()

app.post('/api/add_plant', (req, res) => {
  const { plant_id, name, description, soil_type } = req.body;

  const query = 'INSERT INTO plants (plant_id, name, description, soil_type) VALUES (?, ?, ?, ?)';
  
  db.query(query, [plant_id, name, description, soil_type], (err, results) => {
    if (err) {
      console.error('Error adding plant:', err);
      res.status(500).json({ error: 'Failed to add plant', details: err.message });
      return;
    }
    
    res.status(201).json({
      success: true,
      message: 'Plant added successfully',
      plantId: results.insertId
    });
  });
});

// SQL query to create the users1 table
const createUsersTableQuery = `
CREATE TABLE users1 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  farmName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  address1 VARCHAR(255),
  address2 VARCHAR(255),
  suburb VARCHAR(255),
  townCity VARCHAR(255),
  postCode VARCHAR(255),
  phoneNumber VARCHAR(255),
  designation VARCHAR(255),
  id VARCHAR(255),
  role VARCHAR(255)
);
`;

// Execute the query to create the users1 table
db.query(createUsersTableQuery, (err, results) => {
  if (err) {
    console.error('Error creating users1 table:', err);
    return;
  }
  console.log('Users1 table created successfully');
});

// Add this after your existing users1 table creation
// Replace the plants table creation code with this:

const checkAndCreatePlantsTable = () => {
  // First check if table exists
  db.query("SHOW TABLES LIKE 'plants'", (err, results) => {
    if (err) {
      console.error('Error checking plants table:', err);
      return;
    }

    // If table doesn't exist, create it
    if (results.length === 0) {
      const createPlantsTableQuery = `
        CREATE TABLE plants (
          id INT AUTO_INCREMENT PRIMARY KEY,
          plant_id VARCHAR(50) NOT NULL,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          soil_type VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

      db.query(createPlantsTableQuery, (err, results) => {
        if (err) {
          console.error('Error creating plants table:', err);
          return;
        }
        console.log('Plants table created successfully');
      });
    } else {
      console.log('Plants table already exists');
    }
  });
};

// Call the function after database connection
checkAndCreatePlantsTable();

// Update the checkAndCreateMethodsTable function
const checkAndCreateMethodsTable = () => {
  db.query("SHOW TABLES LIKE 'methods'", (err, results) => {
    if (err) {
      console.error('Error checking methods table:', err);
      return;
    }

    if (results.length === 0) {
      const createMethodsTableQuery = `
        CREATE TABLE methods (
          id INT AUTO_INCREMENT PRIMARY KEY,
          plant_name VARCHAR(100) NOT NULL,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

      db.query(createMethodsTableQuery, (err, results) => {
        if (err) {
          console.error('Error creating methods table:', err);
          return;
        }
        console.log('Methods table created successfully');
      });
    } else {
      console.log('Methods table already exists');
    }
  });
};

// Call the function after database connection
checkAndCreateMethodsTable();

// Add this table creation code after your other table creation functions
const checkAndCreateMessagesTable = () => {
  db.query("SHOW TABLES LIKE 'messages'", (err, results) => {
    if (err) {
      console.error('Error checking messages table:', err);
      return;
    }

    if (results.length === 0) {
      const createMessagesTableQuery = `
        CREATE TABLE messages (
          message_id INT AUTO_INCREMENT PRIMARY KEY,
          sender_name VARCHAR(100) NOT NULL,
          admin_name VARCHAR(100) NOT NULL,
          message_text TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

      db.query(createMessagesTableQuery, (err, results) => {
        if (err) {
          console.error('Error creating messages table:', err);
          return;
        }
        console.log('Messages table created successfully');
      });
    }
  });
};

// Call the function
checkAndCreateMessagesTable();

// Replace the checkAndCreateMedianceTable function
const checkAndCreateMedianceTable = () => {
    db.query("SHOW TABLES LIKE 'mediance'", (err, results) => {
        if (err) {
            console.error('Error checking mediance table:', err);
            return;
        }

        if (results.length === 0) {
            const createMedianceTableQuery = `
                CREATE TABLE mediance (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    mediance_id VARCHAR(50) NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    plant_name VARCHAR(100) NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`;

            db.query(createMedianceTableQuery, (err, results) => {
                if (err) {
                    console.error('Error creating mediance table:', err);
                    return;
                }
                console.log('Mediance table created successfully');
            });
        } else {
            console.log('Mediance table already exists');
        }
    });
};

// Call the function after database connection is established
checkAndCreateMedianceTable();