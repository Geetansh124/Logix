const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  station_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  item_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  current_stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'liters, kg, units, etc.',
  },
  location: {
    type: DataTypes.STRING,
    comment: 'warehouse, lab, etc.',
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
  },
  reorder_point: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  safety_stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  daily_consumption: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  depletion_date: {
    type: DataTypes.DATEONLY,
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'inventories',
  indexes: [
    { fields: ['station_id', 'category'] },
    { fields: ['depletion_date'] },
    { fields: ['expiry_date'] },
  ],
});

module.exports = Inventory;
