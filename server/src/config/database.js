const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/polar_expedition_dev';

const dialectOptions = env === 'production'
  ? { ssl: { require: true, rejectUnauthorized: false } }
  : {};

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: env === 'development' ? console.log : false,
  dialectOptions,
  pool: {
    max: env === 'production' ? 20 : 5,
    min: env === 'production' ? 5 : 1,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;
