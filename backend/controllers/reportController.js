const Order = require('../models/Order');

async function salesReport(req, res) {
  const match = {};
  const orders = await Order.find(match);
  const totalRevenue = orders.reduce((a,b)=> a + (b.grandTotal||0), 0);
  res.json({ totalOrders: orders.length, totalRevenue });
}

async function popularItems(req, res) {
  const orders = await Order.find({});
  const counts = {};
  orders.forEach(o => {
    (o.items || []).forEach(it => { counts[it.name] = (counts[it.name]||0) + it.qty; });
  });
  const items = Object.entries(counts).map(([name,qty])=>({ name, qty })).sort((a,b)=> b.qty - a.qty);
  res.json(items);
}

async function paymentMethods(req, res) {
  const orders = await Order.find({});
  const counts = {};
  orders.forEach(o => { counts[o.paymentMethod] = (counts[o.paymentMethod]||0) + 1; });
  res.json(counts);
}

module.exports = { salesReport, popularItems, paymentMethods };
