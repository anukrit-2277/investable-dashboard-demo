import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const hashed = await bcrypt.hash('adminpassword', 10);
  const admin = new User({
    name: 'Super Admin',
    email: 'admin@admin.com',
    password: hashed,
    userType: 'superadmin',
  });
  await admin.save();
  console.log('Super Admin created!');
  process.exit();
}

createAdmin();
