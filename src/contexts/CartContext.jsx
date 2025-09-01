import React, { createContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], itemCount: 0, total: 0 });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        // Reset cart if there's an error
        setCart({ items: [], itemCount: 0, total: 0 });
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.items.findIndex(item => item.productId === product.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new product to cart
        updatedItems = [
          ...prevCart.items,
          {
            productId: product.id,
            product: product,
            quantity: quantity
          }
        ];
      }

      // Calculate new totals
      const newItemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
      const newTotal = updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

      return {
        items: updatedItems,
        itemCount: newItemCount,
        total: parseFloat(newTotal.toFixed(2))
      };
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );

      // Calculate new totals
      const newItemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
      const newTotal = updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

      return {
        items: updatedItems,
        itemCount: newItemCount,
        total: parseFloat(newTotal.toFixed(2))
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.productId !== productId);

      // Calculate new totals
      const newItemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
      const newTotal = updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

      return {
        items: updatedItems,
        itemCount: newItemCount,
        total: parseFloat(newTotal.toFixed(2))
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], itemCount: 0, total: 0 });
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;