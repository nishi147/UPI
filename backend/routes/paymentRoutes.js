const express = require('express');
const router = express.Router();
const { uploadPaymentProof, getMyPayments, getAllPayments, updatePaymentStatus } = require('../controllers/paymentController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/upload', protect, upload.single('screenshot'), uploadPaymentProof);
router.get('/my-payments', protect, getMyPayments);
router.get('/admin/all', protect, admin, getAllPayments);
router.put('/admin/:id/status', protect, admin, updatePaymentStatus);

module.exports = router;
