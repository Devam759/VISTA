"""
Face Attendance Validator Utilities
"""
from __future__ import annotations

import base64
from typing import Any, Dict, List, Optional

from .validators import Validators


class FaceAttendanceValidator:
    """Validation helpers for face-based attendance submissions."""

    REQUIRED_FIELDS: List[str] = ["face_image"]  # Location fields are optional for desktop

    @staticmethod
    def validate_submission(data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Validate payload for marking attendance with face recognition.

        Returns a dict with `valid` flag and `errors` list similar to other validators.
        """
        errors: List[str] = []

        if not isinstance(data, dict):
            return {
                "valid": False,
                "errors": ["Invalid payload: expected JSON object"],
            }

        for field in FaceAttendanceValidator.REQUIRED_FIELDS:
            if field not in data or data[field] in (None, ""):
                errors.append(f"{field} is required")

        face_image = data.get("face_image")
        if face_image and not FaceAttendanceValidator._is_base64_image(face_image):
            errors.append("face_image must be a valid base64-encoded image string")

        validators_result = Validators.validate_attendance_data(data)
        if not validators_result["valid"]:
            errors.extend(validators_result["errors"])

        return {
            "valid": len(errors) == 0,
            "errors": errors,
        }

    @staticmethod
    def _is_base64_image(value: str) -> bool:
        """Basic base64 validation for data URI or raw base64 strings."""
        if not isinstance(value, str):
            return False

        try:
            if "," in value:
                _, value = value.split(",", 1)
            base64.b64decode(value, validate=True)
            return True
        except (ValueError, TypeError):
            return False


__all__ = ["FaceAttendanceValidator"]
