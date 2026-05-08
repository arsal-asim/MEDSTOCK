require('dotenv').config();
const app       = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seedAdmin');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Admin: admin@medstock.com / admin123`);
  });
};

start();
