"""
Geofencing utilities for campus boundary verification.
"""
from __future__ import annotations

import json
import math
from typing import Dict, List, Optional, Tuple

from flask import current_app


class GeofencingManager:
    """Manager responsible for campus geofence verification."""

    def __init__(
        self,
        campus_lat: Optional[float] = None,
        campus_lon: Optional[float] = None,
        accuracy_radius: Optional[int] = None,
        polygon: Optional[List[Tuple[float, float]]] = None,
    ) -> None:
        config = current_app.config if current_app else {}
        self.campus_lat = campus_lat or config.get("CAMPUS_LATITUDE", 0.0)
        self.campus_lon = campus_lon or config.get("CAMPUS_LONGITUDE", 0.0)
        self.accuracy_radius = accuracy_radius or config.get("GPS_ACCURACY_RADIUS", 150)

        if polygon is not None:
            self.campus_polygon = polygon
        else:
            raw_polygon = config.get("CAMPUS_POLYGON", "")
            if isinstance(raw_polygon, str) and raw_polygon:
                try:
                    self.campus_polygon = json.loads(raw_polygon)
                except json.JSONDecodeError:
                    self.campus_polygon = []
            else:
                self.campus_polygon = raw_polygon or []

    # ------------------------------------------------------------------
    # Geometry helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Return distance in meters between two geo coordinates."""
        radius = 6371000  # Earth radius in meters
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)

        a = (
            math.sin(d_lat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(d_lon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return radius * c

    @staticmethod
    def _point_in_polygon(lat: float, lon: float, polygon: List[Tuple[float, float]]) -> bool:
        """Ray-casting algorithm to check if point is inside polygon."""
        if not polygon:
            return False

        inside = False
        x, y = lon, lat
        n = len(polygon)

        for i in range(n):
            j = (i - 1) % n
            xi, yi = polygon[i][1], polygon[i][0]
            xj, yj = polygon[j][1], polygon[j][0]

            intersects = ((yi > y) != (yj > y)) and (
                x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi
            )
            if intersects:
                inside = not inside
        return inside

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def get_campus_boundary(self) -> Dict[str, object]:
        """Return configured campus boundary information."""
        return {
            "center": {
                "latitude": self.campus_lat,
                "longitude": self.campus_lon,
            },
            "radius": self.accuracy_radius,
            "polygon": self.campus_polygon,
        }

    def verify_location(
        self, latitude: float, longitude: float, accuracy: Optional[float] = None
    ) -> Dict[str, object]:
        """Verify whether the coordinates fall within the campus boundary."""
        if latitude is None or longitude is None:
            return {
                "gps_verified": False,
                "reason": "Latitude and longitude are required",
            }

        # Check polygon containment if available
        inside_polygon = False
        if self.campus_polygon:
            inside_polygon = self._point_in_polygon(latitude, longitude, self.campus_polygon)

        # Distance from center
        distance = self._haversine_distance(latitude, longitude, self.campus_lat, self.campus_lon)

        # Determine accuracy constraint
        if accuracy is not None and accuracy > self.accuracy_radius:
            return {
                "gps_verified": False,
                "reason": f"GPS accuracy too low ({accuracy:.1f}m > {self.accuracy_radius}m)",
                "distance": round(distance, 2),
            }

        if self.campus_polygon:
            if inside_polygon:
                return {
                    "gps_verified": True,
                    "reason": "Location inside campus boundary polygon",
                    "distance": round(distance, 2),
                }
            return {
                "gps_verified": False,
                "reason": f"Outside campus polygon ({distance:.1f}m from center)",
                "distance": round(distance, 2),
            }

        # Fallback to radius check if no polygon configured
        if distance <= self.accuracy_radius:
            return {
                "gps_verified": True,
                "reason": "Location within campus radius",
                "distance": round(distance, 2),
            }

        return {
            "gps_verified": False,
            "reason": f"Outside campus radius ({distance:.1f}m from center)",
            "distance": round(distance, 2),
        }


__all__ = ["GeofencingManager"]
