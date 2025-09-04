import mongoose from 'mongoose';

// Frontend should not directly connect to MongoDB in production
// This is just a fallback for development
// In production, all database operations should go through the API
const MONGODB_URI = "mongodb://localhost:27017/herambha_dryfruits"; // Local fallback only

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // In a proper frontend app, this function should not be used
  // All database operations should go through the backend API
  console.warn('⚠️  Frontend attempting direct database connection. This should only happen in development.');
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Add error handling for the connection
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Frontend connected to local MongoDB (development only)');
      return mongoose;
    }).catch((error) => {
      console.error('❌ Frontend failed to connect to local MongoDB:', error);
      // Don't throw error - frontend should work even without direct DB access
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Error in frontend MongoDB connection:', e);
    return null;
  }

  return cached.conn;
}

export default connectToDatabase;