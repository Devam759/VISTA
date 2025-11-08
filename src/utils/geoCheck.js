// JKLU Campus actual coordinates (using your current location)
const CAMPUS_CENTER = { lat: 26.9136, lng: 75.7858 }
const CAMPUS_RADIUS_KM = 2 // 2km radius from center

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
    // Get current position from browser
    const position = await new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
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
    console.error('Geolocation error:', error)
    return {
      ok: false,
      details: 'Failed to get location: ' + error.message,
      error: error.message
    }
  }
}
