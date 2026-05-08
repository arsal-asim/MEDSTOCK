const Pharmacy  = require('../models/Pharmacy');
const Repayment = require('../models/Repayment');
const { ok, fail } = require('../middlewares/response');

const getMyRepayments = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ userId: req.user.id });
    if (!pharmacy) return ok(res, { repayments: [] });

    const repayments = await Repayment.find({ pharmacyId: pharmacy._id })
      .populate('requestId', 'medicineName quantity')
      .sort({ createdAt: -1 });

    const mapped = repayments.map(r => ({
      id:            r._id,
      amount:        r.amount,
      due_date:      r.dueDate,
      status:        r.status,
      paid_at:       r.paidAt,
      created_at:    r.createdAt,
      medicine_name: r.requestId?.medicineName,
      quantity:      r.requestId?.quantity,
    }));
    return ok(res, { repayments: mapped });
  } catch (err) {
    return fail(res, err.message);
  }
};

const getAllRepayments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const repayments = await Repayment.find(filter)
      .populate('requestId',  'medicineName quantity')
      .populate('pharmacyId', 'name')
      .sort({ dueDate: 1 });

    const mapped = repayments.map(r => ({
      id:            r._id,
      amount:        r.amount,
      due_date:      r.dueDate,
      status:        r.status,
      paid_at:       r.paidAt,
      created_at:    r.createdAt,
      medicine_name: r.requestId?.medicineName,
      quantity:      r.requestId?.quantity,
      pharmacy_name: r.pharmacyId?.name,
    }));
    return ok(res, { repayments: mapped });
  } catch (err) {
    return fail(res, err.message);
  }
};

const markPaid = async (req, res) => {
  try {
    const repayment = await Repayment.findById(req.params.id);
    if (!repayment)                  return fail(res, 'Repayment not found', 404);
    if (repayment.status === 'paid') return fail(res, 'Already marked as paid', 400);

    repayment.status = 'paid';
    repayment.paidAt = new Date();
    await repayment.save();
    return ok(res, {}, 'Repayment marked as paid');
  } catch (err) {
    return fail(res, err.message);
  }
};

module.exports = { getMyRepayments, getAllRepayments, markPaid };
