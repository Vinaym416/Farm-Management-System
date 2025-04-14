import { findUserByEmail } from '../models/userModel.js';

export const login = (req, res) => {
  const { email, password } = req.body;
  findUserByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: 'Error retrieving user' });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Redirect to appropriate dashboard based on user role
    res.json({ message: 'Login successful', role: user.role });
  });
};