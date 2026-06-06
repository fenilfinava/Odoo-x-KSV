const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken); // Protect all vendor routes

router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);
router.post('/', vendorController.createVendor);
router.patch('/:id/status', vendorController.updateVendorStatus);

module.exports = router;
