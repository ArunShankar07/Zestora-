const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { generateOrderId, generateBillNumber, calculateTotals } = require('../utils/helpers');
const PDFDocument = require('pdfkit');
const Food = require('../models/Food');

async function createOrder(req, res) {
  const data = req.body;
  if (!data.items || data.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
  const orderId = generateOrderId();
  const billNumber = generateBillNumber();

  const totals = calculateTotals(data.items, data.discount || 0, data.gstPercent || 5, data.servicePercent || 2);

  const order = new Order({
    ...data,
    orderId,
    billNumber,
    subtotal: totals.subtotal,
    discount: totals.discount,
    gst: totals.gst,
    serviceCharge: totals.serviceCharge,
    grandTotal: totals.grandTotal,
    paymentStatus: data.paymentMethod === 'Cash' ? 'Pending' : 'Paid'
  });

  await order.save();

  // create payment record
  const payment = new Payment({
    paymentId: `PAY-${Date.now()}`,
    orderId: order.orderId,
    amount: order.grandTotal,
    method: order.paymentMethod,
    transactionId: order.transactionId || null,
    status: order.paymentStatus
  });
  await payment.save();

  res.status(201).json({ order, payment });
}

async function listOrders(req, res) {
  const q = req.query || {};
  const filter = {};
  if (q.status) filter.orderStatus = q.status;
  if (q.table) filter.tableNumber = q.table;
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
}

async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}

async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
  res.json(order);
}

async function ordersByTable(req, res) {
  const tableNumber = req.params.tableNumber;
  const orders = await Order.find({ tableNumber }).sort({ createdAt: -1 });
  res.json(orders);
}

async function generateInvoicePDF(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${order.billNumber}.pdf`);
  doc.fontSize(20).fillColor('#ff7a00').text('ZESTORA RESTAURANT', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).fillColor('#fff').text(`Bill: ${order.billNumber}`);
  doc.text(`Order ID: ${order.orderId}`);
  doc.text(`Table: ${order.tableNumber || 'N/A'}`);
  doc.text(`Customer: ${order.customerName || 'Guest'}`);
  doc.text(`Date: ${order.createdAt.toLocaleString()}`);
  doc.moveDown();
  doc.fontSize(12).fillColor('#ccc').text('Items:');
  order.items.forEach(it => {
    doc.text(`${it.name} x${it.qty}  ₹${it.price}  = ₹${(it.price * it.qty).toFixed(2)}`);
  });
  doc.moveDown();
  doc.text(`Subtotal: ₹${order.subtotal}`);
  doc.text(`Discount: -₹${order.discount}`);
  doc.text(`GST: ₹${order.gst}`);
  doc.text(`Service Charge: ₹${order.serviceCharge}`);
  doc.moveDown();
  doc.fontSize(14).fillColor('#ff7a00').text(`Grand Total: ₹${order.grandTotal}`);
  doc.moveDown();
  doc.fontSize(10).fillColor('#aaa').text('Thank you! Visit Again!', { align: 'center' });
  doc.pipe(res);
  doc.end();
}

module.exports = { createOrder, listOrders, getOrder, updateOrderStatus, ordersByTable, generateInvoicePDF };
