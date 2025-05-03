import pool from '../../lib/db';
import bcrypt from 'bcryptjs';

// Create admin table if it doesn't exist
export async function createAdminTable() {
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
    const [rows]: any = await connection.query('SELECT * FROM admin WHERE email = ?', ['admin@nisapoti.com']);
    
    if (rows.length === 0) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'changeme', 10);
      
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

// Verify admin credentials
export async function verifyAdmin(email: string, password: string) {
  const connection = await pool.getConnection();
  try {
    const [rows]: any = await connection.query(
      'SELECT * FROM admin WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return false;
    }

    const admin = rows[0];
    const isValid = await bcrypt.compare(password, admin.password);
    return isValid;
  } finally {
    connection.release();
  }
}
