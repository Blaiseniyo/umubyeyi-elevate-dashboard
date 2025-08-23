#!/bin/bash

# Script to build and run the dockerized application for yarn-based project

# Build the Docker image
echo "Building Docker image (using yarn)..."
docker build -t umubyeyi-elevate-dashboard .

# Run the container
echo "Starting the container..."
docker run -p 5173:80 --name umubyeyi-dashboard -d umubyeyi-elevate-dashboard

echo "Container started! Access the application at http://localhost:5173"
