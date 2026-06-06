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

    if (status === 'Approved') {
      // Auto-generate PO and Invoice
      const approval = await db('approvals').where({ id: req.params.id }).first();
      const quotation = await db('quotations').where({ id: approval.quotationId }).first();
      
      if (quotation) {
        const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const [poId] = await db('purchase_orders').insert({
          quotationId: quotation.id,
          vendorId: quotation.vendorId,
          poNumber,
          amount: quotation.grandTotal,
          status: 'Active',
          expectedDelivery: new Date(Date.now() + quotation.deliveryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

        const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        await db('invoices').insert({
          poId,
          invoiceNumber,
          amount: quotation.grandTotal,
          status: 'Pending',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }
    }

    res.json({ message: `Approval ${status} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating approval' });
  }
};

exports.createApproval = async (req, res) => {
  try {
    const { quotationId } = req.body;
    
    // Set status of quotation to 'Selected'
    await db('quotations').where({ id: quotationId }).update({ status: 'Selected' });

    // Create a new approval request in the database
    const [id] = await db('approvals').insert({
      quotationId,
      step: 'L1',
      status: 'Pending',
      remarks: ''
    });

    res.status(201).json({ message: 'Approval workflow initiated successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating approval' });
  }
};
