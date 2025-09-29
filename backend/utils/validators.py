"""
Validators - Input validation utilities
"""
import re
from datetime import datetime, time
from typing import Dict, Any, Optional

class Validators:
    """Input validation utilities"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format"""
        pattern = r'^\+?1?\-?\.?\s?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$'
        return bool(re.match(pattern, phone.replace(' ', '')))
    
    @staticmethod
    def validate_roll_number(roll_number: str) -> bool:
        """Validate roll number format"""
        # Basic roll number validation - can be customized based on requirements
        pattern = r'^[A-Za-z0-9]{6,20}$'
        return bool(re.match(pattern, roll_number))
    
    @staticmethod
    def validate_password(password: str) -> Dict[str, Any]:
        """Validate password strength"""
        result = {
            'valid': True,
            'errors': []
        }
        
        if len(password) < 8:
            result['valid'] = False
            result['errors'].append('Password must be at least 8 characters long')
        
        if not re.search(r'[A-Z]', password):
            result['valid'] = False
            result['errors'].append('Password must contain at least one uppercase letter')
        
        if not re.search(r'[a-z]', password):
            result['valid'] = False
            result['errors'].append('Password must contain at least one lowercase letter')
        
        if not re.search(r'\d', password):
            result['valid'] = False
            result['errors'].append('Password must contain at least one digit')
        
        return result
    
    @staticmethod
    def validate_gps_coordinates(latitude: float, longitude: float) -> bool:
        """Validate GPS coordinates"""
        return (-90 <= latitude <= 90) and (-180 <= longitude <= 180)
    
    @staticmethod
    def validate_attendance_time(attendance_time: str, deadline: str = '22:30:00') -> Dict[str, Any]:
        """Validate attendance time against deadline"""
        try:
            current_time = datetime.strptime(attendance_time, '%H:%M:%S').time()
            deadline_time = datetime.strptime(deadline, '%H:%M:%S').time()
            
            if current_time <= deadline_time:
                status = 'Present'
            else:
                status = 'Late'
            
            return {
                'valid': True,
                'status': status,
                'is_late': current_time > deadline_time
            }
            
        except ValueError:
            return {
                'valid': False,
                'status': 'Invalid',
                'is_late': False
            }
    
    @staticmethod
    def validate_attendance_data(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate attendance submission data"""
        errors = []
        
        # Required fields
        required_fields = ['student_id', 'latitude', 'longitude']
        for field in required_fields:
            if field not in data or data[field] is None:
                errors.append(f'{field} is required')
        
        # Validate GPS coordinates
        if 'latitude' in data and 'longitude' in data:
            if not Validators.validate_gps_coordinates(data['latitude'], data['longitude']):
                errors.append('Invalid GPS coordinates')
        
        # Validate accuracy if provided
        if 'accuracy' in data and data['accuracy'] is not None:
            if data['accuracy'] > 500:  # 500 meters
                errors.append('GPS accuracy too low (must be less than 500m)')
        
        return {
            'valid': len(errors) == 0,
            'errors': errors
        }
    
    @staticmethod
    def validate_student_data(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate student registration data"""
        errors = []
        
        # Required fields
        required_fields = ['email', 'first_name', 'last_name', 'roll_number', 'hostel_id']
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f'{field} is required')
        
        # Validate email
        if 'email' in data and data['email']:
            if not Validators.validate_email(data['email']):
                errors.append('Invalid email format')
        
        # Validate phone if provided
        if 'phone' in data and data['phone']:
            if not Validators.validate_phone(data['phone']):
                errors.append('Invalid phone number format')
        
        # Validate roll number
        if 'roll_number' in data and data['roll_number']:
            if not Validators.validate_roll_number(data['roll_number']):
                errors.append('Invalid roll number format')
        
        # Validate password if provided
        if 'password' in data and data['password']:
            password_validation = Validators.validate_password(data['password'])
            if not password_validation['valid']:
                errors.extend(password_validation['errors'])
        
        return {
            'valid': len(errors) == 0,
            'errors': errors
        }
    
    @staticmethod
    def sanitize_input(data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize input data"""
        sanitized = {}
        
        for key, value in data.items():
            if isinstance(value, str):
                # Remove leading/trailing whitespace
                sanitized[key] = value.strip()
            else:
                sanitized[key] = value
        
        return sanitized
