import React, { createContext, useEffect, useState } from 'react';
import { mongoAuthService } from '../services/mongoAuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      // Check if credentials match admin credentials (using direct values to avoid process is not defined error)
      const isAdmin = email === 'admin@admin.com' && password === 'admin123456';
      
      // Create user object with consistent UID for admin
      const userData = {
        uid: isAdmin ? 'admin-user' : `user-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        isAdmin
      };
      
      // Save user to MongoDB
      const userDoc = await mongoAuthService.createUserDocument(userData);
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(userDoc));
      
      setUser(userDoc);
      return { user: userDoc };
    } catch (error) {
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, displayName) => {
    setLoading(true);
    try {
      // Create user object (using direct value to avoid process is not defined error)
      const userData = {
        uid: `user-${Date.now()}`,
        email,
        displayName,
        isAdmin: email === 'admin@admin.com'
      };
      
      // Save user to MongoDB
      const userDoc = await mongoAuthService.createUserDocument(userData);
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(userDoc));
      
      setUser(userDoc);
      return { user: userDoc };
    } catch (error) {
      throw new Error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
      // Remove user from localStorage
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;