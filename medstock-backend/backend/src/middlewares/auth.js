const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { fail } = require('./response');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return fail(res, 'Not authorized', 401);

    const token = header.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return fail(res, 'Invalid or expired token', 401);
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return fail(res, 'User not found', 401);

    req.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    return fail(res, 'Auth error', 500);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return fail(res, 'Admin access required', 403);
  next();
};

const pharmacyOnly = (req, res, next) => {
  if (req.user?.role !== 'pharmacy') return fail(res, 'Pharmacy access required', 403);
  next();
};

module.exports = { protect, adminOnly, pharmacyOnly };
