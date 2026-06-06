const db = require('../config/db');

exports.getAllRFQs = async (req, res) => {
  try {
    const rfqs = await db('rfqs')
      .select('rfqs.*', 'users.firstName', 'users.lastName')
      .leftJoin('users', 'rfqs.createdBy', 'users.id')
      .orderBy('rfqs.created_at', 'desc');
    
    // Attach items count
    for (let rfq of rfqs) {
      const items = await db('rfq_items').where({ rfqId: rfq.id });
      rfq.items = items;
      
      const quotes = await db('quotations').where({ rfqId: rfq.id }).count('* as count').first();
      rfq.quotesCount = quotes.count;
    }

    res.json(rfqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching RFQs' });
  }
};

exports.getRFQById = async (req, res) => {
  try {
    const rfq = await db('rfqs').where({ id: req.params.id }).first();
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });

    const items = await db('rfq_items').where({ rfqId: rfq.id });
    rfq.items = items;

    res.json(rfq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching RFQ' });
  }
};

exports.createRFQ = async (req, res) => {
  try {
    const { title, category, deadline, description, items } = req.body;
    const rfqNumber = `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const [rfqId] = await db('rfqs').insert({
      rfqNumber,
      title,
      category,
      deadline,
      description,
      status: 'Sent',
      createdBy: req.userId
    });

    if (items && items.length > 0) {
      const rfqItems = items.map(item => ({
        rfqId,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit || 'pcs'
      }));
      await db('rfq_items').insert(rfqItems);
    }

    res.status(201).json({ message: 'RFQ created successfully', rfqId, rfqNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating RFQ' });
  }
};
