import { API_BASE_URL } from '../config/apiConfig';

// We'll load the products data dynamically instead of importing it directly
let productsData = null;

const loadProductsData = async () => {
  if (productsData) return productsData;
  
  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) {
      throw new Error('Failed to fetch product data');
    }
    productsData = await response.json();
    return productsData;
  } catch (error) {
    console.error('Error loading products data:', error);
    return [];
  }
};

export const mongoProductService = {
  // Get all products with enhanced filtering and sorting
  async getAllProducts(filters = {}) {
    try {
      const {
        category,
        search,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
        featured,
        tags
      } = filters;
      
      // Build query parameters
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (featured !== undefined) params.append('featured', featured);
      if (tags) params.append('tags', Array.isArray(tags) ? tags.join(',') : tags);
      
      const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('Error fetching products from API, using local data:', error);
      const localData = await loadProductsData();
      return localData;
    }
  },

  // Get featured products from API or fallback to local data
  async getFeaturedProducts(limit = 6) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('Error fetching featured products from API, using local data:', error);
      const localData = await loadProductsData();
      return localData.filter(product => product.featured).slice(0, limit);
    }
  },

  // Get product by ID from API or fallback to local data
  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Fallback to local data
          const localData = await loadProductsData();
          return localData.find(product => product.id === id);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const product = await response.json();
      return product;
    } catch (error) {
      console.error('Error fetching product by ID from API, using local data:', error);
      const localData = await loadProductsData();
      return localData.find(product => product.id === id);
    }
  },

  // Get products by category from API or fallback to local data
  async getProductsByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('Error fetching products by category from API, using local data:', error);
      const localData = await loadProductsData();
      return localData.filter(product => product.category === category);
    }
  },

  // Get all unique categories
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error('Error fetching categories from API:', error);
      // Fallback to extracting categories from local data
      const localData = await loadProductsData();
      const categories = [...new Set(localData.map(product => product.category))];
      return categories;
    }
  },

  // Create a new product via API
  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const product = await response.json();
      return product;
    } catch (error) {
      console.error('Error creating product via API:', error);
      throw error;
    }
  },

  // Update a product via API
  async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const product = await response.json();
      return product;
    } catch (error) {
      console.error('Error updating product via API:', error);
      throw error;
    }
  },

  // Delete a product via API
  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting product via API:', error);
      throw error;
    }
  }
};