#!/bin/bash

# Test VISTA Backend Deployment
echo "🧪 Testing VISTA Backend..."
echo ""

BACKEND_URL="https://vista-ia7c.onrender.com"

# Test 1: Root endpoint
echo "1️⃣ Testing root endpoint..."
curl -s "$BACKEND_URL/" | jq '.' || echo "❌ Failed"
echo ""

# Test 2: Health endpoint
echo "2️⃣ Testing health endpoint..."
curl -s "$BACKEND_URL/health" | jq '.' || echo "❌ Failed (might not exist in deployed version)"
echo ""

# Test 3: Debug geolocation endpoint
echo "3️⃣ Testing geolocation endpoint..."
curl -s -X POST "$BACKEND_URL/debug/geolocation" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 26.835786, "longitude": 75.651311}' | jq '.' || echo "❌ Failed"
echo ""

echo "✅ Test complete!"
echo ""
echo "If any tests failed, you need to redeploy your backend with the latest code."
