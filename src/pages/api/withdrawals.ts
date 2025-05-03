import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const withdrawals = await db.query(`
        SELECT w.*, c.name as creator_name 
        FROM withdrawals w 
        JOIN creators c ON w.creator_id = c.id 
        ORDER BY w.created_at DESC
      `);
      
      res.status(200).json(withdrawals.rows);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
