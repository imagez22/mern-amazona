import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data.js';
import products from './data.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import connectDB from './utils.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    await User.insertMany(users.users);
    await Product.insertMany(products.products);

    console.log('🌱 Seed Data Imported');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
