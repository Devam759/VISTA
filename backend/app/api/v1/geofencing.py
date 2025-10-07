"""
Geofencing API endpoints.
"""
from __future__ import annotations

from flask import Blueprint, jsonify, request

from utils import GeofencingManager, Validators

geofencing_bp = Blueprint("geofencing", __name__)


def _get_manager() -> GeofencingManager:
    return GeofencingManager()


@geofencing_bp.route("/boundaries", methods=["GET"])
def get_boundaries():
    """Return campus geofence boundary configuration."""
    manager = _get_manager()
    return jsonify({"success": True, "boundaries": manager.get_campus_boundary()})


@geofencing_bp.route("/verify", methods=["POST"])
def verify_location():
    """Verify if provided coordinates are within campus boundary."""
    data = request.get_json() or {}

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    accuracy = data.get("accuracy")

    if latitude is None or longitude is None:
        return (
            jsonify({
                "success": False,
                "error": "Latitude and longitude are required",
            }),
            400,
        )

    if not Validators.validate_gps_coordinates(latitude, longitude):
        return (
            jsonify({
                "success": False,
                "error": "Invalid GPS coordinates",
            }),
            400,
        )

    manager = _get_manager()
    result = manager.verify_location(latitude, longitude, accuracy)

    return jsonify({"success": result.get("gps_verified", False), "verification": result})


@geofencing_bp.route("/test", methods=["POST"])
def test_coordinates():
    """Diagnostic endpoint mirroring /verify but always returns 200."""
    data = request.get_json() or {}
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    accuracy = data.get("accuracy")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "verification": {
                "gps_verified": False,
                "reason": "Latitude and longitude are required",
            },
        })

    if not Validators.validate_gps_coordinates(latitude, longitude):
        return jsonify({
            "success": False,
            "verification": {
                "gps_verified": False,
                "reason": "Invalid GPS coordinates",
            },
        })

    manager = _get_manager()
    result = manager.verify_location(latitude, longitude, accuracy)

    return jsonify({"success": result.get("gps_verified", False), "verification": result})
