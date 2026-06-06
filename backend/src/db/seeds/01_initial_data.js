const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Clear all tables
  await knex('invoices').del();
  await knex('purchase_orders').del();
  await knex('approvals').del();
  await knex('quotation_items').del();
  await knex('quotations').del();
  await knex('rfq_items').del();
  await knex('rfqs').del();
  await knex('vendors').del();
  await knex('users').del();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 1 Admin User
  const [adminId] = await knex('users').insert([
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@vendorbridge.com',
      phone: '9876543210',
      role: 'admin',
      organization: 'VendorBridge Corp',
      country: 'India',
      passwordHash
    }
  ]);

  // 1 Demo Vendor
  const [vendorId] = await knex('vendors').insert([
    { name: 'TechCore Ltd', category: 'IT Hardware', gstNo: '27AABCT4321A1Z9', contactPerson: 'Raj Patel', email: 'raj@techcore.com', phone: '9876543211', status: 'Active', rating: 4.5 }
  ]);

  // 1 Demo RFQ
  const [rfqId] = await knex('rfqs').insert([
    { rfqNumber: 'RFQ-2026-001', title: 'Office Laptop Procurement', category: 'IT Hardware', deadline: '2026-07-15', description: '10 laptops needed for new office', status: 'Sent', createdBy: adminId }
  ]);

  // 1 RFQ Item
  await knex('rfq_items').insert([
    { rfqId: rfqId, name: 'Business Laptop 14-inch', quantity: 10, unit: 'pcs' }
  ]);

  // 1 Demo Quotation
  const [qtId] = await knex('quotations').insert([
    { qtNumber: 'QT-2026-001', rfqId: rfqId, vendorId: vendorId, subtotal: 425000, gstPercent: 18, gstAmount: 76500, grandTotal: 501500, deliveryDays: 7, status: 'Submitted', notes: 'Free delivery included' }
  ]);

  // 1 Quotation Item
  await knex('quotation_items').insert([
    { quotationId: qtId, name: 'Business Laptop 14-inch', quantity: 10, unitPrice: 42500, totalPrice: 425000 }
  ]);

  // 1 Demo Approval (Pending)
  await knex('approvals').insert([
    { quotationId: qtId, approverId: adminId, step: 'L1', status: 'Pending', remarks: null }
  ]);

  // 1 Demo Purchase Order
  const [poId] = await knex('purchase_orders').insert([
    { quotationId: qtId, vendorId: vendorId, poNumber: 'PO-2026-001', amount: 501500, status: 'Active', expectedDelivery: '2026-07-22' }
  ]);

  // 1 Demo Invoice
  await knex('invoices').insert([
    { poId: poId, invoiceNumber: 'INV-2026-001', amount: 501500, status: 'Pending', dueDate: '2026-08-22' }
  ]);
};
