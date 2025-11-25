import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { checkPointWithTolerance } from '../utils/pointInPolygon.js';

// Cache for campus polygon
let polygonCache = null;
let polygonCacheTime = 0;
const POLYGON_CACHE_TTL = 5 * 60 * 1000;

async function getCampusPolygon() {
  const now = Date.now();
  if (polygonCache && (now - polygonCacheTime) < POLYGON_CACHE_TTL) {
    return polygonCache;
  }

  const rows = await prisma.campusPolygon.findMany({
    orderBy: { pointOrder: 'asc' }
  });

  if (rows.length < 3) {
    throw new Error('Campus polygon not configured');
  }

  const polygon = rows.map(r => ({ lat: r.lat, lng: r.lng }));
  
  if (polygon.length > 0) {
    const first = polygon[0];
    const last = polygon[polygon.length - 1];
    if (first.lat !== last.lat || first.lng !== last.lng) {
      polygon.push({ lat: first.lat, lng: first.lng });
    }
  }

  polygonCache = polygon;
  polygonCacheTime = now;
  return polygon;
}

/**
 * Verify geofence during login
 */
async function verifyGeofenceLogin(latitude, longitude, accuracy) {
  if (!latitude || !longitude) {
    throw new Error('Location coordinates required for login');
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const gpsAccuracy = accuracy ? parseFloat(accuracy) : null;

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error('Invalid coordinates provided');
  }

  const polygon = await getCampusPolygon();
  const result = checkPointWithTolerance(lat, lng, polygon, gpsAccuracy);

  if (!result.inside) {
    const bounds = {
      minLat: Math.min(...polygon.map(p => p.lat)),
      maxLat: Math.max(...polygon.map(p => p.lat)),
      minLng: Math.min(...polygon.map(p => p.lng)),
      maxLng: Math.max(...polygon.map(p => p.lng))
    };
    
    console.log(`❌ Geofence verification failed for login`);
    console.log(`   User Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    console.log(`   Distance to boundary: ${Math.round(result.distanceToBoundary || 0)}m`);
    
    throw new Error(`Location verification failed: You are ${Math.round(result.distanceToBoundary || 0)}m outside campus boundary. You must be on campus to login.`);
  }

  console.log(`✅ Geofence verified for login`);
}

export const authenticateStudent = async (email, password, latitude, longitude, accuracy) => {
  const emailLower = email.trim().toLowerCase();
  console.log(`🔍 Authenticating student: ${emailLower}`);
  
  // GEOFENCE CHECK - REQUIRED FOR LOGIN
  console.log(`📍 Verifying geofence for login...`);
  await verifyGeofenceLogin(latitude, longitude, accuracy);
  
  const student = await prisma.student.findUnique({
    where: { email: emailLower },
    include: { hostel: true }
  });

  if (!student) {
    console.log(`❌ Student not found: ${emailLower}`);
    throw new Error('Invalid credentials');
  }

  console.log(`✅ Student found: ${student.name}`);
  const validPassword = await bcrypt.compare(password, student.password);
  console.log(`🔐 Password valid: ${validPassword}`);
  
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: student.id, role: 'student', email: student.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    role: 'student',
    user: {
      id: student.id,
      name: student.name,
      roll: student.rollNo,
      email: student.email,
      hostel: student.hostel.name,
      room: student.roomNo,
      program: student.program,
      faceIdUrl: student.faceIdUrl,
      mobile: student.mobile,
      address: student.address
    }
  };
};

export const authenticateWarden = async (email, password, latitude, longitude, accuracy) => {
  const emailLower = email.trim().toLowerCase();
  console.log(`🔍 Authenticating warden: ${emailLower}`);
  
  // GEOFENCE CHECK - REQUIRED FOR LOGIN
  console.log(`📍 Verifying geofence for login...`);
  await verifyGeofenceLogin(latitude, longitude, accuracy);
  
  const warden = await prisma.warden.findUnique({
    where: { email: emailLower },
    include: { hostel: true }
  });

  if (!warden) {
    console.log(`❌ Warden not found: ${emailLower}`);
    throw new Error('Invalid credentials');
  }

  console.log(`✅ Warden found: ${warden.name}`);
  const validPassword = await bcrypt.compare(password, warden.password);
  console.log(`🔐 Password valid: ${validPassword}`);
  
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: warden.id, role: 'warden', email: warden.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    role: 'warden',
    user: {
      id: warden.id,
      name: warden.name,
      email: warden.email,
      hostel: warden.hostel.name,
      hostelId: warden.hostelId
    }
  };
};
