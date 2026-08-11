const { v4: uuidv4 } = require('uuid');

function generateOrderId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${num}`;
}

function generateBillNumber() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `ZST-${num}`;
}

function toFixed2(n) {
  return Number((Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2));
}

function calculateTotals(items = [], discount = 0, gstPercent = 5, servicePercent = 2) {
  // Calculate in paise (cents) to avoid float issues
  const subtotal = items.reduce((acc, it) => {
    const addons = (it.addons || []).reduce((a,b)=> a + (b.price||0), 0);
    const line = (it.price + addons) * (it.qty || 1);
    return acc + line;
  }, 0);

  const discountAmount = discount || 0;
  const gst = ((subtotal - discountAmount) * gstPercent) / 100;
  const serviceCharge = ((subtotal - discountAmount) * servicePercent) / 100;
  const grandTotal = subtotal - discountAmount + gst + serviceCharge;

  return {
    subtotal: toFixed2(subtotal),
    discount: toFixed2(discountAmount),
    gst: toFixed2(gst),
    serviceCharge: toFixed2(serviceCharge),
    grandTotal: toFixed2(grandTotal)
  };
}

module.exports = { generateOrderId, generateBillNumber, calculateTotals, toFixed2 };
