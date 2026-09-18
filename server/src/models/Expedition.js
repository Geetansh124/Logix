const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expedition = sequelize.define('Expedition', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'PLANNING',
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'expeditions',
  indexes: [
    { fields: ['status'] },
    { fields: ['start_date', 'end_date'] },
  ],
});

module.exports = Expedition;
