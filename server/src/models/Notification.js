const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  emergency_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NCPOR Director, MoES Emergency Cell, etc.',
  },
  channel: {
    type: DataTypes.ENUM('EMAIL', 'SMS', 'DASHBOARD', 'WHATSAPP'),
    allowNull: false,
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'SENT', 'DELIVERED', 'FAILED'),
    defaultValue: 'PENDING',
    allowNull: false,
  },
  error_message: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'notifications',
  indexes: [
    { fields: ['emergency_id'] },
    { fields: ['status'] },
  ],
});

module.exports = Notification;
