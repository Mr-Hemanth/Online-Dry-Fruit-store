// Development seed script that seeds MongoDB with product data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Sample product data
const productsData = [
    {
    id: "badam-normal-250g",
    name: "Badam (Normal)",
    description: "Badam (Normal) - high quality, packed with nutrients.",
    price: 270,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/badam-normal.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal", "almond"]
  },
  {
    id: "badam-normal-500g",
    name: "Badam (Normal)",
    description: "Badam (Normal) - high quality, packed with nutrients.",
    price: 540,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/badam-normal.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal", "almond"]
  },
  {
    id: "badam-normal-1kg",
    name: "Badam (Normal)",
    description: "Badam (Normal) - high quality, packed with nutrients.",
    price: 1080,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/badam-normal.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal", "almond"]
  },
  {
    id: "badam-normal-2kg",
    name: "Badam (Normal)",
    description: "Badam (Normal) - high quality, packed with nutrients.",
    price: 2160,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/badam-normal.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal", "almond"]
  },
  {
    id: "badam-premium-250g",
    name: "Badam (Premium)",
    description: "Badam (Premium) - high quality, packed with nutrients.",
    price: 390,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/badam-premium.jpg",
    category: "Nuts",
    featured: false,
    tags: ["premium", "almond"]
  },
  {
    id: "badam-premium-500g",
    name: "Badam (Premium)",
    description: "Badam (Premium) - high quality, packed with nutrients.",
    price: 780,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/badam-premium.jpg",
    category: "Nuts",
    featured: true,
    tags: ["premium", "almond"]
  },
  {
    id: "badam-premium-1kg",
    name: "Badam (Premium)",
    description: "Badam (Premium) - high quality, packed with nutrients.",
    price: 1560,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/badam-premium.jpg",
    category: "Nuts",
    featured: true,
    tags: ["premium", "almond"]
  },
  {
    id: "badam-premium-2kg",
    name: "Badam (Premium)",
    description: "Badam (Premium) - high quality, packed with nutrients.",
    price: 3120,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/badam-premium.jpg",
    category: "Nuts",
    featured: false,
    tags: ["premium", "almond"]
  },
  {
    id: "akroot-250g",
    name: "Akroot",
    description: "Akroot - high quality, packed with nutrients.",
    price: 540,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/akroot.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "akroot-500g",
    name: "Akroot",
    description: "Akroot - high quality, packed with nutrients.",
    price: 1080,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/akroot.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal"]
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
    id: "akroot-2kg",
    name: "Akroot",
    description: "Akroot - high quality, packed with nutrients.",
    price: 4320,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/akroot.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "anjeer-normal-250g",
    name: "Anjeer (Normal)",
    description: "Anjeer (Normal) - high quality, packed with nutrients.",
    price: 630,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/anjeer-normal.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal", "fig"]
  },
  {
    id: "anjeer-normal-500g",
    name: "Anjeer (Normal)",
    description: "Anjeer (Normal) - high quality, packed with nutrients.",
    price: 1260,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/anjeer-normal.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal", "fig"]
  },
  {
    id: "anjeer-normal-1kg",
    name: "Anjeer (Normal)",
    description: "Anjeer (Normal) - high quality, packed with nutrients.",
    price: 2520,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/anjeer-normal.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal", "fig"]
  },
  {
    id: "anjeer-normal-2kg",
    name: "Anjeer (Normal)",
    description: "Anjeer (Normal) - high quality, packed with nutrients.",
    price: 5040,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/anjeer-normal.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal", "fig"]
  },
  {
    id: "anjeer-premium-250g",
    name: "Anjeer (Premium)",
    description: "Anjeer (Premium) - high quality, packed with nutrients.",
    price: 660,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/anjeer-premium.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["premium", "fig"]
  },
  {
    id: "anjeer-premium-500g",
    name: "Anjeer (Premium)",
    description: "Anjeer (Premium) - high quality, packed with nutrients.",
    price: 1320,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/anjeer-premium.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["premium", "fig"]
  },
  {
    id: "anjeer-premium-1kg",
    name: "Anjeer (Premium)",
    description: "Anjeer (Premium) - high quality, packed with nutrients.",
    price: 2640,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/anjeer-premium.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["premium", "fig"]
  },
  {
    id: "anjeer-premium-2kg",
    name: "Anjeer (Premium)",
    description: "Anjeer (Premium) - high quality, packed with nutrients.",
    price: 5280,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/anjeer-premium.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["premium", "fig"]
  },
  {
    id: "roasted-pista-250g",
    name: "Roasted Pista",
    description: "Roasted Pista - high quality, packed with nutrients.",
    price: 420,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/roasted-pista.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal", "pistachio"]
  },
  {
    id: "roasted-pista-500g",
    name: "Roasted Pista",
    description: "Roasted Pista - high quality, packed with nutrients.",
    price: 840,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/roasted-pista.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal", "pistachio"]
  },
  {
    id: "roasted-pista-1kg",
    name: "Roasted Pista",
    description: "Roasted Pista - high quality, packed with nutrients.",
    price: 1680,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/roasted-pista.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal", "pistachio"]
  },
  {
    id: "roasted-pista-2kg",
    name: "Roasted Pista",
    description: "Roasted Pista - high quality, packed with nutrients.",
    price: 3360,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/roasted-pista.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal", "pistachio"]
  },
  {
    id: "kismis-250g",
    name: "Kismis",
    description: "Kismis - high quality, packed with nutrients.",
    price: 330,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/kismis.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal", "raisins"]
  },
  {
    id: "kismis-500g",
    name: "Kismis",
    description: "Kismis - high quality, packed with nutrients.",
    price: 660,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/kismis.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal", "raisins"]
  },
  {
    id: "kismis-1kg",
    name: "Kismis",
    description: "Kismis - high quality, packed with nutrients.",
    price: 1320,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/kismis.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal", "raisins"]
  },
  {
    id: "kismis-2kg",
    name: "Kismis",
    description: "Kismis - high quality, packed with nutrients.",
    price: 2640,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/kismis.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal", "raisins"]
  },
  {
    id: "kaju---gullu-250g",
    name: "Kaju / Gullu",
    description: "Kaju / Gullu - high quality, packed with nutrients.",
    price: 375,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/kaju---gullu.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal", "cashew"]
  },
  {
    id: "kaju---gullu-500g",
    name: "Kaju / Gullu",
    description: "Kaju / Gullu - high quality, packed with nutrients.",
    price: 750,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/kaju---gullu.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal", "cashew"]
  },
  {
    id: "kaju---gullu-1kg",
    name: "Kaju / Gullu",
    description: "Kaju / Gullu - high quality, packed with nutrients.",
    price: 1500,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/kaju---gullu.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal", "cashew"]
  },
  {
    id: "kaju---gullu-2kg",
    name: "Kaju / Gullu",
    description: "Kaju / Gullu - high quality, packed with nutrients.",
    price: 3000,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/kaju---gullu.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal", "cashew"]
  },
  {
    id: "pecans-250g",
    name: "Pecans",
    description: "Pecans - high quality, packed with nutrients.",
    price: 990,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/pecans.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "pecans-500g",
    name: "Pecans",
    description: "Pecans - high quality, packed with nutrients.",
    price: 1980,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/pecans.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal"]
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
    featured: true,
    tags: ["normal"]
  },
  {
    id: "pecans-2kg",
    name: "Pecans",
    description: "Pecans - high quality, packed with nutrients.",
    price: 7920,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/pecans.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "macadamia-250g",
    name: "Macadamia",
    description: "Macadamia - high quality, packed with nutrients.",
    price: 1260,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/macadamia.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "macadamia-500g",
    name: "Macadamia",
    description: "Macadamia - high quality, packed with nutrients.",
    price: 2520,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/macadamia.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal"]
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
    featured: true,
    tags: ["normal"]
  },
  {
    id: "macadamia-2kg",
    name: "Macadamia",
    description: "Macadamia - high quality, packed with nutrients.",
    price: 10080,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/macadamia.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "brazil-nuts-250g",
    name: "Brazil Nuts",
    description: "Brazil Nuts - high quality, packed with nutrients.",
    price: 960,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/brazil-nuts.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "brazil-nuts-500g",
    name: "Brazil Nuts",
    description: "Brazil Nuts - high quality, packed with nutrients.",
    price: 1920,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/brazil-nuts.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "brazil-nuts-1kg",
    name: "Brazil Nuts",
    description: "Brazil Nuts - high quality, packed with nutrients.",
    price: 3840,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/brazil-nuts.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "brazil-nuts-2kg",
    name: "Brazil Nuts",
    description: "Brazil Nuts - high quality, packed with nutrients.",
    price: 7680,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/brazil-nuts.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "black-berrys-250g",
    name: "Black Berrys",
    description: "Black Berrys - high quality, packed with nutrients.",
    price: 720,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/black-berrys.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "black-berrys-500g",
    name: "Black Berrys",
    description: "Black Berrys - high quality, packed with nutrients.",
    price: 1440,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/black-berrys.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "black-berrys-1kg",
    name: "Black Berrys",
    description: "Black Berrys - high quality, packed with nutrients.",
    price: 2880,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/black-berrys.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "black-berrys-2kg",
    name: "Black Berrys",
    description: "Black Berrys - high quality, packed with nutrients.",
    price: 5760,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/black-berrys.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "blue-berrys-250g",
    name: "Blue Berrys",
    description: "Blue Berrys - high quality, packed with nutrients.",
    price: 960,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/blue-berrys.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "blue-berrys-500g",
    name: "Blue Berrys",
    description: "Blue Berrys - high quality, packed with nutrients.",
    price: 1920,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/blue-berrys.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "blue-berrys-1kg",
    name: "Blue Berrys",
    description: "Blue Berrys - high quality, packed with nutrients.",
    price: 3840,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/blue-berrys.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "blue-berrys-2kg",
    name: "Blue Berrys",
    description: "Blue Berrys - high quality, packed with nutrients.",
    price: 7680,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/blue-berrys.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "cran-berry-250g",
    name: "Cran Berry",
    description: "Cran Berry - high quality, packed with nutrients.",
    price: 540,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/cran-berry.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "cran-berry-500g",
    name: "Cran Berry",
    description: "Cran Berry - high quality, packed with nutrients.",
    price: 1080,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/cran-berry.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "cran-berry-1kg",
    name: "Cran Berry",
    description: "Cran Berry - high quality, packed with nutrients.",
    price: 2160,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/cran-berry.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "cran-berry-2kg",
    name: "Cran Berry",
    description: "Cran Berry - high quality, packed with nutrients.",
    price: 4320,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/cran-berry.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "apricot-250g",
    name: "Apricot",
    description: "Apricot - high quality, packed with nutrients.",
    price: 600,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/apricot.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "apricot-500g",
    name: "Apricot",
    description: "Apricot - high quality, packed with nutrients.",
    price: 1200,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/apricot.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "apricot-1kg",
    name: "Apricot",
    description: "Apricot - high quality, packed with nutrients.",
    price: 2400,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/apricot.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "apricot-2kg",
    name: "Apricot",
    description: "Apricot - high quality, packed with nutrients.",
    price: 4800,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/apricot.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "himalayan-garlic-250g",
    name: "Himalayan Garlic",
    description: "Himalayan Garlic - high quality, packed with nutrients.",
    price: 600,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/himalayan-garlic.jpg",
    category: "Spices",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "himalayan-garlic-500g",
    name: "Himalayan Garlic",
    description: "Himalayan Garlic - high quality, packed with nutrients.",
    price: 1200,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/himalayan-garlic.jpg",
    category: "Spices",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "himalayan-garlic-1kg",
    name: "Himalayan Garlic",
    description: "Himalayan Garlic - high quality, packed with nutrients.",
    price: 2400,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/himalayan-garlic.jpg",
    category: "Spices",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "himalayan-garlic-2kg",
    name: "Himalayan Garlic",
    description: "Himalayan Garlic - high quality, packed with nutrients.",
    price: 4800,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/himalayan-garlic.jpg",
    category: "Spices",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "dry-khajoor-250g",
    name: "Dry Khajoor",
    description: "Dry Khajoor - high quality, packed with nutrients.",
    price: 180,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/dry-khajoor.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "dry-khajoor-500g",
    name: "Dry Khajoor",
    description: "Dry Khajoor - high quality, packed with nutrients.",
    price: 360,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/dry-khajoor.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "dry-khajoor-1kg",
    name: "Dry Khajoor",
    description: "Dry Khajoor - high quality, packed with nutrients.",
    price: 720,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/dry-khajoor.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "dry-khajoor-2kg",
    name: "Dry Khajoor",
    description: "Dry Khajoor - high quality, packed with nutrients.",
    price: 1440,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/dry-khajoor.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "prunes-250g",
    name: "Prunes",
    description: "Prunes - high quality, packed with nutrients.",
    price: 480,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/prunes.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "prunes-500g",
    name: "Prunes",
    description: "Prunes - high quality, packed with nutrients.",
    price: 960,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/prunes.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "prunes-1kg",
    name: "Prunes",
    description: "Prunes - high quality, packed with nutrients.",
    price: 1920,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/prunes.jpg",
    category: "Dried Fruits",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "prunes-2kg",
    name: "Prunes",
    description: "Prunes - high quality, packed with nutrients.",
    price: 3840,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/prunes.jpg",
    category: "Dried Fruits",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "hazelnuts-250g",
    name: "Hazelnuts",
    description: "Hazelnuts - high quality, packed with nutrients.",
    price: 870,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/hazelnuts.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "hazelnuts-500g",
    name: "Hazelnuts",
    description: "Hazelnuts - high quality, packed with nutrients.",
    price: 1740,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/hazelnuts.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "hazelnuts-1kg",
    name: "Hazelnuts",
    description: "Hazelnuts - high quality, packed with nutrients.",
    price: 3480,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/hazelnuts.jpg",
    category: "Nuts",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "hazelnuts-2kg",
    name: "Hazelnuts",
    description: "Hazelnuts - high quality, packed with nutrients.",
    price: 6960,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/hazelnuts.jpg",
    category: "Nuts",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "chia-seeds-250g",
    name: "Chia Seeds",
    description: "Chia Seeds - high quality, packed with nutrients.",
    price: 600,
    weight: "250g",
    stock: 30,
    imageUrl: "/images/chia-seeds.jpg",
    category: "Seeds",
    featured: false,
    tags: ["normal"]
  },
  {
    id: "chia-seeds-500g",
    name: "Chia Seeds",
    description: "Chia Seeds - high quality, packed with nutrients.",
    price: 1200,
    weight: "500g",
    stock: 30,
    imageUrl: "/images/chia-seeds.jpg",
    category: "Seeds",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "chia-seeds-1kg",
    name: "Chia Seeds",
    description: "Chia Seeds - high quality, packed with nutrients.",
    price: 2400,
    weight: "1kg",
    stock: 30,
    imageUrl: "/images/chia-seeds.jpg",
    category: "Seeds",
    featured: true,
    tags: ["normal"]
  },
  {
    id: "chia-seeds-2kg",
    name: "Chia Seeds",
    description: "Chia Seeds - high quality, packed with nutrients.",
    price: 4800,
    weight: "2kg",
    stock: 30,
    imageUrl: "/images/chia-seeds.jpg",
    category: "Seeds",
    featured: false,
    tags: ["normal"]
  }
];

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Define product schema
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
    
    const Product = mongoose.model('Product', productSchema);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const result = await Product.insertMany(productsData);
    console.log(`Seeded ${result.length} products successfully`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });