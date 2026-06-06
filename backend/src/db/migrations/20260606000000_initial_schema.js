exports.up = function(knex) {
  return knex.schema
    // Users Table
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('firstName').notNullable();
      table.string('lastName').notNullable();
      table.string('email').notNullable().unique();
      table.string('phone');
      table.string('role').notNullable().defaultTo('procurement_officer'); // procurement_officer, approver, vendor
      table.string('organization');
      table.string('country');
      table.text('additionalInfo');
      table.string('passwordHash').notNullable();
      table.timestamps(true, true);
    })
    // Vendors Table
    .createTable('vendors', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('category').notNullable();
      table.string('gstNo').notNullable();
      table.string('contactPerson');
      table.string('email').notNullable().unique();
      table.string('phone');
      table.string('status').defaultTo('Pending'); // Active, Pending, Blocked
      table.float('rating').defaultTo(0);
      table.timestamps(true, true);
    })
    // RFQs Table
    .createTable('rfqs', table => {
      table.increments('id').primary();
      table.string('rfqNumber').notNullable().unique();
      table.string('title').notNullable();
      table.string('category').notNullable();
      table.date('deadline').notNullable();
      table.text('description');
      table.string('status').defaultTo('Draft'); // Draft, Sent, In Progress, Closed
      table.integer('createdBy').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.timestamps(true, true);
    })
    // RFQ Items Table
    .createTable('rfq_items', table => {
      table.increments('id').primary();
      table.integer('rfqId').unsigned().references('id').inTable('rfqs').onDelete('CASCADE');
      table.string('name').notNullable();
      table.integer('quantity').notNullable();
      table.string('unit').notNullable();
    })
    // Quotations Table
    .createTable('quotations', table => {
      table.increments('id').primary();
      table.string('qtNumber').notNullable().unique();
      table.integer('rfqId').unsigned().references('id').inTable('rfqs').onDelete('CASCADE');
      table.integer('vendorId').unsigned().references('id').inTable('vendors').onDelete('CASCADE');
      table.float('subtotal').notNullable();
      table.float('gstPercent').notNullable().defaultTo(18);
      table.float('gstAmount').notNullable();
      table.float('grandTotal').notNullable();
      table.integer('deliveryDays').notNullable();
      table.text('notes');
      table.string('status').defaultTo('Submitted'); // Submitted, Selected, Rejected
      table.timestamps(true, true);
    })
    // Quotation Items Table
    .createTable('quotation_items', table => {
      table.increments('id').primary();
      table.integer('quotationId').unsigned().references('id').inTable('quotations').onDelete('CASCADE');
      table.string('name').notNullable();
      table.integer('quantity').notNullable();
      table.float('unitPrice').notNullable();
      table.float('totalPrice').notNullable();
    })
    // Approvals Table
    .createTable('approvals', table => {
      table.increments('id').primary();
      table.integer('quotationId').unsigned().references('id').inTable('quotations').onDelete('CASCADE');
      table.integer('approverId').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('step').notNullable(); // L1, L2
      table.string('status').defaultTo('Pending'); // Pending, Approved, Rejected
      table.text('remarks');
      table.timestamps(true, true);
    })
    // Purchase Orders Table
    .createTable('purchase_orders', table => {
      table.increments('id').primary();
      table.integer('quotationId').unsigned().references('id').inTable('quotations').onDelete('CASCADE');
      table.integer('vendorId').unsigned().references('id').inTable('vendors').onDelete('CASCADE');
      table.string('poNumber').notNullable().unique();
      table.float('amount').notNullable();
      table.string('status').defaultTo('Draft'); // Draft, Active, Approved, Completed
      table.date('expectedDelivery');
      table.timestamps(true, true);
    })
    // Invoices Table
    .createTable('invoices', table => {
      table.increments('id').primary();
      table.integer('poId').unsigned().references('id').inTable('purchase_orders').onDelete('CASCADE');
      table.string('invoiceNumber').notNullable().unique();
      table.float('amount').notNullable();
      table.string('status').defaultTo('Pending'); // Pending, Paid, Overdue
      table.date('dueDate');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('invoices')
    .dropTableIfExists('purchase_orders')
    .dropTableIfExists('approvals')
    .dropTableIfExists('quotation_items')
    .dropTableIfExists('quotations')
    .dropTableIfExists('rfq_items')
    .dropTableIfExists('rfqs')
    .dropTableIfExists('vendors')
    .dropTableIfExists('users');
};
