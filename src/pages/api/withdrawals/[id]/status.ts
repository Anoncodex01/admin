import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const validStatuses = ['pending', 'processing', 'completed', 'failed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const result = await db.query(
        'UPDATE withdrawals SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Withdrawal not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      res.status(500).json({ error: 'Failed to update withdrawal status' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
