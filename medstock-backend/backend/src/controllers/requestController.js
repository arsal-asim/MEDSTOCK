const Pharmacy  = require('../models/Pharmacy');
const Request   = require('../models/Request');
const Repayment = require('../models/Repayment');
const { ok, fail } = require('../middlewares/response');

const createRequest = async (req, res) => {
  try {
    const { medicine_name, quantity } = req.body;
    if (!medicine_name || !quantity) return fail(res, 'Medicine name and quantity are required', 400);
    if (quantity <= 0)               return fail(res, 'Quantity must be greater than zero', 400);

    const pharmacy = await Pharmacy.findOne({ userId: req.user.id });
    if (!pharmacy) return fail(res, 'Pharmacy not found', 404);

    const request = await Request.create({
      pharmacyId:   pharmacy._id,
      medicineName: medicine_name.trim(),
      quantity,
    });
    return ok(res, { requestId: request._id }, 'Request submitted successfully', 201);
  } catch (err) {
    return fail(res, err.message);
  }
};

const getMyRequests = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ userId: req.user.id });
    if (!pharmacy) return ok(res, { requests: [] });

    const requests = await Request.find({ pharmacyId: pharmacy._id }).sort({ createdAt: -1 });
    const mapped   = requests.map(r => ({
      id:           r._id,
      medicine_name: r.medicineName,
      quantity:     r.quantity,
      status:       r.status,
      admin_note:   r.adminNote,
      created_at:   r.createdAt,
      updated_at:   r.updatedAt,
    }));
    return ok(res, { requests: mapped });
  } catch (err) {
    return fail(res, err.message);
  }
};

const getAllRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const requests = await Request.find(filter)
      .populate('pharmacyId', 'name location')
      .sort({ createdAt: -1 });

    const mapped = requests.map(r => ({
      id:            r._id,
      medicine_name: r.medicineName,
      quantity:      r.quantity,
      status:        r.status,
      admin_note:    r.adminNote,
      created_at:    r.createdAt,
      updated_at:    r.updatedAt,
      pharmacy_name: r.pharmacyId?.name,
      location:      r.pharmacyId?.location,
    }));
    return ok(res, { requests: mapped });
  } catch (err) {
    return fail(res, err.message);
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status, admin_note, amount, due_date } = req.body;

    if (!['approved', 'rejected'].includes(status))
      return fail(res, 'Status must be approved or rejected', 400);

    const request = await Request.findById(req.params.id);
    if (!request)                     return fail(res, 'Request not found', 404);
    if (request.status !== 'pending') return fail(res, 'Only pending requests can be updated', 400);

    if (status === 'approved') {
      if (!amount || !due_date) return fail(res, 'Amount and due date are required when approving', 400);
      await Repayment.create({
        requestId:  request._id,
        pharmacyId: request.pharmacyId,
        amount,
        dueDate:    new Date(due_date),
      });
    }

    request.status    = status;
    request.adminNote = admin_note || '';
    await request.save();

    return ok(res, {}, `Request ${status} successfully`);
  } catch (err) {
    return fail(res, err.message);
  }
};

module.exports = { createRequest, getMyRequests, getAllRequests, updateRequestStatus };
