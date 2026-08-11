require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Food = require('../models/Food');
const Table = require('../models/Table');
const User = require('../models/User');

async function seed() {
  await connectDB();
  await Food.deleteMany({});
  await Table.deleteMany({});
  await User.deleteMany({});

  const foods = [
    { name: 'Chicken Burger', price: 180, description: 'Juicy grilled chicken patty with fresh lettuce, tomatoes and special sauce', category: 'Burgers', veg: false, popular: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
    { name: 'Veg Burger', price: 150, description: 'Delicious crispy veggie patty loaded with cheese and fresh greens', category: 'Burgers', veg: true, popular: false, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80' },
    { name: 'Chicken Biriyani', price: 229, description: 'Aromatic basmati rice cooked with tender marinated chicken and rich spices', category: 'Biriyani', veg: false, popular: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80' },
    { name: 'French Fries', price: 120, description: 'Golden crispy potato fries seasoned with sea salt and peri-peri spice', category: 'Starters', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80' },
    { name: 'Coke', price: 60, description: 'Chilled refreshing Coca-Cola soft drink bottle', category: 'Beverages', veg: true, popular: false, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80' },
    { name: 'Chicken Wings', price: 199, description: 'Crispy spicy wings tossed in signature BBQ glaze sauce', category: 'Starters', veg: false, popular: true, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80' },
    { name: 'Margherita Pizza', price: 249, description: 'Classic Italian pizza with rich tomato sauce, fresh mozzarella and basil', category: 'Pizza', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80' },
    { name: 'Paneer Pizza', price: 239, description: 'Woodfired pizza topped with spiced cottage cheese, capsicum and herbs', category: 'Pizza', veg: true, popular: false, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80' },
    { name: 'Chicken 65', price: 180, description: 'Spicy deep-fried chicken tossed with curry leaves and red chilies', category: 'Starters', veg: false, popular: true, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80' },
    { name: 'Veg Fried Rice', price: 160, description: 'Wok-tossed basmati rice with crunchy garden vegetables and soy seasoning', category: 'Rice & Noodles', veg: true, popular: false, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80' },
    { name: 'Chicken Fried Rice', price: 190, description: 'Flavorful fried rice tossed with shredded chicken, scrambled eggs and veggies', category: 'Rice & Noodles', veg: false, popular: false, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80' },
    { name: 'Paneer Butter Masala', price: 210, description: 'Rich creamy tomato gravy with soft cottage cheese cubes and butter', category: 'Meals', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80' },
    { name: 'Butter Naan', price: 50, description: 'Soft tandoori flatbread brushed with generous garlic butter', category: 'Starters', veg: true, popular: false, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=80' },
    { name: 'Cold Coffee', price: 120, description: 'Creamy iced coffee topped with chocolate syrup and vanilla foam', category: 'Beverages', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80' },
    { name: 'Chocolate Brownie', price: 110, description: 'Warm fudgy chocolate brownie served with hot fudge chocolate drizzle', category: 'Desserts', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80' }
  ];
  await Food.insertMany(foods);

  const tables = [];
  for (let i=1;i<=10;i++) tables.push({ tableNumber: String(i).padStart(2,'0'), capacity: 4, status: 'Available' });
  await Table.insertMany(tables);

  const adminPassword = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Zestora Admin', email: 'admin@zestora.local', password: adminPassword, role: 'admin' });

  console.log('Seed completed');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

