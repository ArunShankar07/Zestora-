const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  name: String,
  qty: Number,
  price: Number,
  addons: [{ name: String, price: Number }],
  instructions: String
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  billNumber: { type: String, unique: true },
  tableNumber: String,
  customerName: String,
  phone: String,
  email: String,
  items: [itemSchema],
  subtotal: Number,
  discount: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  serviceCharge: { type: Number, default: 0 },
  grandTotal: Number,
  diningType: { type: String, enum: ['Dine In','Take Away','Delivery'], default: 'Dine In' },
  paymentMethod: String,
  paymentStatus: { type: String, enum: ['Paid','Pending','Failed'], default: 'Pending' },
  transactionId: String,
  specialInstructions: String,
  orderStatus: { type: String, enum: ['Received','Preparing','Ready','Served','Completed','Cancelled'], default: 'Received' }
},{ timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
