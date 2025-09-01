import { API_BASE_URL } from '../config/apiConfig';

class MongoAuthService {
  // Create or update user document
  async createUserDocument(user) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const userDoc = await response.json();
      return userDoc;
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  // Get user document
  async getUserDocument(uid) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}`);
      if (!response.ok) {
        if (response.status === 404) {
          // User not found is not an error in this context, just return null
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const user = await response.json();
      return user;
    } catch (error) {
      // Log the error but don't throw it for 404s in this context
      if (error.message && error.message.includes('HTTP error! status: 404')) {
        // User not found is not an error in this context, just return null
        return null;
      }
      console.error('Error fetching user document:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const mongoAuthService = new MongoAuthService();
export default mongoAuthService;