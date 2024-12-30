#!/bin/bash

# Start the Config Service
echo "Starting Config Service..."
cd /config-service
./mvnw spring-boot:run &
CONFIG_PID=$!
echo "Config Service started with PID $CONFIG_PID"

# Wait for Config Service to be fully up
sleep 30

# Start the Discovery Service
echo "Starting Discovery Service..."
cd /discovery-service
./mvnw spring-boot:run &
DISCOVERY_PID=$!
echo "Discovery Service started with PID $DISCOVERY_PID"

# Wait for Discovery Service to be fully up
sleep 30

# Start the Gateway Service
echo "Starting Gateway Service..."
cd /gateway-service
./mvnw spring-boot:run &
GATEWAY_PID=$!
echo "Gateway Service started with PID $GATEWAY_PID"

# Wait for Gateway Service to be fully up
sleep 30

# Start the Post Service
echo "Starting Post Service..."
cd /post-service
./mvnw spring-boot:run &
POST_PID=$!
echo "Post Service started with PID $POST_PID"

# Wait for Post Service to be fully up
sleep 30

echo "All services started successfully."