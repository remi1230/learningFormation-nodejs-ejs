// backend/routes/user.js
const express             = require('express');
const crudPkg             = require('express-crud-router');
const sequelizeConnector  = require('express-crud-router-sequelize-v6-connector');

// Récupère bien la fonction CRUD et la fonction connector
const crud                = crudPkg.default  || crudPkg;
const connectSequelize    = sequelizeConnector.default || sequelizeConnector;

const { User }            = require('../model');
const userCtrl            = require('../controllers/user');

const router = express.Router();

// Auto‐CRUD sur /users
router.use(crud('/users', connectSequelize(User)));

// Tes routes custom après
router.post('/login', userCtrl.login);

module.exports = router;