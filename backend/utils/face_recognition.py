"""
Face Recognition Utility - Face Recognition Processing
"""
import base64
import io
from PIL import Image
from typing import Optional, List, Dict, Tuple

# Optional imports for face recognition
try:
    import face_recognition
    import numpy as np
    FACE_RECOGNITION_AVAILABLE = True
except ImportError:
    FACE_RECOGNITION_AVAILABLE = False
    face_recognition = None
    np = None

class FaceRecognitionManager:
    """Face recognition manager for attendance verification"""
    
    def __init__(self, tolerance: float = 0.6, model: str = 'hog'):
        self.tolerance = tolerance
        self.model = model
    
    def decode_base64_image(self, image_data: str) -> Optional['np.ndarray']:
        """Decode base64 image data to numpy array"""
        if not FACE_RECOGNITION_AVAILABLE:
            return None
            
        try:
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode base64
            image_bytes = base64.b64decode(image_data)
            
            # Convert to PIL Image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Convert to numpy array
            return np.array(image)
            
        except Exception as e:
            print(f"Error decoding image: {e}")
            return None
    
    def extract_face_encoding(self, image: 'np.ndarray') -> Optional[List[float]]:
        """Extract face encoding from image"""
        if not FACE_RECOGNITION_AVAILABLE:
            # Return a dummy encoding for testing
            return [0.1] * 128
        
        try:
            # Find face locations
            face_locations = face_recognition.face_locations(image, model=self.model)
            
            if len(face_locations) == 0:
                return None
            
            # Get face encodings
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            if len(face_encodings) == 0:
                return None
            
            # Return the first face encoding
            return face_encodings[0].tolist()
            
        except Exception as e:
            print(f"Error extracting face encoding: {e}")
            return None
    
    def compare_faces(self, known_encoding: List[float], unknown_encoding: List[float]) -> Tuple[bool, float]:
        """Compare two face encodings"""
        if not FACE_RECOGNITION_AVAILABLE:
            # Return dummy result for testing
            return True, 95.0
        
        try:
            # Convert to numpy arrays
            known_array = np.array(known_encoding)
            unknown_array = np.array(unknown_encoding)
            
            # Calculate face distance
            face_distance = face_recognition.face_distance([known_array], unknown_array)[0]
            
            # Check if faces match (lower distance = better match)
            match = face_distance <= self.tolerance
            
            # Convert distance to confidence score (0-100)
            confidence = max(0, (1 - face_distance) * 100)
            
            return match, confidence
            
        except Exception as e:
            print(f"Error comparing faces: {e}")
            return False, 0.0
    
    def process_attendance_image(self, image_data: str, known_encodings: List[List[float]]) -> Dict:
        """Process attendance image and compare with known face encodings"""
        try:
            # Decode image
            image = self.decode_base64_image(image_data)
            if image is None:
                return {
                    'success': False,
                    'reason': 'Failed to decode image',
                    'confidence': 0.0,
                    'match': False
                }
            
            # Extract face encoding from attendance image
            unknown_encoding = self.extract_face_encoding(image)
            if unknown_encoding is None:
                return {
                    'success': False,
                    'reason': 'No face detected in image',
                    'confidence': 0.0,
                    'match': False
                }
            
            # Compare with known encodings
            best_match = False
            best_confidence = 0.0
            
            for known_encoding in known_encodings:
                match, confidence = self.compare_faces(known_encoding, unknown_encoding)
                
                if confidence > best_confidence:
                    best_confidence = confidence
                    best_match = match
            
            return {
                'success': True,
                'reason': 'Face recognition completed',
                'confidence': best_confidence,
                'match': best_match
            }
            
        except Exception as e:
            return {
                'success': False,
                'reason': f'Face recognition error: {str(e)}',
                'confidence': 0.0,
                'match': False
            }
    
    def enroll_face(self, image_data: str) -> Dict:
        """Enroll a new face from image data"""
        try:
            # Decode image
            image = self.decode_base64_image(image_data)
            if image is None:
                return {
                    'success': False,
                    'reason': 'Failed to decode image',
                    'encoding': None,
                    'quality_score': 0.0
                }
            
            # Extract face encoding
            encoding = self.extract_face_encoding(image)
            if encoding is None:
                return {
                    'success': False,
                    'reason': 'No face detected in image',
                    'encoding': None,
                    'quality_score': 0.0
                }
            
            # Calculate quality score (simplified)
            quality_score = min(100.0, len(encoding) * 2)  # Simple quality metric
            
            return {
                'success': True,
                'reason': 'Face enrolled successfully',
                'encoding': encoding,
                'quality_score': quality_score
            }
            
        except Exception as e:
            return {
                'success': False,
                'reason': f'Face enrollment error: {str(e)}',
                'encoding': None,
                'quality_score': 0.0
            }
