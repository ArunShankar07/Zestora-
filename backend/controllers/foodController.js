const Food = require('../models/Food');

async function listFoods(req, res) {
  const q = req.query || {};
  const filter = {};
  if (q.category) filter.category = q.category;
  if (q.search) filter.name = new RegExp(q.search, 'i');
  if (q.veg) filter.veg = q.veg === 'true';
  const foods = await Food.find(filter).sort({ popular: -1, createdAt: -1 });
  res.json(foods);
}

async function getFood(req, res) {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: 'Food not found' });
  res.json(food);
}

async function createFood(req, res) {
  const f = new Food(req.body);
  await f.save();
  res.status(201).json(f);
}

async function updateFood(req, res) {
  const f = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(f);
}

async function deleteFood(req, res) {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}

module.exports = { listFoods, getFood, createFood, updateFood, deleteFood };
