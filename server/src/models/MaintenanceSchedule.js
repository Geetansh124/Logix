const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaintenanceSchedule = sequelize.define('MaintenanceSchedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  asset_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  scheduled_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  completed_date: {
    type: DataTypes.DATEONLY,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'SCHEDULED',
    allowNull: false,
  },
}, {
  tableName: 'maintenance_schedules',
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['scheduled_date'] },
    { fields: ['status'] },
  ],
});

module.exports = MaintenanceSchedule;
