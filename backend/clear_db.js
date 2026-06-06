const knex = require('knex');
const knexfile = require('./knexfile');

const db = knex(knexfile.development);

async function clearDB() {
  try {
    console.log('Clearing database...');
    await db('invoices').del();
    await db('purchase_orders').del();
    await db('approvals').del();
    await db('quotation_items').del();
    await db('quotations').del();
    await db('rfq_items').del();
    await db('rfqs').del();
    await db('vendors').del();
    
    // Keep the admin user
    await db('users').whereNot('role', 'admin').del();

    console.log('Database cleared successfully! Kept admin user.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    db.destroy();
  }
}

clearDB();
