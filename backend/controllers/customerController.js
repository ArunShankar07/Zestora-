const Order = require('../models/Order');

async function listCustomers(req, res) {
  // basic aggregation from orders
  const orders = await Order.find({});
  const map = {};
  orders.forEach(o => {
    const key = o.phone || o.email || o.customerName || 'guest';
    if (!map[key]) map[key] = { name: o.customerName, phone: o.phone, email: o.email, totalOrders: 0, totalSpent: 0, lastOrder: null };
    map[key].totalOrders += 1;
    map[key].totalSpent += (o.grandTotal || 0);
    map[key].lastOrder = o.createdAt;
  });
  res.json(Object.values(map));
}

module.exports = { listCustomers };
