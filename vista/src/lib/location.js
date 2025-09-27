/**
 * VISTA Location Service
 * Handles GPS location and geofencing functionality
 */

const LOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000 // 5 minutes
};

class LocationService {
  constructor() {
    this.currentPosition = null;
    this.watchId = null;
    this.isWatching = false;
  }

  /**
   * Check if geolocation is supported
   */
  isSupported() {
    return 'geolocation' in navigator;
  }

  /**
   * Get current position
   */
  async getCurrentPosition() {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          resolve(this.currentPosition);
        },
        (error) => {
          reject(this.handleLocationError(error));
        },
        LOCATION_OPTIONS
      );
    });
  }

  /**
   * Start watching position
   */
  startWatching(callback) {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    if (this.isWatching) {
      this.stopWatching();
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        callback(this.currentPosition);
      },
      (error) => {
        callback(null, this.handleLocationError(error));
      },
      LOCATION_OPTIONS
    );

    this.isWatching = true;
  }

  /**
   * Stop watching position
   */
  stopWatching() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
    }
  }

  /**
   * Handle location errors
   */
  handleLocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return {
          code: 'PERMISSION_DENIED',
          message: 'Location access denied by user. Please enable location permissions.',
          action: 'Enable location permissions in your browser settings'
        };
      case error.POSITION_UNAVAILABLE:
        return {
          code: 'POSITION_UNAVAILABLE',
          message: 'Location information is unavailable.',
          action: 'Check your GPS settings and try again'
        };
      case error.TIMEOUT:
        return {
          code: 'TIMEOUT',
          message: 'Location request timed out.',
          action: 'Try again in a better location with GPS signal'
        };
      default:
        return {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred while retrieving location.',
          action: 'Please try again'
        };
    }
  }

  /**
   * Calculate distance between two coordinates
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Check if location is within accuracy threshold
   */
  isLocationAccurate(accuracy, threshold = 50) {
    return accuracy <= threshold;
  }

  /**
   * Get location status
   */
  getLocationStatus() {
    return {
      isSupported: this.isSupported(),
      isWatching: this.isWatching,
      currentPosition: this.currentPosition
    };
  }
}

// Create singleton instance
const locationService = new LocationService();

export default locationService;
