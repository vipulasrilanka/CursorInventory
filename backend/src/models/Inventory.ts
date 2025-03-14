import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  description: { type: String, required: true },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  addedTime: { type: Date, default: Date.now },
  owner: { type: String, required: true },
  currentUser: { type: String, required: true }
});

// Create text index for full-text search
inventorySchema.index({
  description: 'text',
  manufacturer: 'text',
  model: 'text',
  serialNumber: 'text',
  type: 'text',
  owner: 'text',
  currentUser: 'text'
});

export const Inventory = mongoose.model('Inventory', inventorySchema); 