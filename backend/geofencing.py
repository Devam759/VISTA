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
        
        # Define campus boundary (15-point polygon covering entire campus)
        # Campus boundary for JKLU (Jagadguru Kripalu University)
        # Points will be connected in order: Point1 -> Point2 -> Point3 -> ... -> Point15 -> Point1
        self.campus_boundary = {
            'center': (26.2389, 73.0243),  # JKLU Campus Center
            'radius': 1000,  # meters - campus radius (increased for better coverage)
            'polygon': [
                # Campus boundary points forming a polygon around JKLU campus
                (26.836760, 75.651187),  # Point 1 - Southwest corner
                (26.837109, 75.649523),  # Point 2
                (26.896678, 75.649331),  # Point 3
                (26.836655, 75.648472),  # Point 4
                (26.836079, 75.648307),  # Point 5
                (26.835495, 75.650194),  # Point 6
                (26.834788, 75.650150),  # Point 7
                (26.834635, 75.650973),  # Point 8
                (26.833430, 75.651435),  # Point 9
                (26.832659, 75.652500),  # Point 10
                (26.833776, 75.653021),  # Point 11
                (26.834072, 75.652374),  # Point 12
                (26.834935, 75.652472),  # Point 13
                (26.835321, 75.651554),  # Point 14
                (26.835838, 75.651320),  # Point 15 - Southeast corner
            ]
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
    
    def is_point_in_polygon(self, point: Tuple[float, float], polygon: List[Tuple[float, float]]) -> bool:
        """
        Check if a point is inside a polygon using ray casting algorithm
        """
        x, y = point
        n = len(polygon)
        inside = False
        
        p1x, p1y = polygon[0]
        for i in range(1, n + 1):
            p2x, p2y = polygon[i % n]
            if y > min(p1y, p2y):
                if y <= max(p1y, p2y):
                    if x <= max(p1x, p2x):
                        if p1y != p2y:
                            xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                        if p1x == p2x or x <= xinters:
                            inside = not inside
            p1x, p1y = p2x, p2y
        
        return inside
    
    def verify_location(self, latitude: float, longitude: float, accuracy: float = None) -> Dict:
        """
        Verify if the given coordinates are within campus boundary
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
            
            # Check accuracy if provided
            if accuracy and accuracy > 200:  # Accuracy worse than 200 meters (more realistic for campus)
                return {
                    'valid': False,
                    'reason': f'GPS accuracy too low: {accuracy}m (required: <200m)',
                    'distance': None,
                    'campus': None
                }
            
            # Check distance from campus center
            distance_from_center = self.calculate_distance(
                latitude, longitude, 
                self.campus_boundary['center'][0], self.campus_boundary['center'][1]
            )
            
            # Check if within campus radius
            if distance_from_center > self.campus_boundary['radius']:
                return {
                    'valid': False,
                    'reason': f'Too far from campus: {distance_from_center:.1f}m (max: {self.campus_boundary["radius"]}m)',
                    'distance': distance_from_center,
                    'campus': None
                }
            
            # Check if within campus polygon boundary
            if self.is_point_in_polygon((latitude, longitude), self.campus_boundary['polygon']):
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
