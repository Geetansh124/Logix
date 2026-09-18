const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cargo = sequelize.define('Cargo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  expedition_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  container_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('CRITICAL', 'ESSENTIAL', 'STANDARD', 'BULK'),
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('P0', 'P1', 'P2', 'P3'),
    allowNull: false,
  },
  stowage_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Last-loaded = first-offloaded',
  },
  origin_hub: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'NCPOR-Goa',
  },
  destination_hub: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  current_location: {
    type: DataTypes.JSONB,
    comment: '{ lat, lng, hub, timestamp }',
  },
  status: {
    type: DataTypes.ENUM(
      'CONSOLIDATED', 'IN_TRANSIT', 'AT_TRANSSHIPMENT',
      'DELIVERED', 'RECEIVED', 'DAMAGED',
    ),
    defaultValue: 'CONSOLIDATED',
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  weight_kg: {
    type: DataTypes.FLOAT,
  },
}, {
  tableName: 'cargo',
  indexes: [
    { fields: ['expedition_id'] },
    { fields: ['status'] },
    { fields: ['priority', 'stowage_order'] },
  ],
});

module.exports = Cargo;
