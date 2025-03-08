/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { pool } from './db';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome!' });
});

app.get('/health', (req, res) => {
  res.send({ message: 'OK!!!!!' });
});

app.get('/setup', async (req, res) => {
  try {
    await pool.query(
      'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL)'
    );
    res.send({ message: 'Setup complete' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error setting up database' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching users' });
  }
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [
      name,
      email,
    ]);
    res.send({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating user' });
  }
});



const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
