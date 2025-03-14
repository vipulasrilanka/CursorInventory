# Inventory Management System

A simple inventory management system built with React, Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or accessible MongoDB instance)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   - Copy the `.env` file in the backend directory
   - Update MongoDB URI if needed

## Running the Application

1. Start MongoDB locally (if using local instance)

2. Start the backend:
```bash
cd backend
npm start
```

3. Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Features

- Add new inventory items with detailed information
- Full-text search across all inventory fields
- Real-time search results
- Responsive Material-UI design

## Tech Stack

- Frontend:
  - React with TypeScript
  - Material-UI
  - Axios for API calls
  - Vite for build tooling

- Backend:
  - Node.js with Express
  - MongoDB with Mongoose
  - TypeScript
  - Full-text search capabilities 