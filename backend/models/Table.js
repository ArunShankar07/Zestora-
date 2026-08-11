const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, default: 4 },
  status: { type: String, enum: ['Available','Occupied','Reserved'], default: 'Available' }
});

module.exports = mongoose.model('Table', tableSchema);
