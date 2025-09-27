# 🎯 15-Point Campus Polygon Setup Guide

## 📍 **Custom 15-Point Campus Boundary**

Your VISTA system now supports a **custom 15-point polygon** for your campus boundary! This allows for precise geofencing that matches your actual campus shape.

## 🎯 **How the 15-Point Polygon Works:**

### **Point Connection Order:**
```
Point 1 → Point 2 → Point 3 → ... → Point 15 → Point 1
```

The system will:
1. **Connect each point** to the next point in sequence
2. **Connect Point 15** back to **Point 1** to close the polygon
3. **Use ray casting algorithm** to detect if a location is inside the polygon

## 🎯 **Where to Put Your 15 Coordinates:**

### **Method 1: Direct Code Configuration (RECOMMENDED)**

**Step 1:** Edit `backend/geofencing.py` lines 24-42:

```python
'polygon': [
    # REPLACE THESE 15 COORDINATES WITH YOUR ACTUAL CAMPUS BOUNDARY POINTS
    # Points will be connected in order to form your campus polygon
    (YOUR_LAT_1, YOUR_LON_1),   # Point 1 - START HERE
    (YOUR_LAT_2, YOUR_LON_2),   # Point 2
    (YOUR_LAT_3, YOUR_LON_3),   # Point 3
    (YOUR_LAT_4, YOUR_LON_4),   # Point 4
    (YOUR_LAT_5, YOUR_LON_5),   # Point 5
    (YOUR_LAT_6, YOUR_LON_6),   # Point 6
    (YOUR_LAT_7, YOUR_LON_7),   # Point 7
    (YOUR_LAT_8, YOUR_LON_8),   # Point 8
    (YOUR_LAT_9, YOUR_LON_9),   # Point 9
    (YOUR_LAT_10, YOUR_LON_10), # Point 10
    (YOUR_LAT_11, YOUR_LON_11), # Point 11
    (YOUR_LAT_12, YOUR_LON_12), # Point 12
    (YOUR_LAT_13, YOUR_LON_13), # Point 13
    (YOUR_LAT_14, YOUR_LON_14), # Point 14
    (YOUR_LAT_15, YOUR_LON_15), # Point 15 - END HERE (connects back to Point 1)
]
```

## 🎯 **How to Get Your 15 Campus Points:**

### **Step 1: Plan Your Campus Boundary**

1. **Walk around your campus perimeter**
2. **Identify 15 key points** that define your campus boundary
3. **Choose points** that create an accurate polygon of your campus
4. **Number them in order** (clockwise or counterclockwise)

### **Step 2: Get Coordinates for Each Point**
1. **Open Google Maps**
2. **Navigate to each point** on your campus boundary
3. **Right-click on each point**
4. **Copy the coordinates** (latitude, longitude)
5. **Record them in order**

### **Step 3: Example Campus Points**
```
Point 1:  Main Gate (26.2389, 73.0243)
Point 2:  North-East Corner (26.2390, 73.0244)
Point 3:  Library Corner (26.2391, 73.0245)
Point 4:  Admin Building (26.2392, 73.0246)
Point 5:  Central Plaza (26.2393, 73.0247)
Point 6:  Hostel Area (26.2394, 73.0248)
Point 7:  Sports Complex (26.2395, 73.0249)
Point 8:  Parking Lot (26.2396, 73.0250)
Point 9:  Garden Area (26.2397, 73.0251)
Point 10: Cafeteria (26.2398, 73.0252)
Point 11: Lab Building (26.2399, 73.0253)
Point 12: Workshop (26.2400, 73.0254)
Point 13: South Gate (26.2401, 73.0255)
Point 14: West Corner (26.2402, 73.0256)
Point 15: Back to Start (26.2403, 73.0257)
```

## 🎯 **Quick Setup Template:**

### **Replace this section in `geofencing.py`:**
```python
'polygon': [
    (26.2389, 73.0243),  # Point 1 - Main Gate
    (26.2390, 73.0244),  # Point 2 - North-East
    (26.2391, 73.0245),  # Point 3 - Library
    (26.2392, 73.0246),  # Point 4 - Admin
    (26.2393, 73.0247),  # Point 5 - Central
    (26.2394, 73.0248),  # Point 6 - Hostel
    (26.2395, 73.0249),  # Point 7 - Sports
    (26.2396, 73.0250),  # Point 8 - Parking
    (26.2397, 73.0251),  # Point 9 - Garden
    (26.2398, 73.0252),  # Point 10 - Cafeteria
    (26.2399, 73.0253),  # Point 11 - Lab
    (26.2400, 73.0254),  # Point 12 - Workshop
    (26.2401, 73.0255),  # Point 13 - South Gate
    (26.2402, 73.0256),  # Point 14 - West Corner
    (26.2403, 73.0257),  # Point 15 - Back to Start
]
```

## 🎯 **Testing Your 15-Point Polygon:**

### **Step 1: Start the backend**
```bash
cd backend
python app_simple.py
```

### **Step 2: Test campus boundary**
```bash
GET http://localhost:8000/geofencing/boundaries
```

### **Step 3: Test location verification**
```bash
POST http://localhost:8000/geofencing/verify
{
  "latitude": YOUR_TEST_LATITUDE,
  "longitude": YOUR_TEST_LONGITUDE,
  "accuracy": 10
}
```

## 🎯 **Polygon Validation Features:**

✅ **15-point custom polygon** for precise campus boundary  
✅ **Ray casting algorithm** for accurate point-in-polygon detection  
✅ **Distance validation** from campus center  
✅ **GPS accuracy checking**  
✅ **Real-time verification**  

## 🎯 **Frontend Integration:**

The frontend will automatically:
- ✅ **Get user location** using GPS
- ✅ **Verify against your 15-point polygon**
- ✅ **Show location status** (within/outside campus)
- ✅ **Enable/disable attendance** based on polygon location

## 🎯 **Tips for Choosing Your 15 Points:**

1. **Start at a landmark** (main gate, entrance)
2. **Follow campus perimeter** in one direction
3. **Choose points** that create smooth curves
4. **Include key buildings** and boundaries
5. **End near your starting point** for a closed polygon

## 🎯 **Example: JKLU Campus 15-Point Polygon**

```python
'polygon': [
    (26.2389, 73.0243),  # Main Gate
    (26.2395, 73.0248),  # North-East Corner
    (26.2400, 73.0250),  # Library Corner
    (26.2405, 73.0252),  # Admin Building
    (26.2410, 73.0254),  # Central Plaza
    (26.2415, 73.0256),  # Hostel Area
    (26.2420, 73.0258),  # Sports Complex
    (26.2425, 73.0260),  # Parking Lot
    (26.2430, 73.0262),  # Garden Area
    (26.2435, 73.0264),  # Cafeteria
    (26.2440, 73.0266),  # Lab Building
    (26.2445, 73.0268),  # Workshop
    (26.2450, 73.0270),  # South Gate
    (26.2445, 73.0265),  # West Corner
    (26.2390, 73.0245),  # Back to Main Gate
]
```

## 🎯 **Ready to Set Up Your 15 Points?**

**Please provide your 15 campus boundary coordinates in order, and I'll help you configure them!** 🎯📍

**Format:**
```
Point 1: (latitude, longitude)
Point 2: (latitude, longitude)
...
Point 15: (latitude, longitude)
```
