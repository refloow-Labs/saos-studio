#!/bin/bash

# SAOS Studio CRM Startup Script
# This starts both servers needed for the CRM to work properly

echo "🚀 Starting SAOS Studio CRM..."
echo ""

# Kill any existing servers on these ports
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:8081 | xargs kill -9 2>/dev/null

# Start CRM server (port 8080)
echo "📊 Starting CRM server on http://localhost:8080"
cd "/Users/giannistambakis/Desktop/SAOS Studio/crm"
python3 -m http.server 8080 > /dev/null 2>&1 &
CRM_PID=$!

# Start website server (port 8081) for viewing demo sites
echo "🌐 Starting website server on http://localhost:8081"
cd "/Users/giannistambakis/Desktop/SAOS Studio"
python3 -m http.server 8081 > /dev/null 2>&1 &
WEBSITE_PID=$!

sleep 2

echo ""
echo "✅ CRM is ready!"
echo ""
echo "   Dashboard: http://localhost:8080"
echo "   Demo sites: http://localhost:8081"
echo ""
echo "📝 Opening CRM in your browser..."
sleep 1
open http://localhost:8080

echo ""
echo "ℹ️  To stop the servers, run:"
echo "   kill $CRM_PID $WEBSITE_PID"
echo ""
echo "   Or close this terminal window."
echo ""

# Keep the script running
wait
