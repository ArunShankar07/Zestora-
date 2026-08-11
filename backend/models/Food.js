const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({ name: String, price: Number });

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  rating: { type: Number, default: 4.5 },
  veg: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  popular: { type: Boolean, default: false },
  ingredients: [String],
  addons: [addonSchema]
},{ timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
