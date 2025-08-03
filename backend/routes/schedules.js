// Importation du framework Express et création d'un nouveau routeur
const express             = require('express');
const crudPkg             = require('express-crud-router');
const sequelizeConnector  = require('express-crud-router-sequelize-v6-connector');
const router              = express.Router();

// Récupère bien la fonction CRUD et la fonction connector
const crud                = crudPkg.default  || crudPkg;
const connectSequelize    = sequelizeConnector.default || sequelizeConnector;

const { Schedules } = require('../model');
const auth          = require('../middleware/auth');
const schedulesCtrl = require('../controllers/schedules');

// Auto‐CRUD sur /schedules-crud
router.use(crud('/schedules-crud', connectSequelize(Schedules)));

// Exportation du routeur configuré pour utilisation dans l'application principale
module.exports = router;