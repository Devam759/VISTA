import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const authenticateStudent = async (email, password) => {
  const emailLower = email.trim().toLowerCase();
  
  const student = await prisma.student.findUnique({
    where: { email: emailLower },
    include: { hostel: true }
  });

  if (!student) {
    throw new Error('Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, student.password);
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
      program: student.program
    }
  };
};

export const authenticateWarden = async (email, password) => {
  const emailLower = email.trim().toLowerCase();
  
  const warden = await prisma.warden.findUnique({
    where: { email: emailLower },
    include: { hostel: true }
  });

  if (!warden) {
    throw new Error('Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, warden.password);
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
