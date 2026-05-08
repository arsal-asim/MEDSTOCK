const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name:     { type: String, required: true, trim: true },
  location: { type: String, default: '' },
  status:   { type: String, enum: ['active', 'suspended'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
