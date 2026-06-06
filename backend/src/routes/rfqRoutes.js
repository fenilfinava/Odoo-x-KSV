const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfqController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', rfqController.getAllRFQs);
router.get('/:id', rfqController.getRFQById);
router.post('/', rfqController.createRFQ);

module.exports = router;
