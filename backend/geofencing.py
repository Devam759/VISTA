"""
VISTA Geofencing Module
Handles location-based attendance verification
"""

import math
from typing import Tuple, List, Dict
from config import Config

class GeofencingManager:
    """Manages geofencing for attendance verification"""
    
    def __init__(self):
        self.hostel_center_lat = Config.HOSTEL_LATITUDE
        self.hostel_center_lon = Config.HOSTEL_LONGITUDE
        self.accuracy_radius = Config.GPS_ACCURACY_RADIUS  # meters
        
        # Define campus boundary (rectangular boundary for reliability)
        # Campus boundary for JKLU (Jagadguru Kripalu University)
        self.campus_boundary = {
            'center': (26.8351, 75.6508),  # JKLU Campus Center (corrected)
            'radius': 800,  # meters - campus radius (corrected)
            'bounds': {
                'min_lat': 26.832659,
                'max_lat': 26.837109,
                'min_lon': 75.648307,
                'max_lon': 75.653021
            }
        }
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate distance between two GPS coordinates using Haversine formula
        Returns distance in meters
        """
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # Radius of earth in meters
        r = 6371000
        return c * r
    
    def is_point_in_bounds(self, latitude: float, longitude: float, bounds: Dict) -> bool:
        """
        Check if a point is inside rectangular bounds
        """
        return (bounds['min_lat'] <= latitude <= bounds['max_lat'] and 
                bounds['min_lon'] <= longitude <= bounds['max_lon'])
    
    def verify_location(self, latitude: float, longitude: float, accuracy: float = None) -> Dict:
        """
        Verify if the given coordinates are within campus boundary (polygon only)
        """
        try:
            # Check if coordinates are valid
            if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
                return {
                    'valid': False,
                    'reason': 'Invalid GPS coordinates',
                    'distance': None,
                    'campus': None
                }
            
            # Check accuracy if provided (relaxed requirement)
            if accuracy and accuracy > 500:  # Accuracy worse than 500 meters
                return {
                    'valid': False,
                    'reason': f'GPS accuracy too low: {accuracy}m (required: <500m)',
                    'distance': None,
                    'campus': None
                }
            
            # Calculate distance from campus center for information
            distance_from_center = self.calculate_distance(
                latitude, longitude, 
                self.campus_boundary['center'][0], self.campus_boundary['center'][1]
            )
            
            # Only check if within campus rectangular boundary (no radius check)
            if self.is_point_in_bounds(latitude, longitude, self.campus_boundary['bounds']):
                return {
                    'valid': True,
                    'reason': 'Location verified within campus boundary',
                    'distance': distance_from_center,
                    'campus': 'Campus',
                    'accuracy': accuracy
                }
            
            return {
                'valid': False,
                'reason': f'Location outside campus boundary: {distance_from_center:.1f}m from center',
                'distance': distance_from_center,
                'campus': None
            }
            
        except Exception as e:
            return {
                'valid': False,
                'reason': f'Location verification error: {str(e)}',
                'distance': None,
                'campus': None
            }
    
    def get_campus_boundary(self) -> Dict:
        """Get campus boundary information for frontend"""
        return {
            'center': {
                'latitude': self.campus_boundary['center'][0],
                'longitude': self.campus_boundary['center'][1]
            },
            'radius': self.campus_boundary['radius'],
            'polygon': self.campus_boundary['polygon']
        }
    
    def validate_attendance_location(self, latitude: float, longitude: float, 
                                       accuracy: float = None, student_hostel: str = None) -> Dict:
        """
        Validate location for attendance marking within campus boundary
        """
        verification = self.verify_location(latitude, longitude, accuracy)
        
        if not verification['valid']:
            return {
                'gps_verified': False,
                'reason': verification['reason'],
                'distance': verification['distance'],
                'campus': verification['campus']
            }
        
        return {
            'gps_verified': True,
            'reason': verification['reason'],
            'distance': verification['distance'],
            'campus': verification['campus'],
            'accuracy': verification.get('accuracy')
        }

# Global geofencing manager
geofencing_manager = GeofencingManager()
