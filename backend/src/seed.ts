import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Inventory } from './models/Inventory';

dotenv.config();

const testData = [
  {
    description: "55-inch 4K Smart TV",
    manufacturer: "Samsung",
    model: "QN55Q80B",
    serialNumber: "SAMS001TV2023",
    type: "Television",
    owner: "IT Department",
    currentUser: "Conference Room A"
  },
  {
    description: "Professional Video Camera",
    manufacturer: "Sony",
    model: "PXW-Z190",
    serialNumber: "SONY002CAM2023",
    type: "Camera",
    owner: "Media Department",
    currentUser: "John Smith"
  },
  {
    description: "Laptop Computer",
    manufacturer: "Toshiba",
    model: "Dynabook Tecra A50-J",
    serialNumber: "TOSH003LAP2023",
    type: "Computer",
    owner: "IT Department",
    currentUser: "Sarah Johnson"
  },
  {
    description: "Wireless Noise Cancelling Headphones",
    manufacturer: "Sony",
    model: "WH-1000XM4",
    serialNumber: "SONY004HEAD2023",
    type: "Audio Equipment",
    owner: "Media Department",
    currentUser: "Mike Wilson"
  },
  {
    description: "Gaming Console",
    manufacturer: "Sony",
    model: "PlayStation 5",
    serialNumber: "SONY005PS52023",
    type: "Gaming Equipment",
    owner: "Recreation Department",
    currentUser: "Break Room"
  },
  {
    description: "Portable SSD",
    manufacturer: "Samsung",
    model: "T7 Shield 2TB",
    serialNumber: "SAMS006SSD2023",
    type: "Storage Device",
    owner: "IT Department",
    currentUser: "Development Team"
  },
  {
    description: "Multifunction Printer",
    manufacturer: "Toshiba",
    model: "e-STUDIO4518A",
    serialNumber: "TOSH007PRT2023",
    type: "Printer",
    owner: "Office Administration",
    currentUser: "2nd Floor Office"
  },
  {
    description: "Curved Gaming Monitor",
    manufacturer: "Samsung",
    model: "Odyssey G9",
    serialNumber: "SAMS008MON2023",
    type: "Monitor",
    owner: "Design Department",
    currentUser: "Alex Chen"
  },
  {
    description: "Professional Camcorder",
    manufacturer: "Sony",
    model: "FX6",
    serialNumber: "SONY009CAM2023",
    type: "Camera",
    owner: "Media Department",
    currentUser: "Video Production Team"
  },
  {
    description: "Business Laptop",
    manufacturer: "Toshiba",
    model: "Portégé X40-K",
    serialNumber: "TOSH010LAP2023",
    type: "Computer",
    owner: "Sales Department",
    currentUser: "Emma Davis"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Inventory.deleteMany({});
    console.log('Cleared existing inventory data');

    // Insert new data
    await Inventory.insertMany(testData);
    console.log('Successfully seeded the database with test data');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 