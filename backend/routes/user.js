// backend/routes/user.js
const express             = require('express');
const crudPkg             = require('express-crud-router');
const sequelizeConnector  = require('express-crud-router-sequelize-v6-connector');

// Récupère bien la fonction CRUD et la fonction connector
const crud                = crudPkg.default  || crudPkg;
const connectSequelize    = sequelizeConnector.default || sequelizeConnector;

const { User, Service }   = require('../model');
const userCtrl            = require('../controllers/user');

const router = express.Router();

// Auto‐CRUD sur /users
router.use(crud('/users-crud', connectSequelize(User, {
    searchableFields: ['role'], // Autorise les filtres sur ce champ
})));

router.get('/users-crud/by-role/:role', async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: req.params.role },
      attributes: { exclude: ['password'] },
      include: {
        model: Service,
      },
      order: [['id', 'ASC']],
    });

    res.json({ rows: users }); // important pour que le frontend continue de fonctionner
  } catch (error) {
    console.error('Erreur /users-crud/by-role/:role :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Tes routes custom après
router.post('/login', userCtrl.login);

module.exports = router;