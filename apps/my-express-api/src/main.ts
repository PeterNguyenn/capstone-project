/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import authRouter from './routers/authRouter';
import postsRouter from './routers/postRouter';
import applicationRouter from './routers/applicationRouter';
import eventRouter from './routers/eventRouter'; // ← NEW

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json()); // For parsing application/json
// app.use(express.urlencoded({ extended: true }));

// --- DB connection ---
const mongoUri = process.env.MONGO_URI as string;
if (!mongoUri) {
  console.warn('MONGO_URI not set. Set it in your env before starting the API.');
}
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));

// --- Routers ---
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/events', eventRouter); // ← NEW

// static
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// root ping
app.get('/api', (_req, res) => res.send({ message: 'Welcome!' }));

// health (root)
app.get('/health', (_req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? 'healthy' : 'unhealthy',
    details: { database: dbUp ? 'connected' : 'disconnected' },
  });
});

// health (under /api for convenience)
app.get('/api/health', (_req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? 'healthy' : 'unhealthy',
    details: { database: dbUp ? 'connected' : 'disconnected' },
  });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
