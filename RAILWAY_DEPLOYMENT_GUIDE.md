# 🚀 Railway Backend Deployment Guide

## 🎯 **Deploy Your VISTA Backend to Railway**

### **Step 1: Install Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Or using curl
curl -fsSL https://railway.app/install.sh | sh
```

### **Step 2: Login to Railway**
```bash
railway login
```

### **Step 3: Initialize Railway Project**
```bash
# Navigate to your backend folder
cd backend

# Initialize Railway project
railway init

# This will create a railway.json file
```

### **Step 4: Configure Environment Variables**
In Railway dashboard, add these environment variables:

```bash
# Database Configuration (Railway will provide these automatically)
DB_TYPE=postgresql
DB_HOST=${{Postgres.PGHOST}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_PORT=${{Postgres.PGPORT}}
DB_SSLMODE=require

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES=86400

# Flask Configuration
FLASK_DEBUG=False
PORT=8000

# GPS Configuration (Update with your campus coordinates)
HOSTEL_LATITUDE=26.2389
HOSTEL_LONGITUDE=73.0243
GPS_ACCURACY_RADIUS=100

# WiFi Configuration
REQUIRED_WIFI_SSID=JKLU-Hostel

# File Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216

# CSV Upload Configuration
CSV_UPLOAD_FOLDER=uploads/csv
ALLOWED_CSV_EXTENSIONS=csv
MAX_CSV_SIZE=10485760

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=logs/vista.log

# Attendance Configuration
ATTENDANCE_DEADLINE=22:30:00
MAX_LATE_MINUTES=30
```

### **Step 5: Add PostgreSQL Database**
```bash
# Add PostgreSQL database to your Railway project
railway add postgresql
```

### **Step 6: Deploy to Railway**
```bash
# Deploy your backend
railway up

# Or deploy and watch logs
railway up --detach
railway logs
```

### **Step 7: Get Your Railway URL**
```bash
# Get your Railway deployment URL
railway domain

# This will give you something like: https://your-app-name.railway.app
```

### **Step 8: Update Vercel Environment Variables**
In your Vercel dashboard, add these environment variables:

```bash
NEXT_PUBLIC_BACKEND_AVAILABLE=true
NEXT_PUBLIC_API_BASE_URL=https://your-app-name.railway.app
```

### **Step 9: Redeploy Frontend**
```bash
# Redeploy your Vercel frontend
vercel --prod
```

## 🎯 **Railway Configuration Files Created**

### **1. Procfile**
```
web: python app_simple.py
```

### **2. railway.json**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python app_simple.py",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **3. runtime.txt**
```
python-3.11.0
```

## 🎯 **Testing Your Deployment**

### **1. Check Railway Logs**
```bash
railway logs
```

### **2. Test Your API Endpoints**
```bash
# Health check
curl https://your-app-name.railway.app/health

# Test geofencing
curl -X POST https://your-app-name.railway.app/geofencing/verify \
  -H "Content-Type: application/json" \
  -d '{"latitude": 26.2389, "longitude": 73.0243, "accuracy": 10}'
```

### **3. Test Full Stack**
1. Visit your Vercel URL
2. Try location services
3. Should now connect to Railway backend!

## 🎯 **Railway Benefits**

✅ **Free Tier Available**  
✅ **Automatic PostgreSQL Database**  
✅ **Easy Environment Management**  
✅ **Automatic HTTPS**  
✅ **Git Integration**  
✅ **Zero Configuration**  

## 🎯 **Troubleshooting**

### **Common Issues:**

1. **Build Fails:**
   ```bash
   # Check logs
   railway logs
   
   # Ensure all dependencies are in requirements.txt
   ```

2. **Database Connection Issues:**
   ```bash
   # Check database variables
   railway variables
   ```

3. **Port Issues:**
   ```bash
   # Railway automatically handles port binding
   # Make sure your app uses PORT environment variable
   ```

## 🎯 **Success Indicators**

✅ **Railway deployment successful**  
✅ **Database connected**  
✅ **API endpoints responding**  
✅ **Vercel frontend connecting to Railway backend**  
✅ **Full-stack application working**  

Your VISTA backend is now deployed on Railway! 🚀
