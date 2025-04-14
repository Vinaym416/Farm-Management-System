import db from '../config/dbConfig.js';

export const findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};