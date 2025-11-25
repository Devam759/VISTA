# Geofencing System - Complete Guide

## Overview
A production-ready geofencing system that verifies student location against campus boundaries before allowing login and attendance marking.

## Architecture

### Backend Components

#### 1. **Geofence Service** (`backend/services/geofenceService.js`)
- Extracts campus polygon coordinates from MySQL database
- Validates device GPS coordinates against polygon boundary
- Calculates distance to boundary with Haversine formula
- Provides detailed accuracy metrics

#### 2. **Geofence Controller** (`backend/controllers/geofenceController.js`)
- Handles geofence verification requests
- Returns detailed accuracy information
- Provides polygon debugging endpoints

#### 3. **Geofence Routes** (`backend/routes/geofence.js`)
- `POST /geofence/verify` - Verify location
- `GET /geofence/polygon-info` - Get polygon details (debug)
- `POST /geofence/clear-cache` - Clear polygon cache (admin)

### Frontend Components

#### **GeofenceChecker** (`src/components/GeofenceChecker.jsx`)
- Beautiful UI for location verification
- Real-time GPS accuracy display
- Direction guidance for out-of-bounds users
- Retry mechanism with detailed feedback

## API Endpoints

### Verify Geofence
```
POST /geofence/verify
Content-Type: application/json

{
  "latitude": 26.837605,
  "longitude": 75.652525,
  "accuracy": 204
}
```

**Response (Allowed):**
```json
{
  "allowed": true,
  "isInside": true,
  "userLocation": {
    "latitude": 26.837605,
    "longitude": 75.652525,
    "accuracy": 204
  },
  "polygonInfo": {
    "totalPoints": 13,
    "bounds": {
      "minLat": 26.832626,
      "maxLat": 26.837407,
      "minLng": 75.648181,
      "maxLng": 75.652786
    }
  },
  "distanceMetrics": {
    "distanceToBoundary": 0,
    "gpsAccuracy": 204,
    "accuracyPercentage": 100
  },
  "accuracyStatus": "INSIDE_BOUNDARY",
  "message": "✅ You are inside the campus boundary - Access GRANTED",
  "detailedInfo": {
    "direction": "WITHIN_BOUNDS",
    "recommendation": "You can proceed with login and attendance marking"
  }
}
```

**Response (Denied):**
```json
{
  "allowed": false,
  "isInside": false,
  "userLocation": {
    "latitude": 26.838826,
    "longitude": 75.653200,
    "accuracy": 240
  },
  "polygonInfo": {
    "totalPoints": 13,
    "bounds": {
      "minLat": 26.832626,
      "maxLat": 26.837407,
      "minLng": 75.648181,
      "maxLng": 75.652786
    }
  },
  "distanceMetrics": {
    "distanceToBoundary": 1250,
    "gpsAccuracy": 240,
    "accuracyPercentage": 0
  },
  "accuracyStatus": "OUTSIDE_BOUNDARY",
  "message": "❌ You are outside the campus boundary (1250m away) - Access DENIED",
  "detailedInfo": {
    "direction": "NORTH EAST",
    "recommendation": "You are 1250m outside campus. Move 1250m closer to enter the boundary"
  }
}
```

## Accuracy Status Levels

| Status | Meaning | Action |
|--------|---------|--------|
| `INSIDE_BOUNDARY` | Clearly inside polygon | ✅ ALLOW |
| `WITHIN_GPS_ACCURACY` | Within GPS accuracy radius of boundary | ✅ ALLOW (with warning) |
| `MARGINAL_GPS_ACCURACY` | Close to GPS accuracy boundary | ❌ DENY |
| `OUTSIDE_BOUNDARY` | Clearly outside polygon | ❌ DENY |

## Database Setup

### Campus Polygon Table
```sql
CREATE TABLE campus_polygon (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lat DOUBLE NOT NULL,
  lng DOUBLE NOT NULL,
  point_order INT NOT NULL,
  UNIQUE KEY unique_order (point_order)
);
```

### Insert Campus Coordinates
```sql
INSERT INTO campus_polygon (lat, lng, point_order) VALUES
(26.832626, 75.648181, 1),
(26.837407, 75.648181, 2),
(26.837407, 75.652786, 3),
(26.832626, 75.652786, 4),
(26.832626, 75.648181, 5);  -- Closing point (same as first)
```

## Integration with Login

### Before Integration
1. User opens app
2. User enters credentials
3. User logs in

### After Integration
1. User opens app
2. **Geofence check** (automatic)
   - Get device GPS location
   - Verify against campus polygon
   - Show accuracy feedback
3. If allowed: Show login form
4. If denied: Show direction guidance

### Implementation Example
```jsx
// In Login.jsx
import GeofenceChecker from '../components/GeofenceChecker.jsx'

export default function Login() {
  const [geofenceVerified, setGeofenceVerified] = useState(false)

  if (!geofenceVerified) {
    return (
      <GeofenceChecker
        onVerified={() => setGeofenceVerified(true)}
        onFailed={() => setGeofenceVerified(false)}
      />
    )
  }

  return (
    // Login form...
  )
}
```

## Accuracy Calculation

### Distance Calculation
- Uses **Haversine formula** for accurate distance between two GPS points
- Earth radius: 6,371 km
- Result: Distance in meters

### Accuracy Percentage
```
If inside polygon: 100%
If within GPS accuracy: ((GPS_ACCURACY - DISTANCE) / GPS_ACCURACY) * 100
If outside: 0%
```

### GPS Accuracy Tolerance
- **Excellent**: ±5-10m (modern phones)
- **Good**: ±10-50m (typical)
- **Fair**: ±50-100m (older devices)
- **Poor**: >100m (indoor/weak signal)

## Performance Optimization

### Polygon Caching
- Cache TTL: 5 minutes
- Reduces database queries
- Automatic cache invalidation
- Manual cache clear via admin endpoint

### Query Optimization
- Indexed `point_order` column
- Efficient ray-casting algorithm
- O(n) complexity where n = polygon points

## Real-World Scenarios

### Scenario 1: Student at Campus Gate
```
Distance to boundary: 50m
GPS Accuracy: ±100m
Status: WITHIN_GPS_ACCURACY
Action: ALLOW (with warning)
Message: "You are at the edge of campus. Move slightly inward for better accuracy"
```

### Scenario 2: Student at Home
```
Distance to boundary: 5000m
GPS Accuracy: ±50m
Status: OUTSIDE_BOUNDARY
Action: DENY
Message: "You are 5000m outside campus. Move 5000m closer to enter the boundary"
Direction: "SOUTH WEST"
```

### Scenario 3: Student Inside Campus
```
Distance to boundary: 0m
GPS Accuracy: ±30m
Status: INSIDE_BOUNDARY
Action: ALLOW
Message: "You are inside the campus boundary - Access GRANTED"
```

## Testing

### Test Endpoint
```bash
curl -X POST http://localhost:4000/geofence/verify \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 26.837605,
    "longitude": 75.652525,
    "accuracy": 204
  }'
```

### Get Polygon Info
```bash
curl http://localhost:4000/geofence/polygon-info
```

## Security Considerations

1. **GPS Spoofing**: Validate against multiple sources
2. **Accuracy Threshold**: Adjust based on campus size
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Logging**: Log all geofence checks for audit trail
5. **HTTPS Only**: Enforce HTTPS in production

## Future Enhancements

1. **Multi-Zone Geofencing**: Different boundaries for different areas
2. **Time-based Geofencing**: Different rules for different times
3. **Beacon Integration**: Bluetooth beacons for indoor verification
4. **WiFi Verification**: Combine GPS with WiFi SSID checking
5. **Machine Learning**: Detect spoofing patterns
6. **Mobile Integration**: Native app GPS integration

## Troubleshooting

### Issue: "Geolocation not supported"
- Solution: Use HTTPS (required for geolocation API)
- Check browser permissions

### Issue: GPS Accuracy > 500m
- Solution: Move to open area
- Wait for GPS lock (1-2 minutes)
- Check device GPS settings

### Issue: "Outside boundary" but should be inside
- Solution: Check polygon coordinates in database
- Verify polygon is closed (first point = last point)
- Check for coordinate format (lat/lng vs lng/lat)

## Database Queries

### Get Polygon Points
```sql
SELECT lat, lng, point_order FROM campus_polygon ORDER BY point_order;
```

### Update Polygon
```sql
UPDATE campus_polygon SET lat = 26.832626, lng = 75.648181 WHERE point_order = 1;
```

### Verify Polygon Closure
```sql
SELECT 
  (SELECT lat FROM campus_polygon ORDER BY point_order LIMIT 1) as first_lat,
  (SELECT lng FROM campus_polygon ORDER BY point_order LIMIT 1) as first_lng,
  (SELECT lat FROM campus_polygon ORDER BY point_order DESC LIMIT 1) as last_lat,
  (SELECT lng FROM campus_polygon ORDER BY point_order DESC LIMIT 1) as last_lng;
```
