import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  description: { type: String, required: true },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true },
  type: { type: String, required: true },
  owner: { type: String, required: true },
  currentUser: { type: String, required: true },
  status: { type: String, required: true },
  addedTime: { type: Date, default: Date.now }
});

// Create compound unique index for serial number and type
inventorySchema.index({ serialNumber: 1, type: 1 }, { unique: true });

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

// Delete the model if it exists (for testing purposes)
const modelName = 'Inventory';
export const Inventory = mongoose.models[modelName] || mongoose.model(modelName, inventorySchema); 