const Table = require('../models/Table');

async function listTables(req, res) {
  const tables = await Table.find({}).sort({ tableNumber: 1 });
  res.json(tables);
}

async function createTable(req, res) {
  const t = new Table(req.body);
  await t.save();
  res.status(201).json(t);
}

async function updateTable(req, res) {
  const t = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(t);
}

module.exports = { listTables, createTable, updateTable };
