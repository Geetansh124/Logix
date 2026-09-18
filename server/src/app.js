const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { rateLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const expeditionRoutes = require('./routes/expedition.routes');
const cargoRoutes = require('./routes/cargo.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const personnelRoutes = require('./routes/personnel.routes');
const emergencyRoutes = require('./routes/emergency.routes');
const assetRoutes = require('./routes/asset.routes');
const stationRoutes = require('./routes/station.routes');

const app = express();

// --------------- Global Middleware ---------------
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimiter);

// --------------- Health Check ---------------
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// --------------- API Routes (v1) ---------------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/expeditions', expeditionRoutes);
app.use('/api/v1/cargo', cargoRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/personnel', personnelRoutes);
app.use('/api/v1/emergencies', emergencyRoutes);
app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/stations', stationRoutes);

// --------------- Error Handling ---------------
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
