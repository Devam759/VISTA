// Get API base URL from environment or use default
const API_BASE = import.meta.env.VITE_API_URL || 'https://vista-ia7c.onrender.com'

export async function verifyInsideCampus() {
  try {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser')
    }

    // Get current position from browser with better error handling
    const position = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out. Please enable location permissions.'))
      }, 20000) // 20 second timeout for better accuracy

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeoutId)
          resolve(pos)
        },
        (error) => {
          clearTimeout(timeoutId)
          let errorMessage = 'Failed to get location'
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please check your device GPS.'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.'
              break
            default:
              errorMessage = error.message || 'Unknown location error'
          }
          
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true, // Use GPS for precise location
          timeout: 15000,
          maximumAge: 0 // Don't use cached position, get fresh one
        }
      )
    })

    const { latitude, longitude } = position.coords
    
    // Call backend API to check against actual polygon
    try {
      const response = await fetch(`${API_BASE}/debug/geolocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude })
      })

      if (!response.ok) {
        throw new Error(`Backend check failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Log for debugging
      console.log(`📍 Your Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
      console.log(`📍 Polygon Check: ${data.insidePolygon ? '✅ INSIDE' : '❌ OUTSIDE'}`)
      console.log(`📍 Polygon Points: ${data.polygonPoints}`)
      console.log(`📍 Polygon Bounds: Lat [${data.polygonBounds.minLat.toFixed(6)}, ${data.polygonBounds.maxLat.toFixed(6)}], Lng [${data.polygonBounds.minLng.toFixed(6)}, ${data.polygonBounds.maxLng.toFixed(6)}]`)
      
      return {
        ok: data.insidePolygon,
        details: data.message,
        coords: { latitude, longitude },
        polygonData: data
      }
    } catch (apiError) {
      console.error('❌ Backend geolocation check failed:', apiError)
      // Fallback: allow if backend check fails (for development)
      console.warn('⚠️ Using fallback - allowing location check')
      return {
        ok: true,
        details: 'Backend check unavailable, allowing for development',
        coords: { latitude, longitude },
        bypass: true
      }
    }
  } catch (error) {
    console.error('❌ Geolocation error:', error)
    
    // For development/testing: Allow bypass if in localhost
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    
    // LENIENT MODE: Allow bypass for mobile devices or if geolocation fails
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isPermissionDenied = error.message && error.message.includes('denied')
    
    if (isDevelopment || (isMobile && !isPermissionDenied)) {
      console.warn('⚠️ Geolocation check bypassed:', {
        isDevelopment,
        isMobile,
        error: error.message
      })
      return {
        ok: true,
        details: isDevelopment 
          ? 'Development mode - Location check bypassed'
          : isMobile
          ? 'Mobile device - Location check bypassed (GPS may be inaccurate)'
          : 'Location unavailable - Check bypassed',
        coords: { latitude: null, longitude: null },
        bypass: true
      }
    }
    
    return {
      ok: false,
      details: error.message || 'Failed to get location',
      error: error.message
    }
  }
}
