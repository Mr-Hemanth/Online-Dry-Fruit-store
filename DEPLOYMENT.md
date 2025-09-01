# Deployment Guide

This guide explains how to deploy the Herambha Dryfruits e-commerce web application to hosting platforms like Vercel or Netlify.

## Prerequisites

1. Ensure your MongoDB database is accessible from the internet (not localhost)
2. Have your MongoDB connection string ready
3. Prepare your environment variables

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string

# Store UPI ID for payments
STORE_UPI_ID=your_upi_id@upi

# API URL for frontend (when deployed)
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up/log in to [Vercel](https://vercel.com/)
3. Click "New Project" and import your repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add environment variables in the "Environment Variables" section
6. Deploy!

## Deploying to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up/log in to [Netlify](https://netlify.com/)
3. Click "New site from Git" and select your repository
4. Configure the project:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in the "Environment" section
6. Deploy!

## Backend Deployment

Since this is a full-stack application, you'll also need to deploy the backend API server:

### Option 1: Deploy to a VPS (Recommended)
1. Get a VPS from providers like DigitalOcean, AWS, or Google Cloud
2. Install Node.js and MongoDB
3. Clone your repository
4. Set up environment variables
5. Run the server with `node server.js`

### Option 2: Deploy to Platform-as-a-Service
- **Railway.app**: Easy deployment with MongoDB integration
- **Render**: Good free tier for small applications
- **Heroku**: Popular but has limitations on free tier

## Important Notes

1. **CORS Configuration**: The server is already configured to allow requests from Vercel and Netlify domains
2. **API URL**: The frontend automatically detects the API URL based on the environment
3. **Database**: Make sure your MongoDB instance is accessible from the internet
4. **Security**: Never expose your MongoDB connection string or other sensitive information in client-side code

## Testing After Deployment

1. Visit your deployed frontend URL
2. Try to place an order from different devices
3. Check if orders appear in the admin dashboard
4. Verify that all CRUD operations work correctly

## Troubleshooting

1. **CORS Errors**: Make sure your server's CORS configuration allows requests from your frontend domain
2. **API Connection Issues**: Verify that your MongoDB connection string is correct and the database is accessible
3. **Environment Variables**: Ensure all required environment variables are set correctly
4. **Build Errors**: Check that all dependencies are properly installed

## Support

If you encounter any issues during deployment, please check the console logs for error messages and ensure all configuration steps have been followed correctly.