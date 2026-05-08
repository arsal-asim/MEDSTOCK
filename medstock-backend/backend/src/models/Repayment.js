const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  requestId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Request',  required: true, unique: true },
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  amount:     { type: Number, required: true },
  dueDate:    { type: Date,   required: true },
  status:     { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidAt:     { type: Date,   default: null },
}, { timestamps: true });

module.exports = mongoose.model('Repayment', repaymentSchema);
