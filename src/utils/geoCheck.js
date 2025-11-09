// Get API base URL from environment or use default
// Auto-detect localhost for development
const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) return envUrl
  
  // Auto-detect if running on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000'
  }
  
  return 'https://vista-ia7c.onrender.com'
}

const API_BASE = getApiBase()

export async function verifyInsideCampus() {
  try {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser. Please use a modern browser with location services.')
    }

    // Get current position from browser with optimized settings for faster response
    // First try with high accuracy, then fallback to lower accuracy if needed
    const position = await new Promise((resolve, reject) => {
      let timeoutId
      let watchId
      let resolved = false

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId)
        if (watchId) navigator.geolocation.clearWatch(watchId)
      }

      const onSuccess = (pos) => {
        if (resolved) return
        resolved = true
        cleanup()
        resolve(pos)
      }

      const onError = (error) => {
        if (resolved) return
        
        let errorMessage = 'Failed to get location'
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings and reload the page.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please check your device GPS and ensure location services are enabled.'
            break
          case error.TIMEOUT:
            // Try fallback with lower accuracy
            console.log('⚠️ High accuracy timeout, trying with lower accuracy...')
            try {
              navigator.geolocation.getCurrentPosition(
                onSuccess,
                (fallbackError) => {
                  cleanup()
                  reject(new Error('Location request timed out. Please ensure GPS is enabled and try again.'))
                },
                {
                  enableHighAccuracy: false, // Fallback to lower accuracy
                  timeout: 5000,
                  maximumAge: 10000
                }
              )
              return // Don't reject yet, wait for fallback
            } catch (e) {
              // Fallback also failed
            }
            errorMessage = 'Location request timed out. Please ensure GPS is enabled and try again.'
            break
          default:
            errorMessage = error.message || 'Unknown location error'
        }
        
        cleanup()
        reject(new Error(errorMessage))
      }

      // Set overall timeout
      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true
          cleanup()
          reject(new Error('Location request timed out. Please enable location permissions and ensure GPS is enabled.'))
        }
      }, 10000) // 10 second overall timeout

      // Try high accuracy first
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        {
          enableHighAccuracy: true, // Use GPS for precise location
          timeout: 8000, // 8 second timeout for high accuracy
          maximumAge: 5000 // Allow 5 second old position for faster response
        }
      )
    })

    const { latitude, longitude, accuracy } = position.coords
    
    // Log GPS accuracy for debugging
    console.log(`📍 GPS Accuracy: ${accuracy ? `${Math.round(accuracy)}m` : 'Unknown'}`)
    
    // Call backend API to check against actual polygon with accuracy tolerance
    try {
      const response = await fetch(`${API_BASE}/debug/geolocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          latitude, 
          longitude,
          accuracy: accuracy || null // Send accuracy for tolerance calculation
        })
      })

      if (!response.ok) {
        // Better error handling for 404
        if (response.status === 404) {
          throw new Error(`Backend server not found. Is the backend running on ${API_BASE}?`)
        }
        const errorText = await response.text()
        throw new Error(`Backend check failed (${response.status}): ${errorText || response.statusText}`)
      }

      const data = await response.json()
      
      // Log for debugging
      console.log(`📍 Your Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
      console.log(`📍 GPS Accuracy: ${accuracy ? `${Math.round(accuracy)}m` : 'Unknown'}`)
      console.log(`📍 Polygon Check: ${data.insidePolygon ? '✅ INSIDE' : '❌ OUTSIDE'}`)
      console.log(`📍 Polygon Points: ${data.polygonPoints}`)
      if (data.polygonBounds) {
        console.log(`📍 Polygon Bounds: Lat [${data.polygonBounds.minLat.toFixed(6)}, ${data.polygonBounds.maxLat.toFixed(6)}], Lng [${data.polygonBounds.minLng.toFixed(6)}, ${data.polygonBounds.maxLng.toFixed(6)}]`)
      }
      
      // Backend already handles GPS tolerance, so use its result directly
      return {
        ok: data.insidePolygon,
        details: data.message,
        coords: { latitude, longitude },
        accuracy: accuracy,
        distanceToBoundary: data.distanceToBoundary,
        polygonData: data
      }
    } catch (apiError) {
      console.error('❌ Backend geolocation check failed:', apiError)
      
      // Handle different types of connection errors
      const errorMessage = apiError.message || '';
      const isConnectionError = errorMessage.includes('Failed to fetch') || 
                               errorMessage.includes('ERR_CONNECTION_RESET') ||
                               errorMessage.includes('ERR_CONNECTION_REFUSED') ||
                               errorMessage.includes('network') ||
                               apiError.name === 'TypeError';
      
      if (isConnectionError || errorMessage.includes('404') || errorMessage.includes('not found')) {
        return {
          ok: false,
          details: `Cannot connect to backend server at ${API_BASE}. Please ensure the backend is running.`,
          coords: { latitude, longitude },
          error: apiError.message,
          connectionError: true
        }
      }
      
      // NO FALLBACK - Geofencing is required
      return {
        ok: false,
        details: apiError.message || 'Backend geolocation verification failed. Please ensure you are on campus.',
        coords: { latitude, longitude },
        error: apiError.message
      }
    }
  } catch (error) {
    console.error('❌ Geolocation error:', error)
    
    // NO BYPASS - Geofencing is mandatory
    // Only allow localhost for development if explicitly needed
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    
    // For development only, provide helpful error message
    if (isDevelopment) {
      console.warn('⚠️ Geolocation failed in development:', error.message)
    }
    
    return {
      ok: false,
      details: error.message || 'Failed to get location. Please enable location services and ensure GPS is working.',
      error: error.message
    }
  }
}
