const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided.' });

  const tokenString = token.split(' ')[1];

  jwt.verify(tokenString, process.env.JWT_SECRET || 'vendorbridge-secret-key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized!' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };
