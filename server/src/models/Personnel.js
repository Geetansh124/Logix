const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Personnel = sequelize.define('Personnel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expedition_id: {
    type: DataTypes.UUID,
  },
  status: {
    type: DataTypes.ENUM(
      'ACTIVE_ON_STATION', 'IN_TRANSIT', 'MEDICAL_HOLD',
      'ROTATION_DUE', 'DEPLOYED',
    ),
    defaultValue: 'ACTIVE_ON_STATION',
    allowNull: false,
  },
  current_station: {
    type: DataTypes.STRING,
  },
  medical_clearance: {
    type: DataTypes.DATEONLY,
  },
  medical_clearance_expiry: {
    type: DataTypes.DATEONLY,
  },
  rotation_due: {
    type: DataTypes.DATEONLY,
  },
  contact_info: {
    type: DataTypes.JSONB,
    comment: '{ phone, email, emergencyContact }',
  },
}, {
  tableName: 'personnel',
  indexes: [
    { fields: ['expedition_id'] },
    { fields: ['status'] },
    { fields: ['current_station'] },
  ],
});

module.exports = Personnel;
