import { API_BASE_URL } from '../config/apiConfig';

export const mongoOrderService = {
  // Create a new order via API
  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating order via API:', error);
      throw error;
    }
  },

  // Get orders by user ID from API
  async getOrdersByUserId(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error('Error fetching orders from API:', error);
      throw error;
    }
  },

  // Get all orders from API (for admin)
  async getAllOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error('Error fetching all orders from API:', error);
      throw error;
    }
  },

  // Update order status via API
  async updateOrderStatus(orderId, orderStatus) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error updating order status via API:', error);
      throw error;
    }
  },

  // Update payment status via API
  async updatePaymentStatus(orderId, paymentStatus, utrNumber = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus, utrNumber }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error updating payment status via API:', error);
      throw error;
    }
  }
};