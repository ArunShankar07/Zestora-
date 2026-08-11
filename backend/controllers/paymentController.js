const Payment = require('../models/Payment');

async function listPayments(req, res) {
  const payments = await Payment.find({}).sort({ createdAt: -1 });
  res.json(payments);
}

async function getPayment(req, res) {
  const p = await Payment.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Payment not found' });
  res.json(p);
}

async function updatePaymentStatus(req, res) {
  const p = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
}

module.exports = { listPayments, getPayment, updatePaymentStatus };
