const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', quotationController.getAllQuotations);
router.get('/:id', quotationController.getQuotationById);
router.post('/', quotationController.createQuotation);

module.exports = router;
