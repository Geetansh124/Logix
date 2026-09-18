const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/polar_expedition_dev',
    dialect: 'postgres',
    logging: console.log,
    define: { timestamps: true, underscored: true },
  },
  staging: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    define: { timestamps: true, underscored: true },
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    define: { timestamps: true, underscored: true },
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    pool: { max: 20, min: 5, acquire: 60000, idle: 10000 },
  },
};
