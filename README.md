# Herambha Dryfruits - E-commerce Application

A full-stack e-commerce website for selling dry fruits online, built with React, Vite, Chakra UI, and MongoDB.

## Features

- **Frontend**: React with Vite, JavaScript, Chakra UI
- **Backend**: MongoDB with Mongoose ODM
- **Authentication**: Custom authentication with MongoDB
- **Payment System**: UPI QR payment flow with UTR verification
- **Admin Panel**: Complete admin dashboard for product and order management
- **Responsive Design**: Mobile-first responsive design with Chakra UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd herambha_dryfruits
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Install MongoDB locally or use a cloud service like MongoDB Atlas
   - Create a database named `herambha_dryfruits`

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the MongoDB connection string:
     ```
     MONGODB_URI=mongodb://localhost:27017/herambha_dryfruits
     ```
   - Update other configuration variables as needed

5. Seed the database with initial product data:
   ```bash
   npm run seed
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

## MongoDB Schema

### Product Schema
- `name`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `weight`: String (required)
- `stock`: Number (required)
- `imageUrl`: String (required)
- `category`: String (required)
- `featured`: Boolean (default: false)
- `createdAt`: Date (default: current date)

### User Schema
- `uid`: String (required, unique)
- `email`: String (required, unique)
- `displayName`: String (required)
- `photoURL`: String
- `isAdmin`: Boolean (default: false)
- `orders`: Array of Order references
- `createdAt`: Date (default: current date)

### Order Schema
- `userId`: String (required)
- `userEmail`: String (required)
- `items`: Array of order items
- `totalAmount`: Number (required)
- `customerInfo`: Object (required)
- `paymentMethod`: String (required)
- `paymentStatus`: String (enum: pending, completed, failed)
- `orderStatus`: String (enum: processing, shipped, delivered, cancelled)
- `utrNumber`: String
- `createdAt`: Date (default: current date)

## Admin Access

To access the admin panel:
- Email: admin@admin.com
- Password: admin123456

## Payment System

The application uses a UPI payment system:
1. Customers place orders and receive a UPI QR code
2. Customers make payment using any UPI app
3. Customers enter the UTR number to verify payment
4. Admins can update order and payment status from the admin panel

## Development

### Folder Structure
```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── data/           # Static data files
├── lib/            # Database and service configurations
├── models/         # MongoDB models
├── pages/          # Page components
├── services/       # Business logic and database services
└── utils/          # Utility functions
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run seed`: Seed database with initial data

## Troubleshooting

If you encounter any issues:

1. **Database Connection Errors**: 
   - Ensure MongoDB is running
   - Check your MONGODB_URI in the .env file
   - Verify network connectivity to your MongoDB instance

2. **Missing Data**: 
   - Run `npm run seed` to populate the database with initial product data
   - Check that the seeding script completed successfully

3. **Admin Access Issues**: 
   - Ensure you're using the correct admin credentials
   - Check that the user was created with admin privileges

4. **Payment Verification Issues**: 
   - Verify that the UTR number is exactly 12 digits
   - Check that the payment amount matches the order total

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.