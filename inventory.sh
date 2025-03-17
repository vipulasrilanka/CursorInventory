#!/bin/bash

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        return 0 # Port is in use
    else
        return 1 # Port is free
    fi
}

# Function to wait for a port to be available/unavailable
wait_for_port() {
    local port=$1
    local wait_for_up=$2
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if [ "$wait_for_up" = true ]; then
            if check_port $port; then
                return 0
            fi
        else
            if ! check_port $port; then
                return 0
            fi
        fi
        echo "Waiting for port $port... (attempt $attempt/$max_attempts)"
        sleep 1
        attempt=$((attempt + 1))
    done
    return 1
}

# Function to check MongoDB connection
check_mongodb() {
    if ! mongosh --eval "db.runCommand({ ping: 1 })" > /dev/null 2>&1; then
        echo "Error: MongoDB is not running. Please start MongoDB first."
        return 1
    fi
    return 0
}

# Function to start the system
start_system() {
    echo "Starting Inventory System..."

    # Check if services are already running
    if check_port 5001 || check_port 5173; then
        echo "Error: One or more required ports (5001, 5173) are already in use."
        echo "Please stop any existing instances first."
        exit 1
    fi

    # Check MongoDB
    if ! check_mongodb; then
        exit 1
    fi

    # Create logs directory if it doesn't exist
    mkdir -p logs

    # Start backend
    echo "Starting backend server..."
    cd backend
    npm install > ../logs/backend_install.log 2>&1
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install backend dependencies. Check logs/backend_install.log for details."
        exit 1
    fi

    npm run dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!

    # Wait for backend to be ready
    if ! wait_for_port 5001 true; then
        echo "Error: Backend server failed to start. Check logs/backend.log for details."
        echo "Last few lines of the log:"
        tail -n 5 ../logs/backend.log
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    echo "Backend server is running on port 5001"

    # Start frontend
    echo "Starting frontend server..."
    cd ../frontend
    npm install > ../logs/frontend_install.log 2>&1
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install frontend dependencies. Check logs/frontend_install.log for details."
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi

    npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!

    # Wait for frontend to be ready
    if ! wait_for_port 5173 true; then
        echo "Error: Frontend server failed to start. Check logs/frontend.log for details."
        echo "Last few lines of the log:"
        tail -n 5 ../logs/frontend.log
        kill $FRONTEND_PID 2>/dev/null
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    echo "Frontend server is running on port 5173"

    # Save PIDs to a file
    cd ..
    echo "$BACKEND_PID $FRONTEND_PID" > .inventory_pids

    echo "Inventory System is now running!"
    echo "Frontend: http://localhost:5173"
    echo "Backend: http://localhost:5001"
    echo "Log files are available in the logs directory:"
    echo "  - logs/backend.log"
    echo "  - logs/frontend.log"
}

# Function to stop the system
stop_system() {
    echo "Stopping Inventory System..."

    # Read PIDs from file if it exists
    if [ -f .inventory_pids ]; then
        read BACKEND_PID FRONTEND_PID < .inventory_pids
        rm .inventory_pids
    fi

    # Stop frontend processes
    if check_port 5173; then
        echo "Stopping frontend server..."
        if [ ! -z "$FRONTEND_PID" ]; then
            kill $FRONTEND_PID 2>/dev/null
        fi
        pkill -f "vite" 2>/dev/null
        if ! wait_for_port 5173 false; then
            echo "Warning: Frontend server did not shut down gracefully"
            pkill -9 -f "vite" 2>/dev/null
        fi
    fi

    # Stop backend processes
    if check_port 5001; then
        echo "Stopping backend server..."
        if [ ! -z "$BACKEND_PID" ]; then
            kill $BACKEND_PID 2>/dev/null
        fi
        pkill -f "node.*backend" 2>/dev/null
        if ! wait_for_port 5001 false; then
            echo "Warning: Backend server did not shut down gracefully"
            pkill -9 -f "node.*backend" 2>/dev/null
        fi
    fi

    # Verify all services are stopped
    if check_port 5001 || check_port 5173; then
        echo "Error: Failed to stop all services"
        exit 1
    fi

    echo "Inventory System has been stopped successfully!"
}

# Function to show status
show_status() {
    local backend_running=false
    local frontend_running=false

    if check_port 5001; then
        backend_running=true
    fi

    if check_port 5173; then
        frontend_running=true
    fi

    echo "Inventory System Status:"
    echo "Backend (port 5001): $([ "$backend_running" = true ] && echo "RUNNING" || echo "STOPPED")"
    echo "Frontend (port 5173): $([ "$frontend_running" = true ] && echo "RUNNING" || echo "STOPPED")"

    if [ -f logs/backend.log ] && [ "$backend_running" = true ]; then
        echo -e "\nLast 5 lines of backend log:"
        tail -n 5 logs/backend.log
    fi

    if [ -f logs/frontend.log ] && [ "$frontend_running" = true ]; then
        echo -e "\nLast 5 lines of frontend log:"
        tail -n 5 logs/frontend.log
    fi
}

# Main script logic
case "$1" in
    start)
        start_system
        ;;
    stop)
        stop_system
        ;;
    restart)
        stop_system
        sleep 2
        start_system
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac

exit 0 