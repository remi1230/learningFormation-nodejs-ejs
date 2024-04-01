const express = require('express');
const router  = express.Router();

const mainCtrl  = require('../controllers/main');

router.get('/', mainCtrl.indexPage);

module.exports = router;