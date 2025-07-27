#!/bin/bash

# Nomad Info - Docker Installation Script
echo "🚀 Starting Digital Nomad Information Website installation..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed, please install Docker first"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed, please install Docker Compose first"
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker environment check passed"

# Choose installation mode
echo ""
echo "Please select installation mode:"
echo "1) Default port (3010)"
echo "2) Custom port"

read -p "Enter your choice (1-2): " choice

case $choice in
    1)
        echo "🔧 Installing on default port 3010..."
        docker-compose up --build -d
        ;;
    2)
        read -p "Enter port number (default 3010): " port
        port=${port:-3010}
        echo "🔧 Installing on port $port..."
        PORT=$port docker-compose up --build -d
        ;;
    *)
        echo "❌ Invalid choice, using default port 3010"
        docker-compose up --build -d
        ;;
esac

echo ""
echo "⏳ Waiting for service to start..."
sleep 10

# Check service status
if curl -f http://localhost:3010/api/health &> /dev/null; then
    echo "✅ Installation successful!"
    echo "🌐 Access URL: http://localhost:3010"
    echo ""
    echo "📋 Common commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop service: docker-compose down"
    echo "  Restart service: docker-compose restart"
    echo "  Update code: docker-compose up --build -d"
else
    echo "⚠️  Service might still be starting, please visit http://localhost:3010 later"
    echo "📋 View logs: docker-compose logs -f"
fi 