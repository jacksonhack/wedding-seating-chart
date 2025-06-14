#!/bin/bash

# setup.sh - Script to automate setup and deployment of the Wedding Seating Chart application

# Exit on any error
set -e

# Define project directory (adjust if different)
PROJECT_DIR="/Desktop/wedding-planner/wedding-seating-chart"
BACKEND_PORT=3001
FRONTEND_PORT=5173

echo "Starting setup for Wedding Seating Chart application..."

# Step 1: Install screen if not already installed
if ! command -v screen &> /dev/null; then
    echo "Installing screen..."
    sudo apt install -y screen
else
    echo "screen is already installed."
fi

# Step 2: Install serve if not already installed (for serving frontend)
if ! command -v serve &> /dev/null; then
    echo "Installing serve globally..."
    npm install -g serve
else
    echo "serve is already installed."
fi

# Step 3: Determine the server's IP address (use local IP by default)
# Use the first IP from hostname -I (local network IP)
SERVER_IP=$(hostname -I | awk '{print $1}')
# Alternatively, uncomment the line below to use public IP
# SERVER_IP=$(curl -s ifconfig.me)
echo "Using server IP: $SERVER_IP for backend URL"

# Step 4: Navigate to project directory
cd "$PROJECT_DIR"
echo "Working in project directory: $PROJECT_DIR"

# Step 5: Install project dependencies if not already done
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed."
fi

if [ ! -d "server/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd server
    npm install
    cd ..
else
    echo "Backend dependencies already installed."
fi

# Step 6: Build the frontend with the server's IP as the backend URL
echo "Building frontend with backend URL: http://$SERVER_IP:$BACKEND_PORT"
VITE_BACKEND_URL=http://$SERVER_IP:$BACKEND_PORT npm run build
echo "Frontend build complete."

# Step 7: Start or restart the backend server using screen
# Check if backend screen session exists
if screen -ls | grep -q "wedding-seating-backend"; then
    echo "Stopping existing backend screen session..."
    screen -S wedding-seating-backend -X quit
fi

echo "Starting backend server on port $BACKEND_PORT..."
screen -dmS wedding-seating-backend bash -c "cd $PROJECT_DIR/server && npm start"
echo "Backend server started in screen session 'wedding-seating-backend'."

# Step 8: Start or restart the frontend server using screen
# Check if frontend screen session exists
if screen -ls | grep -q "wedding-seating-frontend"; then
    echo "Stopping existing frontend screen session..."
    screen -S wedding-seating-frontend -X quit
fi

echo "Starting frontend server on port $FRONTEND_PORT..."
screen -dmS wedding-seating-frontend bash -c "cd $PROJECT_DIR && serve -s dist -l $FRONTEND_PORT"
echo "Frontend server started in screen session 'wedding-seating-frontend'."

# Step 9: Display status of screen sessions
echo "Current screen sessions:"
screen -ls

# Step 10: Final instructions
echo ""
echo "Setup complete! The Wedding Seating Chart application should now be running."
echo " - Backend is running on http://$SERVER_IP:$BACKEND_PORT"
echo " - Frontend is accessible at http://$SERVER_IP:$FRONTEND_PORT"
echo "To check logs or interact with the servers:"
echo " - Reattach to backend: screen -r wedding-seating-backend"
echo " - Reattach to frontend: screen -r wedding-seating-frontend"
echo "If you encounter issues, check the logs in the screen sessions or browser console."

# Ensure the script exits successfully
exit 0
