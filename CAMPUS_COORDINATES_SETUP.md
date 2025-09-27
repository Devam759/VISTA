# 🎯 Campus Boundary Setup Guide

## 📍 **Single Campus Boundary Configuration**

Your VISTA system now uses a **single campus boundary** instead of individual hostel boundaries. This is perfect for a unified campus geofencing system!

## 🎯 **Where to Put Your Campus Coordinates:**

### **Method 1: Environment Variables (RECOMMENDED)**

**Step 1:** Create/Edit `backend/.env` file:
```env
# Campus GPS Configuration - UPDATE THESE WITH YOUR CAMPUS COORDINATES
HOSTEL_LATITUDE=26.2389
HOSTEL_LONGITUDE=73.0243
GPS_ACCURACY_RADIUS=500
```

**Replace with your actual campus coordinates:**
- `HOSTEL_LATITUDE` = Your campus center latitude
- `HOSTEL_LONGITUDE` = Your campus center longitude  
- `GPS_ACCURACY_RADIUS` = Campus radius in meters (e.g., 500)

### **Method 2: Direct Code Configuration**

**Step 1:** Edit `backend/geofencing.py` lines 20-30:
```python
# Define campus boundary (single polygon covering entire campus)
# UPDATE THESE COORDINATES WITH YOUR ACTUAL CAMPUS BOUNDARY
self.campus_boundary = {
    'center': (YOUR_CAMPUS_LATITUDE, YOUR_CAMPUS_LONGITUDE),  # REPLACE WITH YOUR CAMPUS CENTER
    'radius': 500,  # meters - campus radius
    'polygon': [
        # REPLACE THESE COORDINATES WITH YOUR ACTUAL CAMPUS BOUNDARY
        (YOUR_CAMPUS_LATITUDE, YOUR_CAMPUS_LONGITUDE),  # Campus center
        (YOUR_CAMPUS_LATITUDE + 0.0011, YOUR_CAMPUS_LONGITUDE + 0.0017),  # NE corner
        (YOUR_CAMPUS_LATITUDE + 0.0011, YOUR_CAMPUS_LONGITUDE - 0.0023),  # SE corner
        (YOUR_CAMPUS_LATITUDE - 0.0019, YOUR_CAMPUS_LONGITUDE - 0.0023),  # SW corner
        (YOUR_CAMPUS_LATITUDE - 0.0019, YOUR_CAMPUS_LONGITUDE + 0.0017),  # NW corner
    ]
}
```

## 🎯 **Quick Setup Example:**

### **If your campus center is at: 26.2389, 73.0243**

**Option 1: Update `.env` file**
```env
HOSTEL_LATITUDE=26.2389
HOSTEL_LONGITUDE=73.0243
GPS_ACCURACY_RADIUS=500
```

**Option 2: Update `geofencing.py`**
```python
self.campus_boundary = {
    'center': (26.2389, 73.0243),  # Your campus center
    'radius': 500,  # 500 meters radius
    'polygon': [
        (26.2389, 73.0243),  # Campus center
        (26.2400, 73.0260),  # NE corner
        (26.2400, 73.0220),  # SE corner
        (26.2370, 73.0220),  # SW corner
        (26.2370, 73.0260),  # NW corner
    ]
}
```

## 🎯 **How to Get Your Campus Coordinates:**

### **Step 1: Get Campus Center**
1. Open **Google Maps**
2. Navigate to your campus
3. **Right-click** on the campus center
4. **Copy the coordinates** (latitude, longitude)

### **Step 2: Define Campus Boundary**
1. **Find the corners** of your campus
2. **Get coordinates** for each corner
3. **Create a polygon** that covers your entire campus

### **Step 3: Set Campus Radius**
- **Small campus**: 200-300 meters
- **Medium campus**: 400-600 meters  
- **Large campus**: 800-1000 meters

## 🎯 **Testing Your Campus Boundary:**

### **Step 1: Start the backend**
```bash
cd backend
python app_simple.py
```

### **Step 2: Test with your coordinates**
```bash
curl -X POST http://localhost:8000/geofencing/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "latitude": YOUR_CAMPUS_LATITUDE,
    "longitude": YOUR_CAMPUS_LONGITUDE,
    "accuracy": 10
  }'
```

## 🎯 **Campus Boundary Features:**

✅ **Single boundary** for entire campus  
✅ **Polygon detection** for precise boundaries  
✅ **Distance validation** from campus center  
✅ **GPS accuracy checking**  
✅ **Real-time verification**  

## 🎯 **Frontend Integration:**

The frontend will automatically:
- **Get user location** using GPS
- **Verify against campus boundary**
- **Show location status** (within/outside campus)
- **Enable/disable attendance** based on location

## 🎯 **Restart Required:**

After updating coordinates:
1. **Stop** the backend server (Ctrl+C)
2. **Restart**: `python app_simple.py`
3. **Test** the new coordinates

## 🎯 **Example Campus Setup:**

```python
# Example: JKLU Campus
self.campus_boundary = {
    'center': (26.2389, 73.0243),  # JKLU Campus Center
    'radius': 500,  # 500 meters
    'polygon': [
        (26.2389, 73.0243),  # Center
        (26.2400, 73.0260),  # NE corner
        (26.2400, 73.0220),  # SE corner  
        (26.2370, 73.0220),  # SW corner
        (26.2370, 73.0260),  # NW corner
    ]
}
```

**Your campus geofencing is now ready! 🎯**
