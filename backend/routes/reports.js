const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
router.get('/sales', ctrl.salesReport);
router.get('/popular-items', ctrl.popularItems);
router.get('/payment-methods', ctrl.paymentMethods);
module.exports = router;
