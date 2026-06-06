const db = require('../config/db');

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await db('vendors').select('*');
    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching vendors' });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const vendor = await db('vendors').where({ id: req.params.id }).first();
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching vendor' });
  }
};

exports.createVendor = async (req, res) => {
  try {
    const { name, category, gstNo, contactPerson, email, phone } = req.body;
    const [id] = await db('vendors').insert({
      name, category, gstNo, contactPerson, email, phone
    });
    res.status(201).json({ message: 'Vendor created successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating vendor' });
  }
};

exports.updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db('vendors').where({ id: req.params.id }).update({ status });
    res.json({ message: 'Vendor status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating vendor' });
  }
};
