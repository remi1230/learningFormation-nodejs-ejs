// backend/routes/appointment.routes.js
const express = require('express');
const auth = require('../middleware/auth');
const crudPkg = require('express-crud-router');
const sequelizeConnector = require('express-crud-router-sequelize-v6-connector');
const { Appointment } = require('../model');
const { User, Service } = require('../model');

const router = express.Router();

// 1️⃣ Route sur-mesure pour filtrer les RDV par service
router.get('/appointments-by-service', async (req, res) => {
  try {
    const raw = req.query.serviceId;
    const id = raw !== undefined && raw !== '' ? parseInt(raw, 10) : null;

    const baseQuery = {
      include: [
        { model: User, attributes: ['id', 'lastName', 'firstName', 'email', 'createdAt'] },
        { model: Service, attributes: ['id', 'name', 'color'] },
      ],
      order: [['date', 'ASC'], ['time', 'ASC']],
    };

    // Si un serviceId valide est fourni → filtre
    if (Number.isInteger(id)) {
      const rdvs = await Appointment.findAll({
        ...baseQuery,
        where: { serviceId: id },
      });
      return res.json(rdvs);
    }

    // Sinon → tous les RDV
    const rdvs = await Appointment.findAll(baseQuery);
    return res.json(rdvs);

  } catch (err) {
    console.error('Erreur lors de la récupération des RDV par service :', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 2️⃣ Intercepter les POST pour injecter userId
router.post('/appointments-crud', auth, (req, res, next) => {
  req.body.userId = req.auth.userId;
  next(); // passe au CRUD ensuite
});

// 3️⃣ CRUD générique pour /appointments-crud
const crud = crudPkg.default || crudPkg;
const connectSequelize = sequelizeConnector.default || sequelizeConnector;

router.use(
  crud(
    '/appointments-crud',                    // base path
    connectSequelize(Appointment)            // connexion Sequelize
  )
);

module.exports = router;