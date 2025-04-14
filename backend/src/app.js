import express from 'express';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import db from './config/dbConfig.js';
import dotenv from 'dotenv';
import cors from 'cors';
import methodRoutes from './routes/methodRoutes.js';
import displaymethodRoutes from './routes/displaymethodRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route configurations
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/helpdesk', helpdeskRoutes);

// Use displaymethodRoutes for displaying methods
app.use('/api/display', displaymethodRoutes);
app.use('/api/methods', methodRoutes);
app.use('/api', displayRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;