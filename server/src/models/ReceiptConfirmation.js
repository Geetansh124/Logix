const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReceiptConfirmation = sequelize.define('ReceiptConfirmation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cargo_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  hub: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NCPOR-Goa, CGI-Cape Town, Maitri, Bharati',
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  condition: {
    type: DataTypes.ENUM('INTACT', 'DAMAGED', 'MISSING'),
    allowNull: false,
  },
  confirmed_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'receipt_confirmations',
  indexes: [
    { fields: ['cargo_id'] },
    { fields: ['hub'] },
  ],
});

module.exports = ReceiptConfirmation;
