// Detect if we're running in development or production
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.startsWith('192.168.') ||
                     window.location.hostname === '[::1]' ||
                     window.location.hostname.includes('local');

// Set API base URL based on environment
// In development, use the same hostname as the frontend
// In production, you'll need to set your actual API domain
const API_BASE_URL = isDevelopment 
  ? `http://${window.location.hostname}:3001/api`
  : 'http://192.168.1.109:3001/api'; // Default to your server IP, but should be overridden in production

export { API_BASE_URL };