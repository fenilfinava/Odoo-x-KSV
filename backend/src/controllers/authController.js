const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'vendorbridge-secret-key';

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, organization, country, additionalInfo, password } = req.body;

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const countResult = await db('users').count('* as count').first();
    const userCount = countResult.count;

    const [id] = await db('users').insert({
      firstName,
      lastName,
      email,
      phone,
      role: userCount === 0 ? 'admin' : (role || 'procurement_officer'),
      organization,
      country,
      additionalInfo,
      passwordHash
    });

    res.status(201).json({ message: 'User registered successfully', userId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
