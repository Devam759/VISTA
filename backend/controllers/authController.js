import { authenticateStudent, authenticateWarden } from '../services/authService.js';

export const studentLogin = async (req, res) => {
  try {
    const { email, password, latitude, longitude, accuracy } = req.body;
    console.log('📧 Student login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates required for login' });
    }

    const result = await authenticateStudent(email, password, latitude, longitude, accuracy);
    res.json(result);
  } catch (error) {
    console.error('Student login error:', error);
    res.status(401).json({ error: error.message || 'Login failed' });
  }
};

export const wardenLogin = async (req, res) => {
  try {
    const { email, password, latitude, longitude, accuracy } = req.body;
    console.log('📧 Warden login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates required for login' });
    }

    const result = await authenticateWarden(email, password, latitude, longitude, accuracy);
    res.json(result);
  } catch (error) {
    console.error('Warden login error:', error);
    res.status(401).json({ error: error.message || 'Login failed' });
  }
};
