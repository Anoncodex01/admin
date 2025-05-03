const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const cors = require('cors');

// Apply CORS to all routes in this router
router.use(cors({
  origin: ['https://nisapoti.co.tz', 'http://nisapoti.co.tz', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Create admin table if it doesn't exist
async function createAdminTable() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Check if admin exists
    const [rows] = await connection.query('SELECT * FROM admin WHERE email = ?', ['admin@nisapoti.com']);
    
    if (rows.length === 0) {
      // Hash the password
      const hashedPassword = await bcrypt.hash('Nisapoti@#202516', 10);
      
      // Insert default admin
      await connection.query(
        'INSERT INTO admin (email, password) VALUES (?, ?)',
        ['admin@nisapoti.com', hashedPassword]
      );
    }
  } finally {
    connection.release();
  }
}

// Initialize admin table
createAdminTable().catch(console.error);

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM admin WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const admin = rows[0];
      const isValid = await bcrypt.compare(password, admin.password);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
