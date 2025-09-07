import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: import.meta.env.VITE_RAZORPAY_KEY_ID,
  key_secret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in paise (₹1 = 100 paise)
 * @param {string} currency - Currency code (INR for Indian Rupees)
 * @param {object} receipt - Order receipt details
 * @returns {Promise<object>} Razorpay order object
 */
export const createRazorpayOrder = async (amount, currency = 'INR', receipt = {}) => {
  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt.orderId || `order_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} razorpayOrderId - Razorpay order ID
 * @param {string} razorpayPaymentId - Razorpay payment ID
 * @param {string} razorpaySignature - Razorpay signature
 * @returns {boolean} Whether signature is valid
 */
export const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const shasum = crypto.createHmac('sha256', import.meta.env.VITE_RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');
    return digest === razorpaySignature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

/**
 * Format amount for display
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted amount string
 */
export const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export default {
  createRazorpayOrder,
  verifyPaymentSignature,
  formatAmount,
};