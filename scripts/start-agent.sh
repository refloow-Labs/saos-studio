#!/bin/bash

# SAOS Autonomous Agent - Quick Start Script

echo "🤖 Starting SAOS Autonomous Agent..."
echo ""

# Check if we're in the right directory
if [ ! -d "autonomous-agent" ]; then
    echo "❌ Error: Please run this script from the SAOS Studio root directory"
    exit 1
fi

cd "autonomous-agent"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp .env.example .env
    echo ""
    echo "⚙️  Please edit .env with your credentials, then run this script again."
    echo ""
    echo "You need:"
    echo "  1. Gmail OAuth credentials (run: npm run setup)"
    echo "  2. Netlify access token"
    echo "  3. Anthropic API key"
    echo ""
    echo "See QUICKSTART.md for detailed instructions."
    exit 1
fi

# Check if Gmail is configured
if ! grep -q "GMAIL_REFRESH_TOKEN=.*[a-zA-Z]" .env; then
    echo "⚠️  Gmail not configured yet."
    echo ""
    echo "Run: npm run setup"
    echo "to set up Gmail OAuth authentication."
    echo ""
    exit 1
fi

echo "✅ Environment configured"
echo "🚀 Starting agent..."
echo ""

# Start the agent
npm start
