// backend/config/database.js
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
// Ne PAS mettre override:true, pour laisser priorité aux variables Docker
dotenv.config({ path: envFile });

const { Sequelize } = require('sequelize');

// Priorité aux variables injectées par Docker (DB_*), fallback sur tes anciennes (BDD_*/HOST_URL)
const DB_HOST = process.env.DB_HOST || process.env.HOST_URL || 'db';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_NAME = process.env.DB_NAME || process.env.BDD_NAME || 'dentiste';
const DB_USER = process.env.DB_USER || process.env.BDD_USER || 'app';
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.BDD_MDP || '';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
  pool: { max: 5, min: 0, idle: 10000, acquire: 60000 },
});

module.exports = sequelize;