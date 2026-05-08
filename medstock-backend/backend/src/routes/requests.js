const router = require('express').Router();
const { createRequest, getMyRequests } = require('../controllers/requestController');
const { protect, pharmacyOnly } = require('../middlewares/auth');
router.use(protect, pharmacyOnly);
router.get('/',  getMyRequests);
router.post('/', createRequest);
module.exports = router;
