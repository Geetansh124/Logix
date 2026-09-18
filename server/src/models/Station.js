const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Station = sequelize.define('Station', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: '{ lat, lng, elevation }',
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  current_personnel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'stations',
});

module.exports = Station;
