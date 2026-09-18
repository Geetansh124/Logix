const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { setupCargoSocket } = require('./cargo.socket');
const { setupInventorySocket } = require('./inventory.socket');
const { setupEmergencySocket } = require('./emergency.socket');
const { setupSyncSocket } = require('./sync.socket');

let io;

function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // JWT authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const secret = process.env.JWT_SECRET || 'dev_secret_do_not_use_in_production';
      const decoded = jwt.verify(token, secret);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user.name} (${socket.id})`);

    // Setup namespace handlers
    setupCargoSocket(io, socket);
    setupInventorySocket(io, socket);
    setupEmergencySocket(io, socket);
    setupSyncSocket(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.user.name} — ${reason}`);
    });

    socket.on('error', (err) => {
      console.error(`Socket error (${socket.user.name}):`, err.message);
    });
  });

  console.log('✓ Socket.io initialized');
  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

module.exports = { initSocketServer, getIO };
