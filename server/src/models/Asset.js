const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  asset_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('MOVABLE', 'IMMOVABLE', 'CONSUMABLE'),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'VEHICLE', 'EQUIPMENT', 'GENERATOR', 'CONTAINER',
      'BUILDING', 'INFRASTRUCTURE', 'FUEL', 'FOOD',
      'MEDICAL', 'SPARE_PARTS',
    ),
    allowNull: false,
  },
  station_id: {
    type: DataTypes.UUID,
  },
  location: {
    type: DataTypes.JSONB,
    comment: '{ lat, lng, building, room }',
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'IN_MAINTENANCE', 'DECOMMISSIONED', 'IN_TRANSIT'),
    defaultValue: 'ACTIVE',
    allowNull: false,
  },
  purchase_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'assets',
  indexes: [
    { fields: ['station_id'] },
    { fields: ['type', 'category'] },
    { fields: ['status'] },
  ],
});

module.exports = Asset;
