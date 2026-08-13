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

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${order.billNumber}.pdf`);

  // Header with restaurant name
  doc.fontSize(24).fillColor('#ff6b00').font('Helvetica-Bold').text('ZESTORA', { align: 'center' });
  doc.fontSize(12).fillColor('#666').font('Helvetica').text('RESTAURANT', { align: 'center' });
  doc.fontSize(9).fillColor('#999').text('Dine & Order', { align: 'center' });
  
  // Address and contact
  doc.fontSize(9).fillColor('#999');
  doc.text('📍 Nagercoil, Tamil Nadu', { align: 'center' });
  doc.text('📱 +91-XXXX-XXXX-XXX | ✉️ info@zestora.com', { align: 'center' });
  
  doc.moveTo(50, doc.y + 10).lineTo(545, doc.y + 10).stroke('#ff6b00');
  doc.moveDown(12);

  // Order details in two columns
  doc.fontSize(10).fillColor('#333').font('Helvetica-Bold');
  doc.text('BILL DETAILS', 50, doc.y);
  
  const startY = doc.y + 15;
  doc.fontSize(9).font('Helvetica').fillColor('#666');
  
  // Left column
  doc.text('Bill Number:', 50, startY);
  doc.text('Order ID:', 50, startY + 20);
  doc.text('Table Number:', 50, startY + 40);
  doc.text('Customer Name:', 50, startY + 60);
  doc.text('Date & Time:', 50, startY + 80);
  doc.text('Payment Method:', 50, startY + 100);

  // Right column
  doc.fontSize(9).fillColor('#000').font('Helvetica-Bold');
  doc.text(order.billNumber, 200, startY);
  doc.text(order.orderId, 200, startY + 20);
  doc.text(`Table #${order.tableNumber || 'N/A'}`, 200, startY + 40);
  doc.text(order.customerName || 'Guest', 200, startY + 60);
  doc.text(new Date(order.createdAt).toLocaleString('en-IN'), 200, startY + 80);
  doc.text(order.paymentMethod || 'N/A', 200, startY + 100);

  doc.moveDown(120);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ddd');
  doc.moveDown(10);

  // Items Table Header
  const tableTop = doc.y;
  const col1 = 50, col2 = 250, col3 = 420, col4 = 495;

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#fff').fillAndStroke('#ff6b00');
  doc.rect(col1 - 5, tableTop, 500, 25).fill();
  
  doc.fontSize(10).fillColor('#fff').font('Helvetica-Bold');
  doc.text('ITEM NAME', col1, tableTop + 6);
  doc.text('QTY', col2, tableTop + 6, { align: 'center' });
  doc.text('PRICE', col3, tableTop + 6, { align: 'center' });
  doc.text('TOTAL', col4, tableTop + 6, { align: 'right' });

  doc.moveDown(20);

  // Items List
  doc.fontSize(9).fillColor('#333').font('Helvetica');
  let totalHeight = 0;
  
  order.items.forEach((item, idx) => {
    const itemTotal = (item.price * item.qty).toFixed(2);
    const itemY = doc.y;
    
    doc.text(item.name, col1, itemY, { width: 190, ellipsis: true });
    doc.text(item.qty.toString(), col2, itemY, { align: 'center', width: 50 });
    doc.text(`₹${item.price.toFixed(2)}`, col3, itemY, { align: 'center', width: 50 });
    doc.text(`₹${itemTotal}`, col4, itemY, { align: 'right' });
    
    doc.moveDown(20);
    totalHeight += 20;
  });

  // Totals Section
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ddd');
  doc.moveDown(10);

  const totalY = doc.y;
  doc.fontSize(10).font('Helvetica').fillColor('#666');
  
  // Right-aligned totals
  const labelCol = 350;
  const valueCol = 495;
  
  doc.text('Subtotal:', labelCol, totalY);
  doc.text(`₹${order.subtotal.toFixed(2)}`, valueCol, totalY, { align: 'right', width: 60 });
  
  if (order.discount > 0) {
    doc.text('Discount:', labelCol, totalY + 20);
    doc.text(`-₹${order.discount.toFixed(2)}`, valueCol, totalY + 20, { align: 'right', width: 60 });
  }
  
  doc.text('GST (5%):', labelCol, totalY + (order.discount > 0 ? 40 : 20));
  doc.text(`₹${order.gst.toFixed(2)}`, valueCol, totalY + (order.discount > 0 ? 40 : 20), { align: 'right', width: 60 });
  
  doc.text('Service Charge (2%):', labelCol, totalY + (order.discount > 0 ? 60 : 40));
  doc.text(`₹${order.serviceCharge.toFixed(2)}`, valueCol, totalY + (order.discount > 0 ? 60 : 40), { align: 'right', width: 60 });

  // Grand Total
  doc.moveTo(350, doc.y + 50).lineTo(545, doc.y + 50).stroke('#ff6b00');
  
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#ff6b00');
  const gtY = doc.y + 55;
  doc.text('GRAND TOTAL:', labelCol, gtY);
  doc.fontSize(14).fillColor('#ff6b00');
  doc.text(`₹${order.grandTotal.toFixed(2)}`, valueCol, gtY, { align: 'right', width: 60 });

  // Footer
  doc.moveDown(40);
  doc.fontSize(10).fillColor('#666').font('Helvetica');
  doc.text('Thank you for visiting ZESTORA! We look forward to seeing you again.', { align: 'center' });
  
  doc.fontSize(9).fillColor('#999').font('Helvetica');
  doc.moveDown(5);
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, { align: 'center' });

  doc.pipe(res);
  doc.end();
}

module.exports = { createOrder, listOrders, getOrder, updateOrderStatus, ordersByTable, generateInvoicePDF };
