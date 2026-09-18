const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Container = sequelize.define('Container', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  container_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'QR code identifier',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '20ft, 40ft, refrigerated, etc.',
  },
  dimensions: {
    type: DataTypes.JSONB,
    comment: '{ length, width, height, weight }',
  },
}, {
  tableName: 'containers',
});

module.exports = Container;
