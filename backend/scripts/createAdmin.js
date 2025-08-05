import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MONGODB_URI = 'mongodb+srv://anukrit77:whO9Se6Fo6Td1tha@projectnode.4tai5.mongodb.net/';

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@upvalue.in' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 10);
    const adminUser = new User({
      name: 'Super Admin',
      email: 'admin@upvalue.in',
      password: hashedPassword,
      userType: 'superadmin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@upvalue.in');
    console.log('Password: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin();
