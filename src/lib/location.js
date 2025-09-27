const locationService = {
  // Detect if device is mobile
  isMobileDevice: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  },

  // Check if geofencing should be enabled (mobile only)
  isGeofencingEnabled: () => {
    return locationService.isMobileDevice();
  },

  // Check if location permissions are available
  checkPermissions: async () => {
    if (!navigator.geolocation) {
      return { available: false, reason: 'Geolocation is not supported by your browser' };
    }

    // For desktop devices, allow access without geofencing
    if (!locationService.isGeofencingEnabled()) {
      return { 
        available: true, 
        reason: null,
        skipGeofencing: true // Flag to indicate geofencing should be skipped
      };
    }

    try {
      // Check if permissions API is available
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return { 
          available: permission.state !== 'denied', 
          state: permission.state,
          reason: permission.state === 'denied' ? 'Location permission is denied. Please enable location access in your browser settings.' : null
        };
      }
      return { available: true, reason: null };
    } catch (error) {
      return { available: true, reason: null }; // Fallback if permissions API fails
    }
  },

  // Request location with better error handling
  getCurrentPosition: () => {
    return new Promise(async (resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser. Please use a modern browser like Chrome, Firefox, or Safari.'));
        return;
      }

      // Check permissions first
      const permissionCheck = await locationService.checkPermissions();
      if (!permissionCheck.available) {
        reject(new Error(permissionCheck.reason));
        return;
      }

      // For desktop devices, return a mock location to allow access
      if (permissionCheck.skipGeofencing) {
        resolve({
          latitude: 26.2389, // Default campus coordinates
          longitude: 73.0243,
          accuracy: 100, // Lower accuracy for desktop
          timestamp: Date.now(),
          isDesktop: true // Flag to indicate this is a desktop mock location
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy, // in meters
            timestamp: position.timestamp,
          });
        },
        (error) => {
          let errorMessage = 'Unknown location error';
          let instructions = '';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              instructions = 'Please enable location services and grant permission to this site. Click the location icon in your browser\'s address bar and select "Allow".';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              instructions = 'Please ensure your device\'s location services are enabled and try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              instructions = 'Please try again. Make sure you\'re in an area with good GPS signal.';
              break;
          }
          
          const fullError = instructions ? `${errorMessage}. ${instructions}` : errorMessage;
          reject(new Error(fullError));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout
          maximumAge: 30000, // Allow cached location for 30 seconds
        }
      );
    });
  },

  // Get location with retry mechanism
  getCurrentPositionWithRetry: async (maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await locationService.getCurrentPosition();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
};

export default locationService;
