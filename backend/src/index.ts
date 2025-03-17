import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import inventoryRoutes from './routes/inventory';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);

export async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory');
    console.log('Connected to MongoDB');

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    return server;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
} 