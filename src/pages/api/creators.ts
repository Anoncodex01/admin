import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [creators] = await connection.query(`
      SELECT 
        p.*,
        u.email,
        u.email_verified,
        COALESCE(SUM(e.amount), 0) as total_earnings,
        COUNT(DISTINCT s.id) as total_supporters
      FROM profiles p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN earnings e ON p.user_id = e.creator_id
      LEFT JOIN supporters s ON p.user_id = s.creator_id
      GROUP BY p.id, p.user_id, p.username, p.display_name, p.creator_url, 
               p.avatar_url, p.bio, p.category, p.website, u.email, u.email_verified
    `);

    return res.status(200).json(creators);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Database query failed', error: String(error) });
  } finally {
    await connection.end();
  }
}
