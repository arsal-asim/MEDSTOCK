const Pharmacy  = require('../models/Pharmacy');
const Request   = require('../models/Request');
const Repayment = require('../models/Repayment');
const { ok, fail } = require('../middlewares/response');

const getDashboard = async (req, res) => {
  try {
    const total_pharmacies   = await Pharmacy.countDocuments();
    const total_requests     = await Request.countDocuments();
    const pending            = await Request.countDocuments({ status: 'pending' });
    const approved           = await Request.countDocuments({ status: 'approved' });
    const rejected           = await Request.countDocuments({ status: 'rejected' });
    const pending_repayments = await Repayment.countDocuments({ status: 'pending' });

    const creditAgg  = await Repayment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const total_credit = creditAgg[0]?.total || 0;

    const recentDocs = await Request.find()
      .populate('pharmacyId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recent = recentDocs.map(r => ({
      id:            r._id,
      medicine_name: r.medicineName,
      quantity:      r.quantity,
      status:        r.status,
      created_at:    r.createdAt,
      pharmacy_name: r.pharmacyId?.name,
    }));

    return ok(res, {
      stats: { total_pharmacies, total_requests, pending, approved, rejected, pending_repayments, total_credit },
      recent,
    });
  } catch (err) {
    return fail(res, err.message);
  }
};

const getPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const mapped = await Promise.all(pharmacies.map(async p => ({
      id:             p._id,
      name:           p.name,
      location:       p.location,
      status:         p.status,
      created_at:     p.createdAt,
      owner_name:     p.userId?.name,
      email:          p.userId?.email,
      total_requests: await Request.countDocuments({ pharmacyId: p._id }),
    })));

    return ok(res, { pharmacies: mapped });
  } catch (err) {
    return fail(res, err.message);
  }
};

module.exports = { getDashboard, getPharmacies };
