// Default factory functions
export const createProduct = (data = {}) => ({
  id: '',
  name: '',
  description: '',
  price: 0,
  weight: '',
  stock: 0,
  imageUrl: '',
  category: '',
  featured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...data
});

export const createCartItem = (product, quantity = 1) => ({
  productId: product.id,
  product,
  quantity
});

export const createCart = () => ({
  items: [],
  total: 0,
  itemCount: 0
});

export const createShippingAddress = (data = {}) => ({
  fullName: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
  ...data
});

export const createPaymentProof = (utrNumber, screenshotUrl = null) => ({
  utrNumber,
  screenshotUrl,
  uploadedAt: new Date().toISOString()
});

export const createOrder = (data = {}) => ({
  id: '',
  userId: '',
  items: [],
  shippingAddress: createShippingAddress(),
  subtotal: 0,
  shippingCharges: 0,
  total: 0,
  status: 'processing', // Use the actual backend status value
  paymentProof: null,
  upiPaymentLink: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  adminNotes: '',
  ...data
});

export const createUser = (data = {}) => ({
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  isAdmin: false,
  createdAt: new Date().toISOString(),
  orders: [],
  ...data
});

export const createStoreSettings = (data = {}) => ({
  id: 'store-settings',
  upiVpa: '',
  merchantName: 'Herambha Dryfruits',
  shippingCharges: 50,
  freeShippingThreshold: 1000,
  bannerImageUrl: '',
  contactEmail: '',
  contactPhone: '',
  whatsappNumber: '',
  storePolicy: {
    returnPolicy: '',
    exchangePolicy: '',
    shippingPolicy: '',
    privacyPolicy: ''
  },
  ...data
});

// Validation helpers
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  return /^[+]?[\d\s\-()]{10,}$/.test(phone);
};

export const validatePincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Generate UPI payment link
export const generateUPILink = (vpa, merchantName, amount, orderId) => {
  const params = new URLSearchParams({
    pa: vpa,
    pn: merchantName,
    am: amount.toString(),
    tn: `Order ${orderId}`,
    cu: 'INR'
  });
  
  return `upi://pay?${params.toString()}`;
};