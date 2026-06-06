const db = require('../config/db');

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await db('invoices')
      .select(
        'invoices.*',
        'purchase_orders.poNumber',
        'vendors.name as vendorName'
      )
      .leftJoin('purchase_orders', 'invoices.poId', 'purchase_orders.id')
      .leftJoin('vendors', 'purchase_orders.vendorId', 'vendors.id')
      .orderBy('invoices.created_at', 'desc');

    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching invoices' });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    await db('invoices')
      .where({ id: req.params.id })
      .update({ status });

    res.json({ message: `Invoice marked as ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating invoice' });
  }
};
