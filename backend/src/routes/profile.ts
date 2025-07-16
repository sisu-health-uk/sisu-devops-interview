import express, { Request, Response } from 'express';
import pool from '../../db'; // Import the database connection pool
import { RowDataPacket } from 'mysql2';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send({ message: 'Missing username' });
  }

  try {
    const [rows] = await pool.execute('SELECT username FROM users WHERE username = ?', [username]);
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    const user = (rows as RowDataPacket[])[0];
    return res.status(200).send({ username: user.username });
  } catch (error) {
    console.error('Error during get profile:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  const { username, newUsername } = req.body;
  if (!username || !newUsername) {
    return res.status(400).send({ message: 'Missing username or newUsername' });
  }

  try {
    const [result] = await pool.execute('UPDATE users SET username = ? WHERE username = ?', [newUsername, username]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error during update profile:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
});

export default router;