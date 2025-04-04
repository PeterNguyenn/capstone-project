import express from 'express';
import * as path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRouter from './routers/authRouter';
import postsRouter from './routers/postRouter';
import applicationRouter from './routers/applicationRouter';
import http from 'http';
import socketIo from 'socket.io';  // Correct default import


const app = express();

// Set up HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO with the HTTP server

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());          // For parsing application/json
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error(error);
});

// Set up routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/applications', applicationRouter);

// Static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Welcome route
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome!' });
});

// Health check route
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

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send a global notification to all connected clients when a new client connects
  io.emit('notification', { message: 'This is a global notification for all clients!' });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
