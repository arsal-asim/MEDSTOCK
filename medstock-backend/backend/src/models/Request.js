const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  pharmacyId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  medicineName: { type: String, required: true, trim: true },
  quantity:     { type: Number, required: true, min: 1 },
  status:       { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote:    { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
