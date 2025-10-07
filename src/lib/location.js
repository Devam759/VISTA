const locationService = {
  // Detect if device is mobile
  isMobileDevice: () => {
    const mobileUserAgents = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return mobileUserAgents || (isSmallScreen && isTouchDevice);
  },

  // Check if location permissions are available
  checkPermissions: async () => {
    if (!navigator.geolocation) {
      return {
        available: false,
        reason:
          'Geolocation is not supported by your browser. Please use a modern browser like Chrome, Safari, or Firefox on a GPS-enabled device.',
      };
    }

    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        const state = permission.state;
        return {
          available: state !== 'denied',
          state,
          reason:
            state === 'denied'
              ? 'Location permission is denied. Enable it in browser settings and reload.'
              : state === 'prompt'
              ? 'Location permission is required. Please allow access when prompted.'
              : null,
        };
      }
      return { available: true, reason: null };
    } catch (error) {
      console.warn('Permission check failed:', error);
      return { available: true, reason: null };
    }
  },

  // Request a single location reading
  getCurrentPosition: () => {
    return new Promise(async (resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error(
            'Geolocation is not supported by your browser. Please use a modern browser with GPS support.'
          )
        );
        return;
      }

      const permissionCheck = await locationService.checkPermissions();
      if (!permissionCheck.available) {
        reject(new Error(permissionCheck.reason));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          let errorMessage = 'Unknown location error';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                'Location permission denied. Enable location access in your browser settings and reload the page.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                'Location information unavailable. Ensure location services are enabled and you have a clear GPS signal.';
              break;
            case error.TIMEOUT:
              errorMessage =
                'Location request timed out. Move to an area with better signal and try again.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 60000,
        }
      );
    });
  },

  // Retry wrapper around getCurrentPosition
  getCurrentPositionWithRetry: async (maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await locationService.getCurrentPosition();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  },
};

export default locationService;
