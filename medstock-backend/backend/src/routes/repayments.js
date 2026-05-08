const router = require('express').Router();
const { getMyRepayments } = require('../controllers/repaymentController');
const { protect, pharmacyOnly } = require('../middlewares/auth');
router.get('/', protect, pharmacyOnly, getMyRepayments);
module.exports = router;
