#!/bin/bash

# Seed Campus Polygon on Render Backend
echo "📍 Seeding campus polygon on Render..."
echo ""

BACKEND_URL="https://vista-ia7c.onrender.com"

# Call the polygon seed endpoint
response=$(curl -s -X POST "$BACKEND_URL/api/seed/polygon" \
  -H "Content-Type: application/json")

echo "$response" | jq '.'

if echo "$response" | jq -e '.success == true' > /dev/null 2>&1; then
  echo ""
  echo "✅ Campus polygon seeded successfully!"
  echo ""
  echo "Testing geolocation endpoint..."
  curl -s -X POST "$BACKEND_URL/debug/geolocation" \
    -H "Content-Type: application/json" \
    -d '{"latitude": 26.835786, "longitude": 75.651311}' | jq '.'
else
  echo ""
  echo "❌ Failed to seed polygon. Check the error above."
  echo "Make sure the backend is deployed and database is connected."
fi
