const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const activeRFQs = await db('rfqs').whereIn('status', ['Sent', 'In Progress']).count('* as count').first();
    const pendingApprovals = await db('approvals').where({ status: 'Pending' }).count('* as count').first();
    
    // Total PO amount this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const pos = await db('purchase_orders')
      .where('created_at', '>=', startOfMonth.toISOString())
      .sum('amount as totalAmount')
      .first();

    const overdueInvoices = await db('invoices').where({ status: 'Overdue' }).count('* as count').first();

    res.json({
      activeRFQs: activeRFQs.count,
      pendingApprovals: pendingApprovals.count,
      totalPOMonth: pos.totalAmount || 0,
      overdueInvoices: overdueInvoices.count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
