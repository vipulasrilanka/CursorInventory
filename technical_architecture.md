# Inventory Management System - Technical Architecture

## Overview
The Inventory Management System follows a modern client-server architecture with a React frontend and Node.js/Express backend, using MongoDB as the database. The system is designed for internal use at zone24x7 and follows industry best practices for security, scalability, and maintainability.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context API
- **UI Components**: Material-UI (MUI) components
- **Routing**: React Router
- **HTTP Client**: Axios
- **Testing**: Vitest with React Testing Library

#### Frontend Structure
```
frontend/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── theme.ts             # MUI theme configuration
│   ├── setupTests.ts        # Test setup configuration
│   ├── components/          # React components
│   │   ├── AddInventory.tsx # Add/edit inventory form
│   │   ├── SearchInventory.tsx # Search and display inventory items
│   │   └── Layout.tsx       # Layout component
│   ├── types/               # TypeScript type definitions
│   └── __tests__/           # Test files
└── public/                  # Static assets
```

### Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **API Style**: RESTful
- **Testing**: Vitest, Supertest, MongoDB Memory Server

#### Backend Structure
```
backend/
├── src/
│   ├── index.ts             # Server entry point
│   ├── app.ts              # Express application setup
│   ├── models/             # Mongoose models
│   │   └── Inventory.ts     # Inventory item model
│   ├── routes/             # API route handlers
│   │   └── inventory.ts     # Inventory API routes
│   ├── seed.ts             # Database seeding script
│   └── __tests__/          # Test files
│       ├── setup.ts        # Test database setup
│       └── *.test.ts       # Test files
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Technology Stack

### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Typed superset of JavaScript
- **Mongoose**: MongoDB object modeling tool
- **MongoDB**: NoSQL document database
- **CORS**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management

### Frontend Technologies
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Vite**: Build tool and development server
- **Material-UI**: React component library
- **React Router**: Declarative routing for React
- **Axios**: Promise-based HTTP client
- **Lodash**: Utility library for JavaScript

### Development and Testing Tools
- **Vitest**: Unit test framework
- **Supertest**: HTTP assertion library
- **MongoDB Memory Server**: In-memory MongoDB for testing
- **React Testing Library**: Testing utilities for React components
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting

## Data Flow Architecture

### Request Flow
1. User interacts with React frontend
2. Frontend makes HTTP requests to backend API via Axios
3. Express.js routes handle incoming requests
4. Mongoose models interact with MongoDB database
5. Results are returned to frontend for display

### Component Communication
- **Frontend to Backend**: RESTful API calls over HTTP
- **Backend to Database**: Mongoose ODM operations
- **Frontend Internal**: React component hierarchy and props

## Database Design

### Inventory Collection Schema
```javascript
{
  description: String,     // Required
  manufacturer: String,     // Required
  model: String,           // Required
  serialNumber: String,    // Required
  type: String,            // Required
  owner: String,           // Required
  currentUser: String,     // Required
  addedTime: Date,         // Auto-generated
  status: String           // Required
}
```

### Database Indexes
- **Compound Unique Index**: On `serialNumber` and `type` to prevent duplicates
- **Text Index**: On all text fields for full-text search capabilities

## Security Architecture

### Backend Security
- **CORS Configuration**: Restricts cross-origin requests
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Centralized error handling middleware
- **Environment Variables**: Sensitive configuration via dotenv

### Frontend Security
- **HTTP Only**: All communication over HTTP (intended for internal use)
- **Input Sanitization**: Client-side validation before API calls

## Testing Architecture

### Backend Testing
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing with Supertest
- **Database Tests**: MongoDB operations with in-memory database
- **Test Coverage**: V8 coverage reporting

### Frontend Testing
- **Component Tests**: Individual React component testing
- **Integration Tests**: User interaction flow testing
- **UI Tests**: Visual component rendering verification
- **Test Coverage**: V8 coverage reporting

## Deployment Architecture

### Development Environment
- **Frontend**: Vite development server on port 5173
- **Backend**: Node.js server with nodemon on port 5001
- **Database**: Local MongoDB instance

### Production Environment
- **Frontend**: Static files served by Nginx
- **Backend**: Node.js processes managed by PM2
- **Database**: MongoDB with authentication
- **Monitoring**: Prometheus, Grafana, and Winston logging

## Performance Considerations

### Frontend Performance
- **Code Splitting**: Vite's built-in code splitting
- **Lazy Loading**: React component lazy loading
- **Debouncing**: Search input debouncing to reduce API calls
- **Optimized Rendering**: Efficient React component rendering

### Backend Performance
- **Connection Pooling**: Mongoose connection pooling
- **Indexing**: Database indexes for efficient queries
- **Validation**: Early validation to prevent unnecessary processing
- **Error Handling**: Graceful error handling to prevent crashes