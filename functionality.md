# Inventory Management System - Functionality

## Overview
The Inventory Management System is a web-based application designed for internal use at zone24x7 to track and manage company inventory items. It provides a modern, efficient solution with features including real-time updates, detailed item tracking, and comprehensive reporting capabilities.

## Core Functionality

### 1. Inventory Item Management
The system allows users to:
- Add new inventory items with detailed information
- View existing inventory items in a searchable list
- Edit/update existing inventory items
- Search across all inventory fields for quick lookup

### 2. Data Model
Each inventory item contains the following fields:
- **Description**: Text description of the item
- **Manufacturer**: The manufacturer of the item
- **Model**: The model of the item
- **Serial Number**: Unique identifier for the item
- **Type**: Category of the item (e.g., Laptop, Desktop)
- **Owner**: The owner of the item
- **Current User**: The person currently using the item
- **Added Time**: Timestamp when the item was added to the system

### 3. User Interface
The application features a responsive web interface with:
- A navigation bar with links to Search and Add Item pages
- A search page with real-time search functionality
- A form for adding new inventory items
- A form for editing existing inventory items
- Card-based display of inventory items with all relevant details

### 4. API Endpoints
The backend provides RESTful API endpoints for:
- **POST /api/inventory**: Create a new inventory item
- **GET /api/inventory**: Retrieve all inventory items
- **PUT /api/inventory/:id**: Update an existing inventory item
- **GET /api/inventory/search**: Search inventory items with query parameters

### 5. Data Validation
The system implements several validation mechanisms:
- Required field validation for all inventory item fields
- Duplicate detection based on serial number and type combination
- MongoDB schema validation
- Error handling for invalid data submissions

### 6. Search Functionality
The search feature allows users to:
- Search across all inventory fields simultaneously
- Perform case-insensitive partial matching
- Get real-time search results as they type (with debouncing)
- View all items when no search query is provided

### 7. User Experience Features
- Real-time inventory tracking
- Responsive design that works on different screen sizes
- User-friendly interface with clear navigation
- Immediate feedback on actions (success/error messages)
- Form validation to prevent invalid data entry