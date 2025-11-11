// JKLU Campus actual coordinates (using your current location)
const CAMPUS_CENTER = { lat: 26.9136, lng: 75.7858 }
const CAMPUS_RADIUS_KM = 10 // 10km radius from center (very lenient for mobile GPS accuracy)

// Calculate distance between two coordinates using Haversine formula
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export async function verifyInsideCampus() {
  try {
    // Desktop bypass: allow UI access on desktop devices
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobileUA) {
      return {
        ok: true,
        details: 'Desktop device – location check bypassed',
        coords: { latitude: CAMPUS_CENTER.lat, longitude: CAMPUS_CENTER.lng },
        distance: 0,
        bypass: true
      }
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser')
    }

    // Get current position from browser with better error handling
    const position = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out. Please enable location permissions.'))
      }, 15000) // 15 second timeout

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
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000 // Accept cached position up to 30 seconds old
        }
      )
    })

    const { latitude, longitude } = position.coords
    
    // Calculate distance from campus center
    const distance = getDistanceKm(latitude, longitude, CAMPUS_CENTER.lat, CAMPUS_CENTER.lng)
    
    // Check if within campus radius
    const isInside = distance <= CAMPUS_RADIUS_KM
    
    // Log for debugging
    console.log(`📍 Your Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
    console.log(`📍 Campus Center: ${CAMPUS_CENTER.lat}, ${CAMPUS_CENTER.lng}`)
    console.log(`📏 Distance: ${distance.toFixed(2)}km (Max allowed: ${CAMPUS_RADIUS_KM}km)`)
    console.log(`✅ Inside campus: ${isInside}`)
    
    return {
      ok: isInside,
      details: isInside 
        ? `Within campus bounds (${distance.toFixed(2)}km from center)`
        : `Outside campus (${distance.toFixed(2)}km from center, max ${CAMPUS_RADIUS_KM}km allowed)`,
      coords: { latitude, longitude },
      distance
    }
  } catch (error) {
    console.error('❌ Geolocation error:', error)
    
    // For development/testing: Allow bypass if in localhost
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    
    // LENIENT MODE: Allow bypass for mobile devices or if geolocation fails
    // This is more user-friendly and accounts for GPS issues
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isPermissionDenied = error.message && error.message.includes('denied')
    
    if (isDevelopment || isMobile || !isPermissionDenied) {
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
        coords: { latitude: CAMPUS_CENTER.lat, longitude: CAMPUS_CENTER.lng },
        distance: 0,
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
