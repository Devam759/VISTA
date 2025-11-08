# 📍 Geolocation Setup Guide

## Why Geolocation Isn't Working

The most common reasons:

1. **Browser blocked location access**
2. **HTTPS required** (browsers block geolocation on HTTP sites)
3. **Browser extension blocking** (ad blockers, privacy extensions)
4. **Device location services disabled**

---

## ✅ Quick Fixes

### 1. Enable Location in Browser

#### Chrome/Edge:
1. Click the **lock icon** or **info icon** (ⓘ) in the address bar
2. Find **Location** permission
3. Change to **Allow**
4. Refresh the page

#### Firefox:
1. Click the **lock icon** in the address bar
2. Click **Connection secure** → **More information**
3. Go to **Permissions** tab
4. Find **Access Your Location**
5. Uncheck **Use Default** and check **Allow**
6. Refresh the page

#### Safari:
1. Go to **Safari** → **Settings** → **Websites**
2. Click **Location** in the left sidebar
3. Find your website and set to **Allow**
4. Refresh the page

### 2. Check Device Location Services

#### Windows:
1. **Settings** → **Privacy** → **Location**
2. Turn on **Location services**
3. Allow apps to access location

#### Mac:
1. **System Preferences** → **Security & Privacy** → **Privacy**
2. Click **Location Services**
3. Enable for your browser

#### Linux:
1. **Settings** → **Privacy** → **Location Services**
2. Enable location services

### 3. Disable Browser Extensions

Temporarily disable:
- uBlock Origin
- AdBlock Plus
- Privacy Badger
- Any VPN extensions

Then refresh and try again.

### 4. Use HTTPS (Production)

Browsers require HTTPS for geolocation in production:
- ✅ `https://your-app.vercel.app` - Works
- ❌ `http://your-app.com` - Blocked

**For localhost development**, HTTP is allowed:
- ✅ `http://localhost:5173` - Works
- ✅ `http://127.0.0.1:5173` - Works

---

## 🔧 Development Mode Bypass

The app automatically bypasses geolocation checks when running on `localhost` or `127.0.0.1`.

This means:
- ✅ You can test locally without enabling location
- ✅ Geolocation will show as "verified" in development
- ⚠️ Production deployment will require real geolocation

---

## 🧪 Testing Geolocation

### Test if it's working:

1. Open browser console (F12)
2. Run this command:
```javascript
navigator.geolocation.getCurrentPosition(
  (pos) => console.log('✅ Location:', pos.coords.latitude, pos.coords.longitude),
  (err) => console.error('❌ Error:', err.message)
)
```

3. Check the output:
   - ✅ **Success**: Shows your coordinates
   - ❌ **Error**: Shows why it failed

### Common Error Messages:

| Error | Meaning | Solution |
|-------|---------|----------|
| `User denied Geolocation` | Permission blocked | Enable location in browser settings |
| `Network location provider at 'https://www.googleapis.com/' : Returned error code 403` | Google API issue | Try different network or VPN |
| `Timeout expired` | Taking too long | Check GPS signal, try again |
| `Only secure origins are allowed` | HTTP instead of HTTPS | Use HTTPS or localhost |

---

## 🚀 Production Deployment

When deploying to Vercel:

1. **Vercel automatically provides HTTPS** ✅
2. Users will be prompted for location permission
3. They must click **Allow** to use the app
4. No bypass - real geolocation required

---

## 📱 Mobile Devices

### Android:
1. **Settings** → **Location** → Turn ON
2. Open Chrome → **Settings** → **Site settings** → **Location**
3. Allow location for your site

### iOS:
1. **Settings** → **Privacy** → **Location Services** → Turn ON
2. Find **Safari** → Set to **While Using**
3. Open site and allow location when prompted

---

## 🐛 Still Not Working?

### Check Console Logs

The app logs detailed geolocation info:
```
📍 Your Location: 26.913600, 75.785800
📍 Campus Center: 26.9136, 75.7858
📏 Distance: 0.00km (Max allowed: 2km)
✅ Inside campus: true
```

If you see these logs, geolocation IS working!

### ERR_BLOCKED_BY_CLIENT

This error means a browser extension is blocking the request, NOT geolocation.

**Solution:**
1. Disable ad blockers
2. Disable privacy extensions
3. Try incognito/private mode
4. Whitelist `localhost:5000` in extension settings

---

## 💡 Pro Tips

1. **Use Chrome DevTools** to simulate different locations:
   - F12 → Console → ⋮ (three dots) → More tools → Sensors
   - Set custom location coordinates

2. **Test on mobile** for real-world GPS testing

3. **Check browser compatibility**:
   - ✅ Chrome 5+
   - ✅ Firefox 3.5+
   - ✅ Safari 5+
   - ✅ Edge (all versions)

---

## 🎯 Summary

**For Local Development:**
- Geolocation bypassed automatically on localhost
- No setup needed for testing

**For Production:**
- HTTPS required (Vercel provides this)
- Users must allow location permission
- Real GPS coordinates validated

**Current Issue:**
- `ERR_BLOCKED_BY_CLIENT` = Browser extension blocking
- **NOT** a geolocation issue
- Disable ad blockers to fix
