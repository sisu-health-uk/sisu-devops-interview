import express, { Request, Response } from 'express';
import pool from '../../db'; // Import the database connection pool

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: 'Missing username or password' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (Array.isArray(rows) && rows.length > 0) {
      return res.status(400).send({ message: 'Username already exists' });
    }

    await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    return res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
});

router.post('/signin', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: 'Missing username or password' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
    return res.status(200).send({ message: 'User signed in successfully' });
  } catch (error) {
    console.error('Error during signin:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send({ message: 'Missing username' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    // In a real application, you would send a password reset email here
    return res.status(200).send({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
});

export default router;