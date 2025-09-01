import React, { createContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing saved wishlist:', error);
        // Reset wishlist if there's an error
        setWishlist([]);
      }
    }
    setLoading(false);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add item to wishlist
  const addToWishlist = async (product, user = null) => {
    // Check if product already exists in wishlist
    const existingItemIndex = wishlist.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Product already in wishlist
      return false;
    }

    const newItem = {
      productId: product.id,
      product: product,
      addedAt: new Date().toISOString()
    };

    setWishlist(prevWishlist => [...prevWishlist, newItem]);

    // If user is logged in, save to database
    if (user) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.uid}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id }),
        });
        
        if (!response.ok) {
          // If there's an error, remove the item from the local wishlist
          setWishlist(prevWishlist => prevWishlist.filter(item => item.productId !== product.id));
          throw new Error('Failed to save wishlist to database');
        }
      } catch (error) {
        console.error('Error saving wishlist to database:', error);
        // If there's an error, remove the item from the local wishlist
        setWishlist(prevWishlist => prevWishlist.filter(item => item.productId !== product.id));
      }
    }

    return true;
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId, user = null) => {
    // First, remove from local state
    setWishlist(prevWishlist => prevWishlist.filter(item => item.productId !== productId));

    // If user is logged in, remove from database
    if (user) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.uid}/wishlist/${productId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          // If the item is not found in the wishlist (404), it's already removed, so we don't need to do anything
          if (response.status === 404) {
            console.log('Product not found in wishlist, already removed');
            return;
          }
          
          // For other errors, add the item back to the local wishlist
          setWishlist(prevWishlist => {
            const itemToAddBack = prevWishlist.find(item => item.productId === productId);
            if (itemToAddBack) {
              return [...prevWishlist, itemToAddBack];
            }
            return prevWishlist;
          });
          throw new Error('Failed to remove item from wishlist in database');
        }
      } catch (error) {
        console.error('Error removing item from wishlist in database:', error);
        // If there's an error, add the item back to the local wishlist
        setWishlist(prevWishlist => {
          const itemToAddBack = prevWishlist.find(item => item.productId === productId);
          if (itemToAddBack) {
            return [...prevWishlist, itemToAddBack];
          }
          return prevWishlist;
        });
      }
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };

  // Load wishlist from database for logged-in user
  const loadWishlistFromDatabase = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/wishlist`);
      if (response.ok) {
        const userData = await response.json();
        // Convert wishlist items to the format we use in context
        const wishlistItems = userData.wishlist.map(item => ({
          productId: item.productId,
          addedAt: item.addedAt
        }));
        setWishlist(wishlistItems);
      }
    } catch (error) {
      console.error('Error loading wishlist from database:', error);
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    loadWishlistFromDatabase
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;