const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Emergency = sequelize.define('Emergency', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  station_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  level: {
    type: DataTypes.ENUM('LEVEL_1_CRITICAL', 'LEVEL_2_SERIOUS', 'LEVEL_3_ADVISORY'),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'fire, medical, structural, weather, etc.',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  triggered_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  triggered_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roll_call_snapshot: {
    type: DataTypes.JSONB,
    comment: 'Snapshot of personnel status at time of emergency',
  },
  inventory_snapshot: {
    type: DataTypes.JSONB,
    comment: 'Snapshot of critical inventory at time of emergency',
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'RESOLVED', 'ESCALATED'),
    defaultValue: 'ACTIVE',
    allowNull: false,
  },
  resolved_at: {
    type: DataTypes.DATE,
  },
  resolution_notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'emergencies',
  indexes: [
    { fields: ['station_id', 'status'] },
    { fields: ['level', 'triggered_at'] },
  ],
});

module.exports = Emergency;
