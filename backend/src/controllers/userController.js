import { findUserByEmail } from '../models/userModel.js';

export const getUserProfile = (req, res) => {
  const userId = req.params.id; // Assuming user ID is passed as a URL parameter

  findUserById(userId, (err, user) => {
    if (err) return res.status(500).json({ message: 'Error retrieving user' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  });
};

export const updateUserProfile = (req, res) => {
  const userId = req.params.id; // Assuming user ID is passed as a URL parameter
  const updatedData = req.body;

  updateUserById(userId, updatedData, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating user' });
    res.json({ message: 'User updated successfully' });
  });
};