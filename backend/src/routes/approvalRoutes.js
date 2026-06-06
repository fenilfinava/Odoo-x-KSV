const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', approvalController.getAllApprovals);
router.patch('/:id/status', approvalController.updateApprovalStatus);

module.exports = router;
