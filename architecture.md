# Inventory Management System - Architecture

## System Overview
The Inventory Management System is a full-stack web application designed for internal inventory tracking at zone24x7. It consists of a React frontend and a Node.js/Express backend with MongoDB as the database.

## Architecture Diagram

```mermaid
graph TD
    A[Client Browser] --> B[React Frontend]
    B --> C[Express.js Backend]
    C --> D[MongoDB Database]
    
    subgraph Frontend [Frontend Layer]
        B
    end
    
    subgraph Backend [Backend Layer]
        C
    end
    
    subgraph Database [Data Layer]
        D
    end
    
    style Frontend fill:#FFE4B5,stroke:#333
    style Backend fill:#98FB98,stroke:#333
    style Database fill:#87CEEB,stroke:#333
```

## Component Architecture

### Frontend Components
```mermaid
graph TD
    App[App Component] --> Router[React Router]
    Router --> Search[SearchInventory Component]
    Router --> Add[AddInventory Component]
    
    Search --> AxiosSearch[Axios API Calls]
    Add --> AxiosAdd[Axios API Calls]
    
    AxiosSearch --> API
    AxiosAdd --> API
    
    subgraph UI [User Interface]
        App -->|Navigation| Router
        Router -->|Route /| Search
        Router -->|Route /add| Add
    end
    
    subgraph API [API Communication]
        AxiosSearch
        AxiosAdd
    end
    
    style UI fill:#FFE4B5,stroke:#333
    style API fill:#98FB98,stroke:#333
```

### Backend Components
```mermaid
graph TD
    Server[Express Server] --> Middleware[CORS, JSON Parser]
    Middleware --> Routes[Inventory Routes]
    Routes --> Controllers[Route Handlers]
    Controllers --> Models[Mongoose Models]
    Models --> Database[MongoDB]
    
    Controllers --> Validation[Data Validation]
    Controllers --> ErrorHandling[Error Handling]
    
    subgraph ExpressApp [Express Application]
        Server --> Middleware
        Middleware --> Routes
        Routes --> Controllers
        Controllers --> Validation
        Controllers --> ErrorHandling
    end
    
    subgraph DataLayer [Data Layer]
        Models --> Database
    end
    
    style ExpressApp fill:#98FB98,stroke:#333
    style DataLayer fill:#87CEEB,stroke:#333
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Interacts with UI
    Frontend->>Backend: HTTP API Request
    Backend->>Database: Database Query
    Database-->>Backend: Data Response
    Backend-->>Frontend: API Response
    Frontend-->>User: Updated UI