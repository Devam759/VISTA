import { authenticateStudent, authenticateWarden } from '../services/authService.js';

export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('📧 Student login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await authenticateStudent(email, password);
    res.json(result);
  } catch (error) {
    console.error('Student login error:', error);
    res.status(401).json({ error: error.message || 'Login failed' });
  }
};

export const wardenLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('📧 Warden login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await authenticateWarden(email, password);
    res.json(result);
  } catch (error) {
    console.error('Warden login error:', error);
    res.status(401).json({ error: error.message || 'Login failed' });
  }
};
