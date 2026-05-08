const bcrypt = require('bcryptjs');
const User   = require('../models/User');

const seedAdmin = async () => {
  const exists = await User.findOne({ role: 'admin' });
  if (exists) return;
  const password = await bcrypt.hash('admin123', 12);
  await User.create({ name: 'Admin', email: 'admin@medstock.com', password, role: 'admin' });
  console.log('🌱 Admin seeded — admin@medstock.com / admin123');
};

module.exports = seedAdmin;
