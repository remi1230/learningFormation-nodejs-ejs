// Importation du framework Express et création d'un nouveau routeur
const express             = require('express');
const crudPkg             = require('express-crud-router');
const sequelizeConnector  = require('express-crud-router-sequelize-v6-connector');
const router              = express.Router();

// Récupère bien la fonction CRUD et la fonction connector
const crud                = crudPkg.default  || crudPkg;
const connectSequelize    = sequelizeConnector.default || sequelizeConnector;

const { Service } = require('../model');

// Auto‐CRUD sur /services-crud
router.use(crud('/services-crud', connectSequelize(Service)));

// Exportation du routeur configuré pour utilisation dans l'application principale
module.exports = router;