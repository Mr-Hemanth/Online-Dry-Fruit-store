import { Cashfree } from 'cashfree-pg-sdk-javascript';

// Initialize Cashfree instance
const initCashfree = () => {
  const env = import.meta.env.VITE_CASHFREE_ENVIRONMENT || 'SANDBOX';
  return new Cashfree(env);
};

const cashfree = initCashfree();

/**
 * Create a Cashfree payment session
 * @param {object} orderDetails - Order details including orderId, amount, customerInfo
 * @returns {Promise<object>} Payment session object
 */
export const createCashfreeSession = async (orderDetails) => {
  try {
    const { orderId, amount, customerInfo } = orderDetails;
    
    // Format amount to proper decimal places
    const formattedAmount = parseFloat(amount).toFixed(2);
    
    // Create order object for Cashfree
    const order = {
      order_id: `order_${orderId}`,
      order_amount: formattedAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerInfo.email,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_name: customerInfo.name,
      },
      order_meta: {
        return_url: `${window.location.origin}/payment-success?order_id={order_id}`,
        notify_url: `${window.location.origin}/api/cashfree-webhook`,
      },
    };

    // Create payment session
    const response = await cashfree.createOrder(order);
    return response;
  } catch (error) {
    console.error('Error creating Cashfree session:', error);
    throw new Error('Failed to create payment session');
  }
};

/**
 * Verify Cashfree payment
 * @param {string} orderId - Order ID
 * @returns {Promise<object>} Payment verification result
 */
export const verifyPayment = async (orderId) => {
  try {
    // In a real implementation, you would verify the payment with your backend
    // This is a placeholder for the actual verification logic
    const response = await fetch(`/api/verify-cashfree-payment/${orderId}`);
    return await response.json();
  } catch (error) {
    console.error('Error verifying Cashfree payment:', error);
    throw new Error('Failed to verify payment');
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
  createCashfreeSession,
  verifyPayment,
  formatAmount,
};