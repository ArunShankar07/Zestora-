const Category = require('../models/Category');

async function listCategories(req, res) {
  const cats = await Category.find({}).sort({ name: 1 });
  res.json(cats);
}

async function createCategory(req, res) {
  const c = new Category(req.body);
  await c.save();
  res.status(201).json(c);
}

async function updateCategory(req, res) {
  const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(c);
}

async function deleteCategory(req, res) {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
