# Inventory Management System

**Copyright © 2024 zone24x7. All Rights Reserved.**  
*For Internal Use Only*

## Overview
The Inventory Management System is a web-based application designed for internal use at zone24x7. It provides a modern, efficient solution for tracking and managing company inventory items, with features including real-time updates, detailed item tracking, and comprehensive reporting capabilities.

### Key Features
- Real-time inventory tracking
- Item categorization and search
- Stock level monitoring and alerts
- User-friendly interface
- Detailed inventory reports
- Automated test coverage

## Technical Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **API Style**: RESTful
- **Testing Framework**: 
  - Vitest for unit and integration testing
  - Supertest for API endpoint testing
  - MongoDB Memory Server for test database
  - Coverage reporting with V8

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Testing**: Vitest with React Testing Library
- **State Management**: React Context API
- **UI Components**: Custom components with modern design

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
cd INVENTORY
cd backend && npm install
cd ../frontend && npm install
```

### Development Mode
The system includes a shell script (`inventory.sh`) for managing the application:

```bash
# Start both frontend and backend servers
./inventory.sh start

# Check system status
./inventory.sh status

# Stop all services
./inventory.sh stop

# Restart all services
./inventory.sh restart
```

Manual Commands (if needed):
```bash
# Backend (from backend directory)
npm run dev         # Start development server
npm test           # Run tests
npm run test:coverage  # Generate test coverage report

# Frontend (from frontend directory)
npm run dev        # Start development server
npm test          # Run tests
npm run coverage   # Generate test coverage report
```

### Production Mode
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
```

The frontend build will generate a `dist` directory that can be served using nginx or another web server.

## Deployment Requirements

### Minimum Hardware Requirements
- **CPU**: 4 cores, 2.0GHz or better
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 50GB SSD (for application, logs, and database)
- **Network**: 1Gbps Ethernet
- **Operating System**: Linux (Ubuntu 20.04 LTS or higher recommended)

### Monitoring Tools
1. **System Monitoring**
   - Prometheus for metrics collection
   - Grafana for visualization
   - Node Exporter for hardware metrics

2. **Application Monitoring**
   - PM2 for process management
   - Winston for log management
   - MongoDB Compass for database monitoring

3. **Key Metrics to Monitor**
   - CPU usage
   - Memory consumption
   - Disk I/O
   - Network traffic
   - MongoDB connections
   - Response times
   - Error rates

### Production Configuration
1. **Process Management**
```bash
# Install PM2 globally
npm install -g pm2

# Start backend
pm2 start npm --name "inventory-backend" -- start

# Monitor processes
pm2 monitor
```

2. **Nginx Configuration (Example)**
```nginx
server {
    listen 80;
    server_name inventory.internal.zone24x7.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Testing

### Backend Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Database operations testing with MongoDB Memory Server
- API contract testing with Supertest
- Coverage reporting with V8

### Frontend Testing
- Component unit tests
- Integration tests for user flows
- Event handling tests
- State management tests
- UI component tests

Run tests with coverage:
```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd frontend
npm run coverage
```

## Security Considerations
- Internal network access only
- MongoDB authentication required
- Regular security updates
- CORS configuration for specific domains
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure HTTP headers

## Support
For internal support and bug reporting, please contact:
- IT Support Team
- Development Team Lead

## License
This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited. All rights reserved by zone24x7. 