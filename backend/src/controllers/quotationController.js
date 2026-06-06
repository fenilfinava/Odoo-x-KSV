const db = require('../config/db');

exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await db('quotations')
      .select(
        'quotations.*',
        'rfqs.title as rfqTitle',
        'vendors.name as vendorName'
      )
      .leftJoin('rfqs', 'quotations.rfqId', 'rfqs.id')
      .leftJoin('vendors', 'quotations.vendorId', 'vendors.id')
      .orderBy('quotations.created_at', 'desc');

    res.json(quotations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching quotations' });
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await db('quotations')
      .select('quotations.*', 'rfqs.title as rfqTitle', 'vendors.name as vendorName')
      .leftJoin('rfqs', 'quotations.rfqId', 'rfqs.id')
      .leftJoin('vendors', 'quotations.vendorId', 'vendors.id')
      .where({ 'quotations.id': req.params.id })
      .first();

    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });

    const items = await db('quotation_items').where({ quotationId: quotation.id });
    quotation.items = items;

    res.json(quotation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching quotation' });
  }
};

exports.createQuotation = async (req, res) => {
  try {
    const { rfqId, vendorId, subtotal, gstPercent, gstAmount, grandTotal, deliveryDays, notes, items } = req.body;
    const qtNumber = `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const [quotationId] = await db('quotations').insert({
      qtNumber,
      rfqId,
      vendorId,
      subtotal,
      gstPercent,
      gstAmount,
      grandTotal,
      deliveryDays,
      notes,
      status: 'Submitted'
    });

    if (items && items.length > 0) {
      const qItems = items.map(item => ({
        quotationId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }));
      await db('quotation_items').insert(qItems);
    }

    res.status(201).json({ message: 'Quotation submitted successfully', quotationId, qtNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting quotation' });
  }
};
