const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Dummy database
interface User {
  username: string;
  password: string;
}
const users: User[] = [];

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

exports.users = users;
