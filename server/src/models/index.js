const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const Expedition = require('./Expedition');
const Station = require('./Station');
const Container = require('./Container');
const Cargo = require('./Cargo');
const Inventory = require('./Inventory');
const ConsumptionHistory = require('./ConsumptionHistory');
const Personnel = require('./Personnel');
const RollCall = require('./RollCall');
const Emergency = require('./Emergency');
const Notification = require('./Notification');
const Asset = require('./Asset');
const ReceiptConfirmation = require('./ReceiptConfirmation');
const MaintenanceSchedule = require('./MaintenanceSchedule');

// ===== Associations =====

// Expedition → Cargo (one-to-many)
Expedition.hasMany(Cargo, { foreignKey: 'expedition_id', as: 'cargo' });
Cargo.belongsTo(Expedition, { foreignKey: 'expedition_id', as: 'expedition' });

// Expedition → Personnel (one-to-many)
Expedition.hasMany(Personnel, { foreignKey: 'expedition_id', as: 'personnel' });
Personnel.belongsTo(Expedition, { foreignKey: 'expedition_id', as: 'expedition' });

// Container → Cargo (one-to-many)
Container.hasMany(Cargo, { foreignKey: 'container_id', as: 'cargo' });
Cargo.belongsTo(Container, { foreignKey: 'container_id', as: 'container' });

// Cargo → ReceiptConfirmation (one-to-many)
Cargo.hasMany(ReceiptConfirmation, { foreignKey: 'cargo_id', as: 'receiptConfirmations' });
ReceiptConfirmation.belongsTo(Cargo, { foreignKey: 'cargo_id', as: 'cargo' });

// Station → Inventory (one-to-many)
Station.hasMany(Inventory, { foreignKey: 'station_id', as: 'inventories' });
Inventory.belongsTo(Station, { foreignKey: 'station_id', as: 'station' });

// Inventory → ConsumptionHistory (one-to-many)
Inventory.hasMany(ConsumptionHistory, { foreignKey: 'inventory_id', as: 'consumptionHistory' });
ConsumptionHistory.belongsTo(Inventory, { foreignKey: 'inventory_id', as: 'inventory' });

// Station → Emergency (one-to-many)
Station.hasMany(Emergency, { foreignKey: 'station_id', as: 'emergencies' });
Emergency.belongsTo(Station, { foreignKey: 'station_id', as: 'station' });

// Emergency → Notification (one-to-many)
Emergency.hasMany(Notification, { foreignKey: 'emergency_id', as: 'notifications' });
Notification.belongsTo(Emergency, { foreignKey: 'emergency_id', as: 'emergency' });

// Station → Asset (one-to-many)
Station.hasMany(Asset, { foreignKey: 'station_id', as: 'assets' });
Asset.belongsTo(Station, { foreignKey: 'station_id', as: 'station' });

// Asset → MaintenanceSchedule (one-to-many)
Asset.hasMany(MaintenanceSchedule, { foreignKey: 'asset_id', as: 'maintenanceSchedule' });
MaintenanceSchedule.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });

// Station → RollCall (one-to-many)
Station.hasMany(RollCall, { foreignKey: 'station_id', as: 'rollCalls' });
RollCall.belongsTo(Station, { foreignKey: 'station_id', as: 'station' });

module.exports = {
  sequelize,
  User,
  Expedition,
  Station,
  Container,
  Cargo,
  Inventory,
  ConsumptionHistory,
  Personnel,
  RollCall,
  Emergency,
  Notification,
  Asset,
  ReceiptConfirmation,
  MaintenanceSchedule,
};
