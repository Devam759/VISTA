# VISTA Coordinates Setup Guide

## 🎯 **Method 1: Environment Variables (RECOMMENDED)**

### **Step 1: Update your `.env` file**
Edit `backend/.env` and change these lines:

```env
# GPS Configuration - UPDATE THESE WITH YOUR HOSTEL COORDINATES
HOSTEL_LATITUDE=26.2389
HOSTEL_LONGITUDE=73.0243
GPS_ACCURACY_RADIUS=100
```

**Replace with your actual hostel coordinates:**
- `HOSTEL_LATITUDE` = Your hostel's latitude (e.g., 26.2389)
- `HOSTEL_LONGITUDE` = Your hostel's longitude (e.g., 73.0243)
- `GPS_ACCURACY_RADIUS` = Radius in meters (e.g., 100)

### **Step 2: Get Your Coordinates**
1. Open Google Maps
2. Navigate to your hostel location
3. Right-click on the hostel building
4. Copy the coordinates (latitude, longitude)

## 🎯 **Method 2: Direct Code Configuration**

### **Step 1: Update `backend/geofencing.py`**
Find lines 19-60 and replace the coordinates:

```python
# Define hostel boundaries (polygon coordinates)
self.hostel_boundaries = {
    'BH1': {
        'center': (YOUR_LATITUDE, YOUR_LONGITUDE),  # Replace with your coordinates
        'radius': 100,  # meters
        'polygon': [
            (YOUR_LATITUDE, YOUR_LONGITUDE),  # Center
            (YOUR_LATITUDE + 0.0006, YOUR_LONGITUDE + 0.0005),  # NE corner
            (YOUR_LATITUDE + 0.0006, YOUR_LONGITUDE - 0.0005),  # SE corner
            (YOUR_LATITUDE - 0.0006, YOUR_LONGITUDE - 0.0005),  # SW corner
            (YOUR_LATITUDE - 0.0006, YOUR_LONGITUDE + 0.0005),  # NW corner
        ]
    },
    'BH2': {
        'center': (YOUR_LATITUDE + 0.0006, YOUR_LONGITUDE + 0.0012),  # Adjust offset
        'radius': 100,
        'polygon': [
            # Similar pattern for other hostels
        ]
    },
    # ... repeat for GH1, GH2
}
```

## 🎯 **Method 3: Configuration File**

### **Step 1: Update `backend/config.py`**
Find lines 38-41 and change:

```python
# GPS Configuration
HOSTEL_LATITUDE = float(os.getenv('HOSTEL_LATITUDE', YOUR_ACTUAL_LATITUDE))
HOSTEL_LONGITUDE = float(os.getenv('HOSTEL_LONGITUDE', YOUR_ACTUAL_LONGITUDE))
GPS_ACCURACY_RADIUS = int(os.getenv('GPS_ACCURACY_RADIUS', 100))
```

## 🎯 **Quick Setup Example**

### **If your hostel is at: 26.2389, 73.0243**

**Option 1: Update `.env` file**
```env
HOSTEL_LATITUDE=26.2389
HOSTEL_LONGITUDE=73.0243
GPS_ACCURACY_RADIUS=100
```

**Option 2: Update `geofencing.py`**
```python
'BH1': {
    'center': (26.2389, 73.0243),
    'radius': 100,
    'polygon': [
        (26.2389, 73.0243),  # Center
        (26.2395, 73.0248),  # NE corner
        (26.2395, 73.0238),  # SE corner
        (26.2383, 73.0238),  # SW corner
        (26.2383, 73.0248),  # NW corner
    ]
}
```

## 🎯 **Testing Your Coordinates**

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
    "latitude": YOUR_LATITUDE,
    "longitude": YOUR_LONGITUDE,
    "accuracy": 10
  }'
```

## 🎯 **Coordinate Format**

- **Latitude**: Decimal degrees (e.g., 26.2389)
- **Longitude**: Decimal degrees (e.g., 73.0243)
- **Accuracy**: Meters (e.g., 100)

## 🎯 **Multiple Hostels**

If you have multiple hostels, update each one:

```python
'BH1': {
    'center': (26.2389, 73.0243),  # Hostel 1 coordinates
    'radius': 100,
    'polygon': [...]
},
'BH2': {
    'center': (26.2395, 73.0255),  # Hostel 2 coordinates
    'radius': 100,
    'polygon': [...]
},
'GH1': {
    'center': (26.2400, 73.0240),  # Girls Hostel 1 coordinates
    'radius': 100,
    'polygon': [...]
},
'GH2': {
    'center': (26.2405, 73.0250),  # Girls Hostel 2 coordinates
    'radius': 100,
    'polygon': [...]
}
```

## 🎯 **Restart Required**

After updating coordinates:
1. Stop the backend server (Ctrl+C)
2. Restart: `python app_simple.py`
3. Test the new coordinates
