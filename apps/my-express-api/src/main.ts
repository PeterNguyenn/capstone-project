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

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());          // For parsing application/json
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error(error);
});

app.use('/api/auth', authRouter);

app.use('/api/posts', postsRouter);

app.use('/api/applications', applicationRouter);


app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome!' });
});

app.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1;
  const isHealthy = dbStatus;
  
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    details: {
      database: dbStatus ? 'connected' : 'disconnected',
      // uptime: process.uptime()
    }
  });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
