// backend/routes/appointment.js
const express             = require('express');
const crudPkg             = require('express-crud-router');
const sequelizeConnector  = require('express-crud-router-sequelize-v6-connector');

// Récupère bien la fonction CRUD et la fonction connector
const crud                = crudPkg.default  || crudPkg;
const connectSequelize    = sequelizeConnector.default || sequelizeConnector;

const { Appointment } = require('../model');

const router = express.Router();

// Auto‐CRUD sur /appointments
router.use(crud('/appointments-crud', connectSequelize(Appointment)));
router.get('/appointments-by-service', async (req, res) => {
  const { serviceId } = req.query

  try {
    const rdvs = await Appointment.findAll({
      where: { serviceId }
    })

    res.json(rdvs)
  } catch (error) {
    console.error('Erreur lors de la récupération des RDV par service:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

module.exports = router;