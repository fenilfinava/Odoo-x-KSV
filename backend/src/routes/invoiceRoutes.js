const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', invoiceController.getAllInvoices);
router.patch('/:id/status', invoiceController.updateInvoiceStatus);

module.exports = router;
