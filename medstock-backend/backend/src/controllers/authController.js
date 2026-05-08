const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const { ok, fail } = require('../middlewares/response');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const register = async (req, res) => {
  try {
    const { name, email, password, pharmacyName, location } = req.body;
    if (!name || !email || !password || !pharmacyName)
      return fail(res, 'Name, email, password and pharmacy name are required', 400);

    const exists = await User.findOne({ email });
    if (exists) return fail(res, 'Email already registered', 409);

    const hashed  = await bcrypt.hash(password, 12);
    const user    = await User.create({ name, email, password: hashed, role: 'pharmacy' });
    const pharmacy = await Pharmacy.create({ userId: user._id, name: pharmacyName, location: location || '' });

    const token = signToken(user._id, user.role);
    return ok(res, {
      token,
      user: { id: user._id, name, email, role: 'pharmacy', pharmacyName, pharmacyId: pharmacy._id },
    }, 'Account created', 201);
  } catch (err) {
    return fail(res, err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return fail(res, 'Email and password are required', 400);

    const user  = await User.findOne({ email });
    if (!user)  return fail(res, 'Invalid email or password', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return fail(res, 'Invalid email or password', 401);

    let pharmacyName = null, pharmacyId = null;
    if (user.role === 'pharmacy') {
      const ph = await Pharmacy.findOne({ userId: user._id });
      if (ph) { pharmacyName = ph.name; pharmacyId = ph._id; }
    }

    const token = signToken(user._id, user.role);
    return ok(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, pharmacyName, pharmacyId },
    }, 'Login successful');
  } catch (err) {
    return fail(res, err.message);
  }
};

const getMe = async (req, res) => {
  try {
    let pharmacyName = null, pharmacyId = null;
    if (req.user.role === 'pharmacy') {
      const ph = await Pharmacy.findOne({ userId: req.user.id });
      if (ph) { pharmacyName = ph.name; pharmacyId = ph._id; }
    }
    return ok(res, { user: { ...req.user, pharmacyName, pharmacyId } });
  } catch (err) {
    return fail(res, err.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, pharmacyName, location } = req.body;
    if (name) await User.findByIdAndUpdate(req.user.id, { name });
    if (req.user.role === 'pharmacy' && (pharmacyName || location)) {
      await Pharmacy.findOneAndUpdate({ userId: req.user.id }, { name: pharmacyName, location });
    }
    return ok(res, {}, 'Profile updated');
  } catch (err) {
    return fail(res, err.message);
  }
};

module.exports = { register, login, getMe, updateProfile };
