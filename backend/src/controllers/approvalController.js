const db = require('../config/db');

exports.getAllApprovals = async (req, res) => {
  try {
    const approvals = await db('approvals')
      .select(
        'approvals.*',
        'quotations.qtNumber',
        'quotations.grandTotal',
        'vendors.name as vendorName',
        'rfqs.title as rfqTitle',
        'users.firstName',
        'users.lastName'
      )
      .leftJoin('quotations', 'approvals.quotationId', 'quotations.id')
      .leftJoin('vendors', 'quotations.vendorId', 'vendors.id')
      .leftJoin('rfqs', 'quotations.rfqId', 'rfqs.id')
      .leftJoin('users', 'approvals.approverId', 'users.id')
      .orderBy('approvals.created_at', 'desc');

    res.json(approvals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching approvals' });
  }
};

exports.updateApprovalStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    await db('approvals')
      .where({ id: req.params.id })
      .update({ status, remarks });

    // In a real app, you would check if this was the final approval step
    // and if so, trigger Purchase Order generation automatically.

    res.json({ message: `Approval ${status} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating approval' });
  }
};
