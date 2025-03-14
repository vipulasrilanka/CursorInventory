export interface InventoryItem {
  _id?: string;
  description: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  type: string;
  addedTime: Date;
  owner: string;
  currentUser: string;
} 