const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');
const { adminAuth } = require('../middleware/authMiddleware');
router.get('/', ctrl.listPayments);
router.get('/:id', ctrl.getPayment);
router.put('/:id/status', adminAuth, ctrl.updatePaymentStatus);
module.exports = router;
