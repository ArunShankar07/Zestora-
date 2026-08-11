const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/foods', require('./foods'));
router.use('/categories', require('./categories'));
router.use('/tables', require('./tables'));
router.use('/orders', require('./orders'));
router.use('/payments', require('./payments'));
router.use('/customers', require('./customers'));
router.use('/reports', require('./reports'));

module.exports = router;
