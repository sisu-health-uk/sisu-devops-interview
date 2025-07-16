import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/auth';
import profileRoutes from './src/routes/profile';
import pool from './db'; // Import the database connection pool

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database!');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL database:', err);
  });

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test API call successful!' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});