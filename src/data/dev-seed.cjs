// Development seed script that seeds MongoDB with product data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Sample product data - mixed weights to test the weight selection feature
const productsData = [
  {
    id: "badam-normal-1kg",
    name: "Badam (Normal)",
    description: "Badam (Normal) - high quality, packed with nutrients.",
    price: 1080,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/badam.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal", "almond"]
  },
  {
    id: "badam-premium-1kg",
    name: "Badam (Premium)",
    description: "Badam (Premium) - high quality, packed with nutrients.",
    price: 1560,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/badam.jpg",
    category: "Nuts",
    featured: true,
    tags: ["premium", "almond"]
  },
  {
    id: "akroot-1kg",
    name: "Akroot",
    description: "Akroot - high quality, packed with nutrients.",
    price: 2160,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/akroot.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "anjeer-normal-1kg",
    name: "Anjeer (Normal)",
    description: "Anjeer (Normal) - high quality, packed with nutrients.",
    price: 2520,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/anjeer.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal", "fig"]
  },
  {
    id: "anjeer-premium-1kg",
    name: "Anjeer (Premium)",
    description: "Anjeer (Premium) - high quality, packed with nutrients.",
    price: 2640,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/anjeer.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["Premium", "fig"]
  },
  {
    id: "apricot-1kg",
    name: "Apricot",
    description: "Apricot - high quality, packed with nutrients.",
    price: 1200,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/apricot.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "black-berry-1kg",
    name: "Black Berry",
    description: "Black Berry - high quality, packed with nutrients.",
    price: 1440,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/black-berrys.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "blue-berry-1kg",
    name: "Blue Berry",
    description: "Blue Berry - high quality, packed with nutrients.",
    price: 1920,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/blue-berrys.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["premium"]
  },
  {
    id: "brazil-nut-1kg",
    name: "Brazil Nut",
    description: "Brazil Nut - high quality, packed with nutrients.",
    price: 3840,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/brazil-nuts.jpg",
    category: "Nuts",
    featured: false,
    tags: ["premium"]
  },
  {
    id: "chia-seeds-1kg",
    name: "Chia Seeds",
    description: "Chia Seeds - high quality, packed with nutrients.",
    price: 1200,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/chia-seeds.jpg",
    category: "Seeds",
    featured: false,
    tags: ["healthy"]
  },
  {
    id: "cran-berry-1kg",
    name: "Cran Berry",
    description: "Cran Berry - high quality, packed with nutrients.",
    price: 1080,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/cran-berry.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "dry-khajoor(normal)-1kg",
    name: "Dry Khajoor (Normal)",
    description: "Dry Khajoor - high quality, packed with nutrients.",
    price: 600,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/dry-khajoor.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "dry-khajoor(premium)-1kg",
    name: "Dry Khajoor (Premium)",
    description: "Dry Khajoor (Premium) - high quality, packed with nutrients.",
    price: 720,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/dry-khajoor.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["premium","dates"]
  },
  {
    id: "hazelnuts-1kg",
    name: "Hazelnuts",
    description: "Hazelnuts - high quality, packed with nutrients.",
    price: 1740,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/hazelnuts.jpg",
    category: "Nuts",
    featured: false,
    tags: ["premium"]
  },
  {
    id: "himalayan-garlic-1kg",
    name: "Himalayan Garlic",
    description: "Himalayan Garlic - high quality, packed with nutrients.",
    price: 2400,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/himalayan-garlic.jpg",
    category: "Specialty",
    featured: false,
    tags: ["organic"]
  },
  {
    id: "kaju-1kg",
    name: "Kaju ",
    description: "Kaju - high quality, packed with nutrients.",
    price: 1320,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/kaju.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "gullu-1kg",
    name: "Gullu ",
    description: "Gullu  - high quality, packed with nutrients.",
    price: 1500,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/kaju.jpg",
    category: "Nuts",
    featured: true,
    tags: ["premium"]
  },
  {
    id: "kismis-(normal)1kg",
    name: "Kismis (Normal)",
    description: "Kismis - high quality, packed with nutrients.",
    price: 720,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/kismis.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "kismis-(Premium)1kg",
    name: "Kismis (Premium)",
    description: "Kismis (Premium) - high quality, packed with nutrients.",
    price: 1320,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/kismis.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["premium"]
  },
  {
    id: "macadamia-1kg",
    name: "Macadamia",
    description: "Macadamia - high quality, packed with nutrients.",
    price: 5040,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/macadamia.jpg",
    category: "Nuts",
    featured: false,
    tags: ["premium"]
  },
  {
    id: "pecans-1kg",
    name: "Pecans",
    description: "Pecans - high quality, packed with nutrients.",
    price: 3960,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/pecans.jpg",
    category: "Nuts",
    featured: false,
    tags: ["premium"]
  },
  {
    id: "prunes-1kg",
    name: "Prunes",
    description: "Prunes - high quality, packed with nutrients.",
    price: 960,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/prunes.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "roasted-pista-1kg",
    name: "Roasted Pista",
    description: "Roasted Pista - high quality, packed with nutrients.",
    price: 1680,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/roasted-pista.jpg",
    category: "Nuts",
    featured: true,
    tags: ["premium"]
  },
  // Products with 500g as base weight for testing fallback
  {
    id: "special-mix-500g",
    name: "Special Dry Fruit Mix",
    description: "A special mix of premium dry fruits in a convenient 500g pack.",
    price: 750,
    weight: "500g",
    stock: 25,
    imageUrl: "/images/mix.jpg",
    category: "Mixed",
    featured: true,
    tags: ["special", "mix"]
  },
  {
    id: "gift-pack-500g",
    name: "Gift Pack Assorted",
    description: "Assorted dry fruits gift pack in a 500g package.",
    price: 850,
    weight: "500g",
    stock: 20,
    imageUrl: "/images/gift-pack.jpg",
    category: "Gift Packs",
    featured: false,
    tags: ["gift", "assorted"]
  }
];

// Product schema
const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  weight: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

console.log('🚀 Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB');
    
    // Create Product model
    const Product = mongoose.model('Product', productSchema);
    
    try {
      // Clear existing products
      await Product.deleteMany({});
      console.log('🗑️  Cleared existing products');
      
      // Insert new products
      const result = await Product.insertMany(productsData);
      console.log(`✅ Successfully seeded ${result.length} products`);
      
      // Close connection
      await mongoose.connection.close();
      console.log('🔌 Disconnected from MongoDB');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error seeding products:', error);
      await mongoose.connection.close();
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });