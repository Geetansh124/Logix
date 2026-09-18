const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RollCall = sequelize.define('RollCall', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  station_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('COMPLETED', 'PENDING', 'MISSING_PERSONNEL'),
    defaultValue: 'PENDING',
    allowNull: false,
  },
  personnel_ids: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
    comment: 'IDs of personnel present during roll call',
  },
  missing_personnel_ids: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'roll_calls',
  indexes: [
    { fields: ['station_id', 'timestamp'] },
    { fields: ['status'] },
  ],
});

module.exports = RollCall;
