const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const http = require('http');
const app = require('./app');
const { initSocketServer } = require('./sockets');
const sequelize = require('./config/database');
const redis = require('./config/redis');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.io
initSocketServer(server);

async function start() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ PostgreSQL connected');

    // Test Redis connection (non-blocking — app works without it)
    redis.connect().catch((err) => {
      console.warn('⚠ Redis unavailable — running without cache:', err.message);
    });

    server.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully`);
  server.close(async () => {
    try {
      await sequelize.close();
      await redis.quit();
    } catch { /* ignore cleanup errors */ }
    process.exit(0);
  });
  // Force shutdown after 10s
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
