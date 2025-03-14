import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Inventory } from './models/Inventory';
import { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with specific options
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/inventory', async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message || 'Error creating inventory item' });
  }
});

app.get('/api/inventory/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      const items = await Inventory.find().sort({ addedTime: -1 });
      return res.json(items);
    }

    // Create a case-insensitive regex pattern for partial word matching
    const searchRegex = new RegExp(query as string, 'i');
    
    const items = await Inventory.find({
      $or: [
        { description: searchRegex },
        { manufacturer: searchRegex },
        { model: searchRegex },
        { serialNumber: searchRegex },
        { type: searchRegex },
        { owner: searchRegex },
        { currentUser: searchRegex }
      ]
    }).sort({ addedTime: -1 });
    
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Error searching inventory' });
  }
});

// Add PUT endpoint for updating inventory items
app.put('/api/inventory/:id', async (req: Request, res: Response) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message || 'Error updating inventory item' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 