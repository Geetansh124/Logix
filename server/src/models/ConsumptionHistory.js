const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConsumptionHistory = sequelize.define('ConsumptionHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  inventory_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'normal usage',
    comment: 'normal usage, emergency, spillage, etc.',
  },
}, {
  tableName: 'consumption_histories',
  indexes: [
    { fields: ['inventory_id', 'date'] },
  ],
});

module.exports = ConsumptionHistory;
