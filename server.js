/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow requests from localhost and local network IPs
    if (origin.startsWith('http://localhost') || 
        origin.startsWith('http://127.0.0.1') || 
        origin.startsWith('http://192.168.') ||
        origin.includes('vercel.app') ||  // Vercel deployment
        origin.includes('netlify.app') || // Netlify deployment
        origin.includes('herambha')) {    // Custom domain
      return callback(null, true);
    }
    
    // For production, you might want to restrict this further
    return callback(null, true); // Allow all for now
  },
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

console.log('🚀 Attempting to connect to MongoDB...');

// Connect to MongoDB with minimal options
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });

// Define models after connection
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  weight: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  photoURL: { type: String },
  isAdmin: { type: Boolean, default: false },
  addresses: [
    {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      isDefault: { type: Boolean, default: false }
    }
  ],
  wishlist: [
    {
      productId: { type: String, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productWeight: { type: String, required: true },
  productImage: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
  utrNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// API Routes

// Get all products with enhanced filtering and sorting
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      sortBy = 'name', 
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      featured,
      tags
    } = req.query;
    
    // Build filter object
    let filter = {};
    
    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    // Search filter (name or description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Price range filters
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    } else if (featured === 'false') {
      filter.featured = false;
    }
    
    // Tags filter
    if (tags) {
      // If tags is a comma-separated string, convert to array
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagArray };
    }
    
    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price':
        sort.price = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'name':
        sort.name = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'date':
        sort.createdAt = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'featured':
        sort.featured = -1; // Featured items first
        sort.name = 1; // Then sort by name
        break;
      default:
        sort.name = 1;
    }
    
    const products = await Product.find(filter).sort(sort);
    res.json(products.map(product => ({
      id: product.id,
      ...product.toObject()
    })));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const products = await Product.find({ featured: true }).limit(limit);
    res.json(products.map(product => ({
      id: product.id,
      ...product.toObject()
    })));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// Get all unique categories
app.get('/api/products/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (product) {
      res.json({
        id: product.id,
        ...product.toObject()
      });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products.map(product => ({
      id: product.id,
      ...product.toObject()
    })));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
});

// Create a new product (admin only)
app.post('/api/products', async (req, res) => {
  try {
    // Ensure the id field is set
    if (!req.body.id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.json({
      id: savedProduct.id,
      ...savedProduct.toObject()
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update a product (admin only)
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    
    if (updatedProduct) {
      res.json({
        id: updatedProduct.id,
        ...updatedProduct.toObject()
      });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product (admin only)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
    if (deletedProduct) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { uid: req.body.uid },
        { email: req.body.email }
      ]
    });
    
    if (existingUser) {
      // Return existing user if found
      return res.json({
        id: existingUser._id.toString(),
        ...existingUser.toObject()
      });
    }
    
    // Create new user if not exists
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json({
      id: savedUser._id.toString(),
      ...savedUser.toObject()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by UID
app.get('/api/users/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (user) {
      res.json({
        id: user._id.toString(),
        ...user.toObject()
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user wishlist
app.get('/api/users/:uid/wishlist', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (user) {
      res.json({
        id: user._id.toString(),
        wishlist: user.wishlist || []
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch user wishlist' });
  }
});

// Add item to user wishlist
app.post('/api/users/:uid/wishlist', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { productId } = req.body;
    
    // Check if product already exists in wishlist
    const existingItemIndex = user.wishlist.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Product already in wishlist
      return res.status(409).json({ error: 'Product already in wishlist' });
    }

    // Add product to wishlist
    user.wishlist.push({
      productId: productId,
      addedAt: new Date()
    });

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id.toString(),
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
});

// Remove item from user wishlist
app.delete('/api/users/:uid/wishlist/:productId', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const productId = req.params.productId;
    
    // Find item in wishlist
    const itemIndex = user.wishlist.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      // Product not in wishlist
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }

    // Remove product from wishlist
    user.wishlist.splice(itemIndex, 1);
    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id.toString(),
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
});

// Add address to user
app.post('/api/users/:uid/addresses', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check address limit (maximum 4 addresses)
    if (user.addresses.length >= 4) {
      return res.status(400).json({ error: 'Maximum 4 addresses allowed' });
    }

    // If this is the first address or marked as default, set it as default
    const address = {
      ...req.body,
      isDefault: user.addresses.length === 0 ? true : req.body.isDefault || false
    };

    // If this address is marked as default, unset default from other addresses
    if (address.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(address);
    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id.toString(),
      ...updatedUser.toObject()
    });
  } catch (error) {
    console.error('Error adding address to user:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});

// Update user address
app.put('/api/users/:uid/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If this address is marked as default, unset default from other addresses
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...req.body };
    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id.toString(),
      ...updatedUser.toObject()
    });
  } catch (error) {
    console.error('Error updating user address:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete user address
app.delete('/api/users/:uid/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    user.addresses.splice(addressIndex, 1);
    
    // If the deleted address was the default and there are other addresses, set the first one as default
    if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id.toString(),
      ...updatedUser.toObject()
    });
  } catch (error) {
    console.error('Error deleting user address:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Set default address
app.put('/api/users/:uid/addresses/:addressId/default', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Unset default from all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set the selected address as default
    user.addresses[addressIndex].isDefault = true;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id.toString(),
      ...updatedUser.toObject()
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    // Debug: Log the received data
    console.log('Received order data:', req.body);
    
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.json({
      id: savedOrder._id.toString(),
      ...savedOrder.toObject()
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get orders by user ID
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders.map(order => ({
      id: order._id.toString(),
      ...order.toObject()
    })));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders (admin only)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders.map(order => ({
      id: order._id.toString(),
      ...order.toObject()
    })));
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    
    if (updatedOrder) {
      res.json({
        id: updatedOrder._id.toString(),
        ...updatedOrder.toObject()
      });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Update payment status
app.put('/api/orders/:id/payment', async (req, res) => {
  try {
    const { paymentStatus, utrNumber } = req.body;
    const updateData = { paymentStatus };
    if (utrNumber) {
      updateData.utrNumber = utrNumber;
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (updatedOrder) {
      res.json({
        id: updatedOrder._id.toString(),
        ...updatedOrder.toObject()
      });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the server at: http://localhost:${PORT}`);
  console.log(`Access the server on your network at: http://YOUR_IP_ADDRESS:${PORT}`);
});