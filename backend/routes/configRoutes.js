const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getConfig);
router.put('/', protect, admin, upload.single('qrCode'), updateConfig);

module.exports = router;
