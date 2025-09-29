"""
Geofencing Utility - Location Verification
"""
import math
from typing import Tuple, List, Dict, Optional

class GeofencingManager:
    """Geofencing manager for location verification"""
    
    def __init__(self, campus_lat: float = 26.2389, campus_lon: float = 73.0243, 
                 accuracy_radius: int = 100):
        self.campus_center_lat = campus_lat
        self.campus_center_lon = campus_lon
        self.accuracy_radius = accuracy_radius
        
        # Define JK Lakshmipat University campus boundary polygon
        # These coordinates define the actual campus boundary
        self.campus_boundary = [
            (73.0230, 26.2395), (73.0240, 26.2395), (73.0250, 26.2390),
            (73.0255, 26.2385), (73.0255, 26.2380), (73.0250, 26.2375),
            (73.0245, 26.2370), (73.0240, 26.2365), (73.0235, 26.2365),
            (73.0230, 26.2370), (73.0225, 26.2375), (73.0225, 26.2380),
            (73.0230, 26.2385), (73.0230, 26.2390), (73.0230, 26.2395)
        ]
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two GPS coordinates using Haversine formula"""
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371000  # Radius of earth in meters
        return c * r
    
    def is_point_in_polygon(self, point: Tuple[float, float], polygon: List[Tuple[float, float]]) -> bool:
        """Check if a point is inside a polygon using ray casting algorithm"""
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
    
    def verify_location(self, latitude: float, longitude: float, accuracy: Optional[float] = None) -> Dict:
        """Verify if the given coordinates are within campus boundary"""
        try:
            # Validate coordinates
            if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
                return {
                    'valid': False,
                    'reason': 'Invalid GPS coordinates',
                    'distance': None,
                    'campus': None
                }
            
            # Check GPS accuracy if provided
            if accuracy and accuracy > 500:  # Relaxed accuracy requirement
                return {
                    'valid': False,
                    'reason': f'GPS accuracy too low: {accuracy}m (required: <500m)',
                    'distance': None,
                    'campus': None
                }
            
            # Calculate distance from campus center
            distance_from_center = self.calculate_distance(
                latitude, longitude, 
                self.campus_center_lat, self.campus_center_lon
            )
            
            # Check if point is within campus boundary polygon
            if self.is_point_in_polygon((longitude, latitude), self.campus_boundary):
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
                'latitude': self.campus_center_lat,
                'longitude': self.campus_center_lon
            },
            'radius': self.accuracy_radius,
            'polygon': self.campus_boundary
        }
    
    def validate_attendance_location(self, latitude: float, longitude: float, 
                                   accuracy: Optional[float] = None, student_hostel: Optional[str] = None) -> Dict:
        """Validate location for attendance marking within campus boundary"""
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
