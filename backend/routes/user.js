// backend/routes/user.js
const express             = require('express');
const crudPkg             = require('express-crud-router');
const sequelizeConnector  = require('express-crud-router-sequelize-v6-connector');

// Récupère bien la fonction CRUD et la fonction connector
const crud                = crudPkg.default  || crudPkg;
const connectSequelize    = sequelizeConnector.default || sequelizeConnector;

const { User }            = require('../model');
const userCtrl            = require('../controllers/user');
const auth                = require('../middleware/auth');

const router = express.Router();

// Auto‐CRUD sur /users
router.use(crud('/users', connectSequelize(User)));

// Tes routes custom après
router.post('/signup',               userCtrl.signup);
router.post('/login',                userCtrl.login);
router.get('/patient/:id',   auth,   userCtrl.getPatientById);
router.get('/professional/:id', auth, userCtrl.getProfessionalById);
router.get('/professionals',   auth,  userCtrl.getProfessionals);
router.post('/professional/add', auth, userCtrl.addProfessional);
router.put('/professional/upd/:id', auth, userCtrl.updateProfessional);

module.exports = router;