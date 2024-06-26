// Charge les variables d'environnement depuis un fichier `.env`
require('dotenv').config();
// Configuration de la connexion à MySQL
const bddUser = process.env.BDD_USER;
const bddName = process.env.BDD_NAME;
const bddMdp  = encodeURIComponent(process.env.BDD_MDP);

delete require.cache[require.resolve('sequelize')];
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(bddName, bddUser, bddMdp, {
  host: 'sql11.freesqldatabase.com',
  dialect: 'mysql'
});

module.exports = sequelize;