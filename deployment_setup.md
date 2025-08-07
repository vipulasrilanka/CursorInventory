# Inventory Management System - Deployment and Setup

## Overview
The Inventory Management System is designed for easy setup and deployment with clear separation between frontend and backend components. The system includes automated scripts and manual setup options for both development and production environments.

## System Requirements

### Minimum Hardware Requirements
- **CPU**: 4 cores, 2.0GHz or better
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 50GB SSD (for application, logs, and database)
- **Network**: 1Gbps Ethernet
- **Operating System**: Linux (Ubuntu 20.04 LTS or higher recommended)

### Software Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: v6.0 or higher
- **npm**: v9 or higher
- **PM2**: For production process management (optional for development)

## Setup Process

### Initial Setup
1. Clone the repository
2. Install dependencies for both frontend and backend
3. Configure environment variables
4. Start MongoDB service
5. Run the application

### Automated Setup with Shell Script
The system includes a convenient shell script (`inventory.sh`) for managing the application:

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

The script automatically:
- Checks for required ports (5001 for backend, 5173 for frontend)
- Verifies MongoDB connectivity
- Installs dependencies if needed
- Manages process lifecycle
- Creates log files for troubleshooting
- Handles graceful shutdown of services

### Manual Setup Process

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Production start
npm start
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
```

## Development Environment

### Starting Services Manually
1. Start MongoDB service:
   ```bash
   # Using systemctl (Linux)
   sudo systemctl start mongod
   
   # Using brew (macOS)
   brew services start mongodb-community
   ```

2. Start backend server:
   ```bash
   cd backend
   npm run dev
   ```

3. Start frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

### Environment Variables
The system uses environment variables for configuration:
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/inventory)
- `PORT`: Backend server port (default: 3000)

Environment variables should be configured in `.env` files in each respective directory.

## Production Deployment

### Process Management
For production deployments, PM2 is recommended for process management:

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
pm2 start npm --name "inventory-backend" -- start

# Monitor processes
pm2 monitor
```

### Web Server Configuration
The frontend build generates static files that can be served using Nginx:

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

### Database Configuration
For production, MongoDB should be configured with:
- Authentication enabled
- Regular backups
- Monitoring tools like MongoDB Compass
- Proper indexing for performance

## Monitoring and Maintenance

### System Monitoring
- **Prometheus**: For metrics collection
- **Grafana**: For visualization
- **Node Exporter**: For hardware metrics

### Application Monitoring
- **PM2**: For process management
- **Winston**: For log management
- **MongoDB Compass**: For database monitoring

### Key Metrics to Monitor
- CPU usage
- Memory consumption
- Disk I/O
- Network traffic
- MongoDB connections
- Response times
- Error rates

## Testing and Quality Assurance

### Running Tests
Both frontend and backend include comprehensive test suites:

#### Backend Testing
```bash
cd backend
npm test              # Run tests
npm run test:coverage # Generate coverage report
```

#### Frontend Testing
```bash
cd frontend
npm test         # Run tests
npm run coverage # Generate coverage report
```

### Test Coverage
The system uses V8 coverage reporting for both frontend and backend to ensure quality code coverage.

## Logging and Troubleshooting

### Log Files
The system generates log files in the `logs` directory:
- `backend.log`: Backend server logs
- `frontend.log`: Frontend server logs
- `backend_install.log`: Backend installation logs
- `frontend_install.log`: Frontend installation logs

### Common Issues and Solutions

#### Port Conflicts
The system checks for port availability before starting:
- Backend: Port 5001
- Frontend: Port 5173

If ports are in use, stop existing services or modify the configuration.

#### MongoDB Connection Issues
Ensure MongoDB is running and accessible:
- Check MongoDB service status
- Verify connection string in environment variables
- Confirm network connectivity to MongoDB server

#### Dependency Installation Failures
If npm install fails:
- Check Node.js and npm versions
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json files
- Retry installation

## Security Considerations

### Network Security
- Internal network access only
- CORS configuration for specific domains
- Rate limiting on API endpoints (implementation recommended)

### Data Security
- MongoDB authentication required for production
- Regular security updates for all dependencies
- Input validation and sanitization
- Secure HTTP headers

### Access Control
- Designed for internal use within zone24x7 network
- Authentication and authorization should be implemented for external access