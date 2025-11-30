const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany();
  await User.create([
    { username: 'admin', email: 'admin@example.com', password: '123456', role: 'admin' },
    { username: 'user', email: 'user@example.com', password: '123456', role: 'user' }
  ]);
  console.log('Seed done');
  process.exit();
}
seed().catch(console.error);
