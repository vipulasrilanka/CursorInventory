import express from 'express';
import { Inventory } from '../models/Inventory';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { description, manufacturer, model, serialNumber, type, owner, currentUser, status } = req.body;
    
    // Check if an item with the same serial number and type already exists
    const existingItem = await Inventory.findOne({ serialNumber, type });
    if (existingItem) {
      return res.status(400).json({ message: 'Item with same serial number and type already exists' });
    }

    const newItem = new Inventory({
      description,
      manufacturer,
      model,
      serialNumber,
      type,
      owner,
      currentUser,
      status
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if ((error as any).code === 11000) {
      return res.status(400).json({ message: 'Item with same serial number and type already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(500).json({ message: 'Invalid ID format' });
    }

    const { description, manufacturer, model, serialNumber, type, owner, currentUser, status } = req.body;
    const { id } = req.params;

    // Check if updating would create a duplicate
    const existingItem = await Inventory.findOne({
      _id: { $ne: id },
      serialNumber,
      type
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Item with same serial number and type already exists' });
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      {
        description,
        manufacturer,
        model,
        serialNumber,
        type,
        owner,
        currentUser,
        status
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if ((error as any).code === 11000) {
      return res.status(400).json({ message: 'Item with same serial number and type already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
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

export default router; 