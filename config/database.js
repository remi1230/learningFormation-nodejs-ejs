// Charge les variables d'environnement depuis un fichier `.env`
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

// Configuration de la connexion à MySQL
const bddUser = process.env.BDD_USER;
const bddName = process.env.BDD_NAME;
const bddMdp  = encodeURIComponent(process.env.BDD_MDP);
const hostUrl = process.env.HOST_URL;
const dbPort  = parseInt(process.env.DB_PORT, 10) || 3306;

delete require.cache[require.resolve('sequelize')];
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(bddName, bddUser, bddMdp, {
  host: hostUrl,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
});

module.exports = sequelize;