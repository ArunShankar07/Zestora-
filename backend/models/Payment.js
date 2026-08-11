const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  orderId: { type: String },
  amount: Number,
  method: String,
  transactionId: String,
  status: { type: String, enum: ['Paid','Pending','Failed','Refunded'], default: 'Pending' }
},{ timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
