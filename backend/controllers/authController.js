const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function adminLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Account not found. Please create an admin account.' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Incorrect password' });
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '8h' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
}

async function adminRegister(req, res) {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'An account with this email already exists.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name || 'Admin User',
    email,
    password: hashedPassword,
    role: 'admin'
  });

  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '8h' });
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
}

module.exports = { adminLogin, adminRegister };

