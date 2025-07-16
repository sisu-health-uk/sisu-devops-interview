const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock the db module directly
const mockExecute = jest.fn();
jest.mock('./db', () => ({
  __esModule: true, // This is important for default exports
  default: {
    execute: mockExecute,
    getConnection: jest.fn(() => Promise.resolve({ release: jest.fn() })),
  },
}));

let authRoutes;
let profileRoutes;
let app;

describe('Auth Routes', () => {
  beforeAll(() => {
    authRoutes = require('./src/routes/auth').default;
    profileRoutes = require('./src/routes/profile').default;

    app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/auth', authRoutes);
    app.use('/profile', profileRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementation for each test
    mockExecute.mockImplementation((sql, params) => {
      if (sql.includes('INSERT INTO users')) {
        const [username, password] = params;
        if (username === 'existinguser') {
          return [[{ username: 'existinguser' }], { affectedRows: 0 }]; // Simulate user already exists
        }
        return [[], { affectedRows: 1 }];
      } else if (sql.includes('SELECT * FROM users WHERE username = ? AND password = ?')) {
        const [username, password] = params;
        if (username === 'testuser' && password === 'password') {
          return [[{ username: 'testuser', password: 'password' }], []];
        }
        return [[], []];
      } else if (sql.includes('SELECT * FROM users WHERE username = ?')) {
        const [username] = params;
        if (username === 'testuser') {
          return [[{ username: 'testuser', password: 'password' }], []];
        }
        return [[], []];
      } else if (sql.includes('UPDATE users SET username = ? WHERE username = ?')) {
        const [newUsername, username] = params;
        if (username === 'testuser') {
          return [{ affectedRows: 1 }, []]; // Corrected mock for affectedRows
        }
        return [{ affectedRows: 0 }, []]; // Corrected mock for affectedRows
      }
      return [[], []];
    });
  });

  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ username: 'newuser', password: 'password' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('User created successfully');
  });

  it('should not sign up an existing user', async () => {
    mockExecute.mockImplementationOnce((sql, params) => {
      if (sql.includes('SELECT * FROM users WHERE username = ?')) {
        return [[{ username: 'existinguser' }], []];
      }
      return [[], []];
    });
    const res = await request(app)
      .post('/auth/signup')
      .send({ username: 'existinguser', password: 'password' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Username already exists');
  });

  it('should sign in an existing user', async () => {
    const res = await request(app)
      .post('/auth/signin')
      .send({ username: 'testuser', password: 'password' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User signed in successfully');
  });

  it('should not sign in with invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/signin')
      .send({ username: 'testuser', password: 'wrongpassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Invalid username or password');
  });

  it('should send a password reset email', async () => {
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ username: 'testuser' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Password reset email sent');
  });

  it('should not send a password reset email for a non-existing user', async () => {
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ username: 'nonexistinguser' });
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('User not found');
  });
});

describe('Profile Routes', () => {
  beforeAll(() => {
    jest.resetModules(); // Clear module cache
    // Import routes after mocking
    authRoutes = require('./src/routes/auth').default;
    profileRoutes = require('./src/routes/profile').default;

    app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/auth', authRoutes);
    app.use('/profile', profileRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockImplementation((sql, params) => {
      if (sql.includes('SELECT username FROM users WHERE username = ?')) {
        const [username] = params;
        if (username === 'testuser') {
          return [[{ username: 'testuser' }], []];
        }
        return [[], []];
      } else if (sql.includes('UPDATE users SET username = ? WHERE username = ?')) {
        const [newUsername, username] = params;
        if (username === 'testuser') {
          return [[], { affectedRows: 1 }];
        }
        return [[], { affectedRows: 0 }];
      }
      return [[], []];
    });
  });

  it('should get the profile of an existing user', async () => {
    const res = await request(app)
      .get('/profile?username=testuser');
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual('testuser');
  });

  it('should not get the profile of a non-existing user', async () => {
    const res = await request(app)
      .get('/profile?username=nonexistinguser');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('User not found');
  });

  it('should update the profile of an existing user', async () => {
    const res = await request(app)
      .put('/profile')
      .send({ username: 'testuser', newUsername: 'newtestuser' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Profile updated successfully');
  });

   it('should not update the profile of a non-existing user', async () => {
     mockExecute.mockImplementationOnce((sql, params) => {
       console.log('Mocking update for non-existing user:', sql, params);
       return [[], { affectedRows: 0 }];
     });
     const res = await request(app)
       .put('/profile')
       .send({ username: 'nonexistinguser', newUsername: 'newtestuser' });
     expect(res.statusCode).toEqual(404);
     expect(res.body.message).toEqual('User not found');
   });
 });
